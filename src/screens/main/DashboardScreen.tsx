import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { LineChart } from 'react-native-chart-kit';
import { Transaction } from '../../types/transaction';
import { transactionAPI } from '../../services/transactionApi';
import { 
  getDashboardTotals, 
  getMonthlyExpenses, 
  getExpensesByCategory,
  getIncomeExpenseComparison,
  formatNumber 
} from '../../utils/chartDataHelper';
import TransactionItem from '../../components/transaction/TransactionItem';
import IncomeExpenseBarChart from '../../components/charts/IncomeExpenseBarChart';

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
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('User');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeChartType, setActiveChartType] = useState<'monthly' | 'comparison'>('monthly');
  
  // Tab navigation untuk switch tab
  const tabNavigation = useNavigation<TabNavigationProp>();

  // Load data dari API
  const loadDashboardData = async () => {
    try {
      const response = await transactionAPI.getAll();
      const allTransactions = response.data;
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Hitung totals dari data real menggunakan helper
  const { totalBalance, totalIncome, totalExpense } = getDashboardTotals(transactions);
  
  // Ambil data untuk chart bulanan
  const { labels: monthlyLabels, data: monthlyData } = getMonthlyExpenses(transactions, 2026);
  
  // Ambil data untuk kategori
  const { labels: categoryLabels, data: categoryData } = getExpensesByCategory(transactions);
  
  // Ambil 5 transaksi terbaru untuk ditampilkan
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewAllTransactions = () => {
    tabNavigation.navigate('Transactions');
  };

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail', { 
      transactionId: transaction.id 
    });
  };

  // Chart data untuk LineChart (Monthly)
  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        data: monthlyData,
        color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`, // Red untuk pengeluaran
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#dc3545',
    },
    formatYLabel: (value: string) => {
      const num = parseInt(value);
      return formatNumber(num);
    },
  };

  // Data untuk kategori chart (preview di dashboard)
  const topCategories = categoryLabels.slice(0, 3).map((label, index) => ({
    name: label,
    amount: categoryData[index],
    color: ['#FF6B6B', '#4ECDC4', '#FFD166'][index] || '#6C757D'
  }));

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Memuat dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007bff']}
          tintColor="#007bff"
        />
      }
    >
      {/* Header Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo {userName},</Text>
          <Text style={styles.welcome}>Selamat Datang!</Text>
        </View>
      </View>

      {/* Total Saldo Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Ionicons name="wallet-outline" size={20} color="#007bff" />
          <Text style={styles.balanceTitle}>TOTAL SALDO</Text>
        </View>
        
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

      {/* Chart Selection Tabs */}
      <View style={styles.chartTabsContainer}>
        <TouchableOpacity
          style={[
            styles.chartTab,
            activeChartType === 'monthly' && styles.chartTabActive
          ]}
          onPress={() => setActiveChartType('monthly')}
        >
          <Text style={[
            styles.chartTabText,
            activeChartType === 'monthly' && styles.chartTabTextActive
          ]}>
            Statistik Bulanan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.chartTab,
            activeChartType === 'comparison' && styles.chartTabActive
          ]}
          onPress={() => setActiveChartType('comparison')}
        >
          <Text style={[
            styles.chartTabText,
            activeChartType === 'comparison' && styles.chartTabTextActive
          ]}>
            Perbandingan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart Container */}
      <View style={styles.section}>
        {activeChartType === 'monthly' ? (
          <>
            <Text style={styles.sectionTitle}>Statistik Bulanan 2026</Text>
            <Text style={styles.sectionSubtitle}>Pengeluaran per bulan</Text>
            
            {monthlyData.some(amount => amount > 0) ? (
              <View style={styles.chartContainer}>
                <LineChart
                  data={monthlyChartData}
                  width={Dimensions.get('window').width - 80}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  fromZero={true}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLines={true}
                  withHorizontalLines={true}
                  segments={5}
                />
                
                {/* Bulan dengan pengeluaran tertinggi */}
                <View style={styles.chartStats}>
                  {monthlyData.length > 0 && (
                    <>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabelSmall}>Bulan Tertinggi:</Text>
                        <Text style={styles.statValueSmall}>
                          {monthlyLabels[monthlyData.indexOf(Math.max(...monthlyData))]}
                        </Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabelSmall}>Total Pengeluaran:</Text>
                        <Text style={[styles.statValueSmall, styles.expenseText]}>
                          {formatCurrency(monthlyData.reduce((a, b) => a + b, 0))}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="stats-chart-outline" size={48} color="#ccc" />
                <Text style={styles.emptyChartText}>Belum ada data pengeluaran bulanan</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Pemasukan vs Pengeluaran</Text>
            <Text style={styles.sectionSubtitle}>6 bulan terakhir</Text>
            
            <IncomeExpenseBarChart 
              transactions={transactions}
              months={6}
              height={220}
            />
          </>
        )}
      </View>

      {/* Kategori Pengeluaran (Preview) */}
      {categoryData.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategori Pengeluaran</Text>
            <Text style={styles.sectionSubtitle}>Top 3 kategori</Text>
          </View>
          
          <View style={styles.categoriesContainer}>
            {topCategories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(category.amount)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          
          {categoryLabels.length > 3 && (
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => {/* TODO: Navigate to category detail */}}
            >
              <Text style={styles.viewMoreText}>Lihat {categoryLabels.length - 3} kategori lainnya</Text>
              <Ionicons name="chevron-forward" size={16} color="#007bff" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Recent Transactions Header */}
      <View style={styles.transactionHeader}>
        <Text style={styles.sectionTitleLeft}>Transaksi Terakhir</Text>
        
        <TouchableOpacity onPress={handleViewAllTransactions}>
          <Text style={styles.allTransactionsLink}>Semua Transaksi</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions List */}
      <View style={styles.transactionList}>
        {recentTransactions.length > 0 ? (
          recentTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() => handleTransactionPress(transaction)}
            />
          ))
        ) : (
          <View style={styles.emptyTransactions}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTransactionsText}>Belum ada transaksi</Text>
            <TouchableOpacity 
              style={styles.addTransactionButton}
              onPress={() => tabNavigation.navigate('Add')}
            >
              <Text style={styles.addTransactionText}>Tambah Transaksi Pertama</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
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
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.9)',
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 25,
    textAlign: 'center',
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
    fontSize: 16
  },
  expenseText: {
    color: '#dc3545',
    fontSize: 16
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#eaeaea',
    marginHorizontal: 16,
  },
  // Chart Tabs
  chartTabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  chartTabActive: {
    backgroundColor: '#007bff',
  },
  chartTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  chartTabTextActive: {
    color: '#fff',
  },
  // Section
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
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitleLeft: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  chart: {
    borderRadius: 16,
    marginLeft: -30,
  },
  chartStats: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabelSmall: {
    fontSize: 14,
    color: '#666',
  },
  statValueSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyChartText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginRight: 4,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  allTransactionsLink: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  transactionList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyTransactions: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTransactionsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 16,
  },
  addTransactionButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  addTransactionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DashboardScreen;