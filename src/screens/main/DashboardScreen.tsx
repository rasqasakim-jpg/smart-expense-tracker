import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Dimensions } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Transaction } from '../../types/transaction';
import TransactionItem from '../../components/transaction/TransactionItem';
import SimpleBarChart from '../../components/charts/SimpleBarChart';

// Types untuk tab navigation
type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Add: undefined;
  Wallets: undefined;
  Profile: undefined;
};

type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

// Types untuk stack navigation
export type DashboardStackParamList = {
  Dashboard: undefined;
  TransactionList: undefined;
  TransactionDetail: { transactionId: number };
};

type DashboardScreenNavigationProp = StackNavigationProp<
  DashboardStackParamList,
  'Dashboard'
>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Ucup');
  const [totalBalance, setTotalBalance] = useState(18000000);
  const [totalIncome, setTotalIncome] = useState(3500000);
  const [totalExpense, setTotalExpense] = useState(2100000);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Tab navigation untuk switch tab
  const tabNavigation = useNavigation<TabNavigationProp>();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        amount: 8000000,
        type: 'INCOME',
        description: 'Gaji Bulanan',
        category: 'Pendapatan',
        categoryId: 1,
        walletId: 2,
        walletName: 'Bank BCA',
        transactionDate: '2026-01-05',
        createdAt: '2026-01-05T08:00:00',
      },
      {
        id: 2,
        amount: 1200000,
        type: 'EXPENSE',
        description: 'Belanja Bulanan',
        category: 'Belanja',
        categoryId: 2,
        walletId: 1,
        walletName: 'Kas',
        transactionDate: '2026-01-04',
        createdAt: '2026-01-04T14:30:00',
      },
      {
        id: 3,
        amount: 450000,
        type: 'EXPENSE',
        description: 'Tagihan Listrik',
        category: 'Tagihan',
        categoryId: 3,
        walletId: 2,
        walletName: 'Bank BCA',
        transactionDate: '2026-01-03',
        createdAt: '2026-01-03T10:15:00',
      },
      {
        id: 4,
        amount: 250000,
        type: 'EXPENSE',
        description: 'Transportasi',
        category: 'Transport',
        categoryId: 4,
        walletId: 1,
        walletName: 'Kas',
        transactionDate: '2026-01-02',
        createdAt: '2026-01-02T18:45:00',
      },
    ];
    
    setRecentTransactions(mockTransactions);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // PERBAIKAN: Navigate ke tab Transactions
  const handleViewAllTransactions = () => {
    tabNavigation.navigate('Transactions');
  };

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail', { 
      transactionId: transaction.id 
    });
  };

  // Chart data
  const chartData = [
     { label: 'Jan', value: 3000000, color: '#007bff' },
     { label: 'Feb', value: 4500000, color: '#28a745' },
     { label: 'Mar', value: 2800000, color: '#ffc107' },
     { label: 'Apr', value: 5200000, color: '#dc3545' },
     { label: 'Mei', value: 4100000, color: '#6f42c1' },
     { label: 'Jun', value: 3900000, color: '#17a2b8' },
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#007bff',
    },
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Memuat dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Greeting dengan warna biru dan border bawah besar */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>
          Halo {userName}, Selamat Datang!
        </Text>
      </View>

      {/* Total Saldo Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>TOTAL SALDO</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(totalBalance)}
        </Text>
        
        {/* Income & Expense Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.incomeIcon]}>
              <Ionicons name="trending-up" size={20} color="#fff" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Pemasukan</Text>
              <Text style={[styles.statAmount, styles.incomeText]}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.expenseIcon]}>
              <Ionicons name="trending-down" size={20} color="#fff" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Pengeluaran</Text>
              <Text style={[styles.statAmount, styles.expenseText]}>
                {formatCurrency(totalExpense)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Statistik Bulanan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistik Bulanan</Text>
        <View style={styles.chartContainer}>
         <SimpleBarChart
      data={chartData}
      height={180}
      showValues={true}
      title="Pengeluaran Per Bulan (Rp)"
    />
        </View>
      </View>

      {/* Recent Transactions Header - POSISI DIBALIK */}
      <View style={styles.transactionHeader}>
        <Text style={styles.sectionTitleLeft}>Transaksi Terakhir</Text>
        
        <TouchableOpacity onPress={handleViewAllTransactions}>
          <Text style={styles.allTransactionsLink}>Semua Transaksi</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions List */}
      <View style={styles.transactionList}>
        {recentTransactions.map(transaction => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onPress={() => handleTransactionPress(transaction)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  // PERBAIKAN: Greeting dengan border bawah lebih besar dan warna biru
  greetingContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#eaeaea',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007bff', // WARNA BIRU
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: '#28a745',
  },
  expenseIcon: {
    backgroundColor: '#dc3545',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#28a745',
  },
  expenseText: {
    color: '#dc3545',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#eaeaea',
    marginHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  // PERBAIKAN: Title untuk posisi kiri
  sectionTitleLeft: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
    marginLeft: -20,
  },
  // PERBAIKAN: Transaction header dengan posisi terbalik
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  // PERBAIKAN: Link di kanan
  allTransactionsLink: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  transactionList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default DashboardScreen;