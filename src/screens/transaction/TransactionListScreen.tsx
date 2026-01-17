import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { transactionAPI } from '../../services/transactionApi';
import { Transaction, TransactionSection, TransactionStackParamList } from '../../types/transaction';
import TransactionItem from '../../components/transaction/TransactionItem';
import ScreenHeader from '../../components/layout/ScreenHeader';
import TransactionFilterModal from '../../components/transaction/TransactionFilterModal'

// ✅ Type yang benar
type TransactionListScreenNavigationProp = StackNavigationProp<
  TransactionStackParamList,
  'TransactionList'
>;

interface Props {
  navigation: TransactionListScreenNavigationProp;
}

// Mock data untuk filter
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
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false); // ✅ TAMBAH STATE INI
  const [activeFilters, setActiveFilters] = useState<any>({}); // ✅ TAMBAH FILTER STATE

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async (filters: any = {}) => {
    try {
      setLoading(true);

      // Gabungkan search dengan filter lainnya
      const allFilters = {
        ...filters,
        search: searchQuery || undefined,
      };

      const response = await transactionAPI.getAll(allFilters);
      const transactions = response.data || [];

      // Transform backend data to frontend format
      const transformedTransactions = transactions.map((t: any) => ({
        id: t.id,
        amount: Number(t.amount),
        type: t.type,
        name: t.name, // Backend uses 'name'
        category: t.category?.name || 'Unknown',
        categoryId: t.category_id,
        walletId: t.wallet_id,
        walletName: t.wallet?.name || 'Unknown',
        transactionDate: t.transaction_date.split('T')[0],
        createdAt: t.created_at,
        note: t.note,
      }));

      const grouped = groupTransactionsByDate(transformedTransactions);
      setSections(grouped);
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Gagal memuat transaksi');
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

  // ✅ FIX: Navigate dengan params yang benar
  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail', { 
      transactionId: transaction.id 
    });
  };

  // ✅ FIX: Navigate tanpa params untuk tambah baru
  const handleAddTransaction = () => {
    navigation.navigate('TransactionForm');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions(activeFilters);
  };

  // ✅ TAMBAH: Handle filter apply
  const handleFilterApply = async (filters: any) => {
    setActiveFilters(filters);
    await loadTransactions(filters);
  };

  // ✅ TAMBAH: Handle clear filters
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

  // Tampilkan filter badge jika ada active filter
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Memuat transaksi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Semua Transaksi"
        rightComponent={
          <TouchableOpacity onPress={handleAddTransaction}>
            <Ionicons name="add" size={24} color="#007bff" />
          </TouchableOpacity>
        }
      />

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
        
        {/* ✅ FIX: Tambahkan onPress handler untuk filter button */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)} // ✅ INI YANG HILANG!
        >
          <Ionicons name="filter-outline" size={24} color="#007bff" />
          {hasActiveFilters && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter info bar */}
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

      {/* ✅ TAMBAH: TransactionFilterModal di sini */}
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
    backgroundColor: '#f8f9fa',
    paddingTop: 50
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
    position: 'relative', // Untuk badge
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#28a745',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cfe2ff',
  },
  filterInfoText: {
    fontSize: 14,
    color: '#084298',
    flex: 1,
  },
  clearFilterText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '600',
    marginLeft: 12,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  separator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#eaeaea',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default TransactionListScreen;