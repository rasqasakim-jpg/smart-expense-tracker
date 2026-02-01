import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Animated,
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
import AnimatedButton from '../../components/common/AnimatedButton';
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
  
  // Animation refs
  const headerSlideAnim = useRef(new Animated.Value(-50)).current;
  const balanceScaleAnim = useRef(new Animated.Value(0.9)).current;
  const statsFadeAnim = useRef(new Animated.Value(0)).current;
  const chartFadeAnim = useRef(new Animated.Value(0)).current;
  const transactionsFadeAnim = useRef(new Animated.Value(0)).current;
  const refreshRotateAnim = useRef(new Animated.Value(0)).current;

  // Tab navigation untuk switch tab
  const tabNavigation = useNavigation<TabNavigationProp>();

  // Entry animations
  useEffect(() => {
    if (!loading) {
      // Staggered animations ketika data sudah load
      Animated.stagger(100, [
        // Header slide down
        Animated.spring(headerSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        
        // Balance card scale up
        Animated.spring(balanceScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        
        // Stats fade in
        Animated.timing(statsFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        
        // Chart fade in
        Animated.timing(chartFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        
        // Transactions fade in
        Animated.timing(transactionsFadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

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

  // Refresh dengan rotation animation
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Rotation animation
    Animated.loop(
      Animated.timing(refreshRotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
    
    loadDashboardData().finally(() => {
      refreshRotateAnim.stopAnimation();
      Animated.timing(refreshRotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Hitung totals dari data real
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

  const handleAddTransaction = () => {
    tabNavigation.navigate('Add');
  };

  // Chart data untuk LineChart
  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        data: monthlyData,
        color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
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

  // Rotate animation untuk refresh icon
  const refreshSpin = refreshRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Skeleton Loader
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
        <SkeletonLoader 
          width={120} 
          height={16} 
          borderRadius={borderRadius.sm} 
          style={{ marginBottom: spacing.md }}
        />
        <SkeletonLoader 
          width={200} 
          height={40} 
          borderRadius={borderRadius.sm} 
          style={{ marginBottom: spacing.xl, alignSelf: 'center' }}
        />
        
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

      {/* Chart Section Skeleton */}
      <View style={styles.skeletonChartSection}>
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
        <SkeletonLoader 
          width="100%" 
          height={200} 
          borderRadius={borderRadius.lg} 
        />
      </View>

      {/* Transactions Section Skeleton */}
      <View style={styles.skeletonTransactionHeader}>
        <SkeletonLoader width={150} height={24} borderRadius={borderRadius.sm} />
        <SkeletonLoader width={100} height={16} borderRadius={borderRadius.sm} />
      </View>

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

  if (loading) {
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
      {/* Header dengan slide animation */}
      <Animated.View 
        style={[
          styles.header,
          { transform: [{ translateY: headerSlideAnim }] }
        ]}
      >
        <View>
          <Text style={styles.greeting}>Halo {userName},</Text>
          <Text style={styles.welcome}>Selamat Datang!</Text>
        </View>
        
        {/* Refresh Button dengan rotation animation */}
        <Animated.View style={{ transform: [{ rotate: refreshSpin }] }}>
          <TouchableOpacity 
            onPress={handleRefresh} 
            disabled={refreshing}
            style={styles.refreshButton}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color={refreshing ? colors.secondary : colors.primary} 
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Balance Card dengan scale animation */}
      <Animated.View 
        style={[
          styles.balanceCard,
          {
            transform: [{ scale: balanceScaleAnim }],
            opacity: statsFadeAnim,
          }
        ]}
      >
        <View style={styles.balanceHeader}>
          <Ionicons name="wallet-outline" size={20} color={colors.primary} />
          <Text style={styles.balanceTitle}>TOTAL SALDO</Text>
        </View>
        
        <Text style={styles.balanceAmount}>
          {formatCurrency(totalBalance)}
        </Text>
        
        {/* Income & Expense Stats */}
        <Animated.View style={{ opacity: statsFadeAnim }}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.incomeIcon]}>
                <Ionicons name="trending-up" size={20} color={colors.white} />
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
                <Ionicons name="trending-down" size={20} color={colors.white} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Pengeluaran</Text>
                <Text style={[styles.statAmount, styles.expenseText]}>
                  {formatCurrency(totalExpense)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Action Buttons */}
        <Animated.View 
          style={[
            styles.quickActions,
            { opacity: statsFadeAnim }
          ]}
        >
          <AnimatedButton
            title="Tambah Transaksi"
            onPress={handleAddTransaction}
            type="success"
            icon={<Ionicons name="add" size={18} color={colors.white} />}
            style={{ flex: 1, marginRight: spacing.sm }}
            size="small"
          />
          
          <AnimatedButton
            title="Lihat Semua"
            onPress={handleViewAllTransactions}
            type="outline"
            icon={<Ionicons name="list" size={18} color={colors.primary} />}
            style={{ flex: 1, marginLeft: spacing.sm }}
            size="small"
          />
        </Animated.View>
      </Animated.View>

      {/* Chart Section dengan fade animation */}
      <Animated.View 
        style={[
          styles.section,
          { opacity: chartFadeAnim }
        ]}
      >
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
            <Ionicons name="stats-chart-outline" size={48} color={colors.secondary} />
            <Text style={styles.emptyChartText}>Belum ada data pengeluaran bulanan</Text>
          </View>
        )}
      </Animated.View>

      {/* Recent Transactions dengan fade animation */}
      <Animated.View 
        style={[
          styles.transactionSection,
          { opacity: transactionsFadeAnim }
        ]}
      >
        <View style={styles.transactionHeader}>
          <Text style={styles.sectionTitleLeft}>Transaksi Terakhir</Text>
          
          <TouchableOpacity onPress={handleViewAllTransactions}>
            <Text style={styles.allTransactionsLink}>Semua Transaksi</Text>
          </TouchableOpacity>
        </View>

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
              <Ionicons name="receipt-outline" size={48} color={colors.secondary} />
              <Text style={styles.emptyTransactionsText}>Belum ada transaksi</Text>
              <AnimatedButton
                title="Tambah Transaksi Pertama"
                onPress={handleAddTransaction}
                type="primary"
                size="small"
                style={{ marginTop: spacing.md }}
              />
            </View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // ============ HEADER STYLES ============
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
  refreshButton: {
    padding: spacing.sm,
  },
  
  // ============ BALANCE CARD STYLES ============
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
  
  // ============ STATS STYLES ============
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
    borderRadius: borderRadius.round,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  
  // ============ CHART SECTION STYLES ============
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
  
  // ============ TRANSACTIONS SECTION STYLES ============
  transactionSection: {
    marginBottom: spacing.xl,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitleLeft: {
    fontSize: typography.h5,
    fontWeight: typography.bold,
    color: colors.textPrimary,
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
});

export default DashboardScreen;