import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
  formatNumber 
} from '../../utils/chartDataHelper';
import TransactionItem from '../../components/transaction/TransactionItem';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/designSystem';

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
  
  // State untuk control skeleton saat refresh
  const [showSkeletonOnRefresh, setShowSkeletonOnRefresh] = useState(false);
  
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
      setShowSkeletonOnRefresh(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ==================== REFRESH HANDLING ====================
  const handleRefresh = () => {
    setRefreshing(true);
    // Tampilkan skeleton setelah 300ms jika refresh lama
    const skeletonTimeout = setTimeout(() => {
      if (refreshing) {
        setShowSkeletonOnRefresh(true);
      }
    }, 300);
    
    loadDashboardData().finally(() => {
      clearTimeout(skeletonTimeout);
    });
  };

  // Hitung totals dari data real menggunakan helper
  const { totalBalance, totalIncome, totalExpense } = getDashboardTotals(transactions);
  
  // Ambil data untuk chart bulanan
  const { labels: monthlyLabels, data: monthlyData } = getMonthlyExpenses(transactions, 2026);
  
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

  // ==================== SKELETON LOADER ====================
  const renderSkeletonDashboard = () => (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#007bff']}
          tintColor="#007bff"
        />
      }
    >
      {/* Header Greeting Skeleton */}
      <View style={styles.skeletonGreeting}>
        <SkeletonLoader 
          width={200} 
          height={24} 
          borderRadius={borderRadius.sm} 
        />
      </View>

      {/* Balance Card Skeleton */}
      <View style={styles.skeletonBalanceCard}>
        {/* Balance Title Skeleton */}
        <View style={styles.skeletonBalanceHeader}>
          <SkeletonLoader 
            width={120} 
            height={16} 
            borderRadius={borderRadius.sm} 
          />
        </View>
        
        {/* Balance Amount Skeleton */}
        <SkeletonLoader 
          width={200} 
          height={40} 
          borderRadius={borderRadius.sm} 
          style={{ marginBottom: spacing.xl, alignSelf: 'center' }}
        />
        
        {/* Income & Expense Stats Skeleton */}
        <View style={styles.skeletonStatsContainer}>
          <View style={styles.skeletonStatItem}>
            <SkeletonLoader 
              width={40} 
              height={40} 
              borderRadius={borderRadius.round} 
              style={{ marginRight: spacing.md }}
            />
            <View style={styles.skeletonStatInfo}>
              <SkeletonLoader 
                width={80} 
                height={12} 
                borderRadius={borderRadius.sm} 
                style={{ marginBottom: spacing.xs }}
              />
              <SkeletonLoader 
                width={120} 
                height={20} 
                borderRadius={borderRadius.sm} 
              />
            </View>
          </View>
          
          <SkeletonLoader 
            width={1} 
            height={40} 
            borderRadius={0} 
            style={{ marginHorizontal: spacing.lg }}
          />
          
          <View style={styles.skeletonStatItem}>
            <SkeletonLoader 
              width={40} 
              height={40} 
              borderRadius={borderRadius.round} 
              style={{ marginRight: spacing.md }}
            />
            <View style={styles.skeletonStatInfo}>
              <SkeletonLoader 
                width={80} 
                height={12} 
                borderRadius={borderRadius.sm} 
                style={{ marginBottom: spacing.xs }}
              />
              <SkeletonLoader 
                width={120} 
                height={20} 
                borderRadius={borderRadius.sm} 
              />
            </View>
          </View>
        </View>
      </View>

      {/* Statistik Bulanan Chart Skeleton */}
      <View style={styles.skeletonChartSection}>
        {/* Section Title Skeleton */}
        <SkeletonLoader 
          width={150} 
          height={24} 
          borderRadius={borderRadius.sm} 
          style={{ marginBottom: spacing.xs }}
        />
        <SkeletonLoader 
          width={120} 
          height={16} 
          borderRadius={borderRadius.sm} 
          style={{ marginBottom: spacing.lg }}
        />
        
        {/* Chart Skeleton */}
        <SkeletonLoader 
          width="100%" 
          height={200} 
          borderRadius={borderRadius.lg} 
        />
        
        {/* Chart Stats Skeleton */}
        <View style={styles.skeletonChartStats}>
          <View style={styles.skeletonStatRow}>
            <SkeletonLoader width={100} height={16} borderRadius={borderRadius.sm} />
            <SkeletonLoader width={80} height={16} borderRadius={borderRadius.sm} />
          </View>
          <View style={styles.skeletonStatRow}>
            <SkeletonLoader width={120} height={16} borderRadius={borderRadius.sm} />
            <SkeletonLoader width={100} height={16} borderRadius={borderRadius.sm} />
          </View>
        </View>
      </View>

      {/* Recent Transactions Header Skeleton */}
      <View style={styles.skeletonTransactionHeader}>
        <SkeletonLoader width={150} height={24} borderRadius={borderRadius.sm} />
        <SkeletonLoader width={100} height={16} borderRadius={borderRadius.sm} />
      </View>

      {/* Recent Transactions List Skeleton */}
      <View style={styles.skeletonTransactionList}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.skeletonTransactionItem}>
            <SkeletonLoader 
              width={40} 
              height={40} 
              borderRadius={borderRadius.round} 
              style={{ marginRight: spacing.md }}
            />
            <View style={styles.skeletonTransactionContent}>
              <SkeletonLoader 
                width={180} 
                height={16} 
                borderRadius={borderRadius.sm} 
                style={{ marginBottom: spacing.xs }}
              />
              <View style={styles.skeletonTransactionMeta}>
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
    </ScrollView>
  );

  // ==================== RENDER LOGIC ====================
  
  // Jika initial loading ATAU refresh lebih dari 300ms -> tampilkan skeleton
  if ((loading && !refreshing) || showSkeletonOnRefresh) {
    return renderSkeletonDashboard();
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
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

      {/* Statistik Bulanan Chart */}
      <View style={styles.section}>
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
      </View>

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
    backgroundColor: colors.background,
  },
  
  // ============ SKELETON STYLES ============
  skeletonGreeting: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: 'flex-start',
  },
  skeletonBalanceCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.lg,
  },
  skeletonBalanceHeader: {
    marginBottom: spacing.md,
  },
  skeletonStatsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  skeletonStatInfo: {
    flex: 1,
  },
  skeletonChartSection: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  skeletonChartStats: {
    marginTop: spacing.lg,
    width: '100%',
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  skeletonStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  skeletonTransactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  skeletonTransactionList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  skeletonTransactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  skeletonTransactionContent: {
    flex: 1,
  },
  skeletonTransactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // ============ REGULAR STYLES ============
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingTop: spacing.xxl,
  },
  greeting: {
    fontSize: typography.h6,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
  },
  welcome: {
    fontSize: typography.h4,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  balanceCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  balanceTitle: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: typography.semiBold,
    marginLeft: spacing.sm,
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '105%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  incomeIcon: {
    backgroundColor: colors.success,
  },
  expenseIcon: {
    backgroundColor: colors.danger,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statAmount: {
    fontSize: typography.h5,
    fontWeight: typography.bold,
  },
  incomeText: {
    color: colors.success,
    fontSize: typography.h6,
  },
  expenseText: {
    color: colors.danger,
    fontSize: typography.h6,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.lg,
  },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: typography.h5,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  sectionTitleLeft: {
    fontSize: typography.h5,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  chart: {
    borderRadius: borderRadius.lg,
    marginLeft: -spacing.lg,
  },
  chartStats: {
    marginTop: spacing.lg,
    width: '100%',
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabelSmall: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  statValueSmall: {
    fontSize: typography.body,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyChartText: {
    fontSize: typography.h6,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  allTransactionsLink: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.semiBold,
  },
  transactionList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyTransactions: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTransactionsText: {
    fontSize: typography.h6,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  addTransactionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  addTransactionText: {
    color: colors.textLight,
    fontSize: typography.body,
    fontWeight: typography.semiBold,
  },
});

export default DashboardScreen;