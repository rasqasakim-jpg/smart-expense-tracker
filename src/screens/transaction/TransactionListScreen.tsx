import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { transactionAPI } from '../../services/transactionApi';
import { Transaction, TransactionSection, TransactionStackParamList } from '../../types/transaction';
import TransactionItem from '../../components/transaction/TransactionItem';
import ScreenHeader from '../../components/layout/ScreenHeader';
import TransactionFilterModal from '../../components/transaction/TransactionFilterModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import AnimatedButton from '../../components/common/AnimatedButton';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/designSystem';

type TransactionListScreenNavigationProp = StackNavigationProp<
  TransactionStackParamList,
  'TransactionList'
>;

interface Props {
  navigation: TransactionListScreenNavigationProp;
}

const mockCategories = [
  { id: 1, name: 'Pendapatan', type: 'INCOME' },
  { id: 2, name: 'Belanja', type: 'EXPENSE' },
  { id: 3, name: 'Tagihan', type: 'EXPENSE' },
  { id: 4, name: 'Transport', type: 'EXPENSE' },
  { id: 5, name: 'Makanan', type: 'EXPENSE' },
];

const mockWallets = [
  { id: 1, name: 'Kas' },
  { id: 2, name: 'Bank BCA' },
  { id: 3, name: 'OVO' },
  { id: 4, name: 'Tabungan' },
];

const TransactionListScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<TransactionSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  // Animation refs
  const searchSlideAnim = useRef(new Animated.Value(-100)).current;
  const listFadeAnim = useRef(new Animated.Value(0)).current;
  const itemScaleAnim = useRef(new Animated.Value(0.95)).current;

  // Entry animations
  useEffect(() => {
    if (!loading) {
      Animated.stagger(50, [
        // Search bar slide in
        Animated.spring(searchSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        
        // List fade in
        Animated.timing(listFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        
        // Items scale in
        Animated.spring(itemScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async (filters: any = {}) => {
    try {
      setLoading(true);
      
      const allFilters = {
        ...filters,
        search: searchQuery || undefined,
      };
      
      const response = await transactionAPI.getAll(allFilters);
      const transactions = response.data;
      
      const grouped = groupTransactionsByDate(transactions);
      setSections(grouped);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const groupTransactionsByDate = (transactions: Transaction[]): TransactionSection[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const todayTransactions: Transaction[] = [];
    const weekTransactions: Transaction[] = [];
    const monthTransactions: Transaction[] = [];
    
    transactions.forEach(transaction => {
      const transDate = new Date(transaction.transactionDate);
      transDate.setHours(0, 0, 0, 0);
      
      if (transDate.getTime() === today.getTime()) {
        todayTransactions.push(transaction);
      } else if (transDate >= oneWeekAgo && transDate < today) {
        weekTransactions.push(transaction);
      } else if (transDate >= oneMonthAgo && transDate < oneWeekAgo) {
        monthTransactions.push(transaction);
      }
    });
    
    const sections: TransactionSection[] = [];
    
    if (todayTransactions.length > 0) {
      sections.push({
        title: 'Hari Ini',
        data: todayTransactions,
      });
    }
    
    if (weekTransactions.length > 0) {
      sections.push({
        title: 'Minggu Ini',
        data: weekTransactions,
      });
    }
    
    if (monthTransactions.length > 0) {
      sections.push({
        title: 'Bulan Lalu',
        data: monthTransactions,
      });
    }
    
    return sections;
  };

  const handleSearch = async () => {
    await loadTransactions(activeFilters);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail', { 
      transactionId: transaction.id 
    });
  };

  const handleAddTransaction = () => {
    navigation.navigate('TransactionForm');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions(activeFilters);
  };

  const handleFilterApply = async (filters: any) => {
    setActiveFilters(filters);
    await loadTransactions(filters);
  };

  const handleClearFilters = async () => {
    setActiveFilters({});
    setSearchQuery('');
    await loadTransactions({});
  };

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderTransactionItem = ({ item, index }: { item: Transaction; index: number }) => (
    <Animated.View
      style={{
        opacity: listFadeAnim,
        transform: [{ scale: itemScaleAnim }],
      }}
    >
      <TransactionItem
        transaction={item}
        onPress={() => handleTransactionPress(item)}
      />
    </Animated.View>
  );

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Skeleton Loader
  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      {/* Search Bar Skeleton */}
      <View style={styles.skeletonSearchContainer}>
        <SkeletonLoader 
          width="100%" 
          height={40} 
          borderRadius={borderRadius.md}
        />
      </View>
      
      {/* Section Skeletons */}
      {[1, 2, 3].map((sectionIndex) => (
        <View key={sectionIndex} style={styles.skeletonSection}>
          <SkeletonLoader 
            width={120} 
            height={20} 
            borderRadius={borderRadius.sm}
            style={{ marginBottom: spacing.md }}
          />
          
          {[1, 2, 3, 4].map((itemIndex) => (
            <View key={itemIndex} style={styles.skeletonItem}>
              <SkeletonLoader 
                width={40} 
                height={40} 
                borderRadius={borderRadius.round}
                style={{ marginRight: spacing.md }}
              />
              
              <View style={styles.skeletonItemContent}>
                <SkeletonLoader 
                  width={180} 
                  height={16} 
                  borderRadius={borderRadius.sm}
                  style={{ marginBottom: spacing.xs }}
                />
                
                <View style={styles.skeletonMeta}>
                  <SkeletonLoader 
                    width={80} 
                    height={12} 
                    borderRadius={borderRadius.sm}
                    style={{ marginRight: spacing.sm }}
                  />
                  <SkeletonLoader 
                    width={100} 
                    height={12} 
                    borderRadius={borderRadius.sm}
                  />
                </View>
              </View>
              
              <SkeletonLoader 
                width={100} 
                height={20} 
                borderRadius={borderRadius.sm}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Semua Transaksi" />

      {loading ? (
        renderSkeletonLoader()
      ) : (
        <>
          {/* Search Bar dengan slide animation */}
          <Animated.View 
            style={[
              styles.searchContainer,
              { transform: [{ translateX: searchSlideAnim }] }
            ]}
          >
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={colors.secondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari transaksi..."
                placeholderTextColor={colors.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close" size={20} color={colors.secondary} />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
             <Ionicons name="funnel-outline" size={24} color={colors.primary} />
             {hasActiveFilters && (
             <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>✓</Text>
            </View>
  )}
           </TouchableOpacity>
          </Animated.View>

          {hasActiveFilters && (
            <Animated.View 
              style={[
                styles.filterInfoContainer,
                { opacity: listFadeAnim }
              ]}
            >
              <Text style={styles.filterInfoText}>
                Filter aktif • 
                {activeFilters.type && ` ${activeFilters.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}`}
                {activeFilters.categoryId && ` • ${mockCategories.find(c => c.id === activeFilters.categoryId)?.name}`}
                {activeFilters.walletId && ` • ${mockWallets.find(w => w.id === activeFilters.walletId)?.name}`}
              </Text>
              <TouchableOpacity onPress={handleClearFilters}>
                <Text style={styles.clearFilterText}>Hapus</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Transaction List dengan fade animation */}
          <Animated.View style={{ flex: 1, opacity: listFadeAnim }}>
            <FlatList
              data={sections}
              keyExtractor={(item, index) => `${item.title}-${index}`}
              renderItem={({ item: section, index: sectionIndex }) => (
                <Animated.View
                  style={{
                    opacity: listFadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    transform: [
                      {
                        translateY: listFadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20 * sectionIndex, 0],
                        }),
                      },
                    ],
                  }}
                >
                  {renderSectionHeader(section.title)}
                  <FlatList
                    data={section.data}
                    renderItem={renderTransactionItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                  />
                  {section.data.length > 0 && sectionIndex < sections.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </Animated.View>
              )}
              contentContainerStyle={styles.listContainer}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={
                <Animated.View 
                  style={[
                    styles.emptyContainer,
                    { opacity: listFadeAnim }
                  ]}
                >
                  <Ionicons name="receipt-outline" size={64} color={colors.secondary} />
                  <Text style={styles.emptyText}>
                    {hasActiveFilters ? 'Tidak ada transaksi dengan filter ini' : 'Belum ada transaksi'}
                  </Text>
                  <Text style={styles.emptySubtext}>
                    {hasActiveFilters 
                      ? 'Coba ubah filter atau hapus filter'
                      : 'Tambah transaksi pertama Anda'
                    }
                  </Text>
                  {!hasActiveFilters && (
                    <AnimatedButton
                      title="Tambah Transaksi"
                      onPress={handleAddTransaction}
                      type="primary"
                      icon={<Ionicons name="add" size={18} color={colors.white} />}
                      style={{ marginTop: spacing.lg }}
                    />
                  )}
                </Animated.View>
              }
              ListHeaderComponent={
                sections.length > 0 ? (
                  <TouchableOpacity 
                    style={styles.floatingAddButton}
                    onPress={handleAddTransaction}
                  >
                    <Ionicons name="add" size={24} color={colors.white} />
                  </TouchableOpacity>
                ) : null
              }
            />
          </Animated.View>
        </>
      )}

      <TransactionFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        categories={mockCategories}
        wallets={mockWallets}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50
  },
  
  // ============ SEARCH BAR STYLES ============
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginRight: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: typography.h6,
    color: colors.textPrimary,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
  },
  filterBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.success,
    width: 16,
    height: 16,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: colors.white,
    fontSize: typography.tiny,
    fontWeight: typography.bold,
  },
  
  // ============ FILTER INFO STYLES ============
  filterInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  filterInfoText: {
    fontSize: typography.body,
    color: colors.primaryDark,
    flex: 1,
  },
  clearFilterText: {
    fontSize: typography.body,
    color: colors.danger,
    fontWeight: typography.semiBold,
    marginLeft: spacing.md,
  },
  
  // ============ LIST STYLES ============
  listContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl + 60, // Extra space for floating button
  },
  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h5,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.lg,
  },
  floatingAddButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    zIndex: 100,
  },
  
  // ============ EMPTY STATE STYLES ============
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.h5,
    fontWeight: typography.semiBold,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: typography.body,
    color: colors.darkGray,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  
  // ============ SKELETON STYLES ============
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  skeletonSearchContainer: {
    marginBottom: spacing.lg,
  },
  skeletonSection: {
    marginBottom: spacing.xl,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  skeletonItemContent: {
    flex: 1,
  },
  skeletonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TransactionListScreen;