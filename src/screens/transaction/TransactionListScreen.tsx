import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { transactionAPI } from '../../services/transactionApi';
import { Transaction, TransactionSection, TransactionStackParamList } from '../../types/transaction';
import TransactionItem from '../../components/transaction/TransactionItem';
import ScreenHeader from '../../components/layout/ScreenHeader';
import TransactionFilterModal from '../../components/transaction/TransactionFilterModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/designSysttem';

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
  const [loading, setLoading] = useState(true); // Set true initially
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

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

  const renderSeparator = () => (
    <View style={styles.separator}>
      <View style={styles.separatorLine} />
    </View>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      onPress={() => handleTransactionPress(item)}
    />
  );

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // ==================== SKELETON LOADER RENDER ====================
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
          {/* Section Title Skeleton */}
          <SkeletonLoader 
            width={120} 
            height={20} 
            borderRadius={borderRadius.sm}
            style={{ marginBottom: spacing.md }}
          />
          
          {/* Transaction Items Skeletons */}
          {[1, 2, 3, 4].map((itemIndex) => (
            <View key={itemIndex} style={styles.skeletonItem}>
              {/* Icon Skeleton */}
              <SkeletonLoader 
                width={40} 
                height={40} 
                borderRadius={borderRadius.round}
                style={{ marginRight: spacing.md }}
              />
              
              <View style={styles.skeletonItemContent}>
                {/* Description Skeleton */}
                <SkeletonLoader 
                  width={180} 
                  height={16} 
                  borderRadius={borderRadius.sm}
                  style={{ marginBottom: spacing.xs }}
                />
                
                {/* Category & Date Skeleton */}
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
              
              {/* Amount Skeleton */}
              <SkeletonLoader 
                width={100} 
                height={20} 
                borderRadius={borderRadius.sm}
              />
            </View>
          ))}
          
          {/* Separator Skeleton */}
          {sectionIndex < 3 && (
            <SkeletonLoader 
              width="100%" 
              height={1} 
              borderRadius={0}
              style={{ marginVertical: spacing.lg }}
            />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Semua Transaksi"
      />

      {loading ? (
        // Show skeleton loader during initial load
        renderSkeletonLoader()
      ) : (
        // Show actual content when data is loaded
        <>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Ionicons name="funnel-outline" size={24} color="#007bff" />
              {hasActiveFilters && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {hasActiveFilters && (
            <View style={styles.filterInfoContainer}>
              <Text style={styles.filterInfoText}>
                Filter aktif • 
                {activeFilters.type && ` ${activeFilters.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}`}
                {activeFilters.categoryId && ` • ${mockCategories.find(c => c.id === activeFilters.categoryId)?.name}`}
                {activeFilters.walletId && ` • ${mockWallets.find(w => w.id === activeFilters.walletId)?.name}`}
              </Text>
              <TouchableOpacity onPress={handleClearFilters}>
                <Text style={styles.clearFilterText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={sections}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            renderItem={({ item: section }) => (
              <View>
                {renderSectionHeader(section.title)}
                <FlatList
                  data={section.data}
                  renderItem={renderTransactionItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
                {section.data.length > 0 && renderSeparator()}
              </View>
            )}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>
                  {hasActiveFilters ? 'Tidak ada transaksi dengan filter ini' : 'Belum ada transaksi'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {hasActiveFilters 
                    ? 'Coba ubah filter atau hapus filter'
                    : 'Tambah transaksi pertama Anda'
                  }
                </Text>
              </View>
            }
          />
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
    paddingTop: spacing.xxl
  },
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
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
    padding: spacing.sm,
    position: 'relative',
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
  listContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
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
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: colors.borderLight,
  },
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
  },
});

export default TransactionListScreen;