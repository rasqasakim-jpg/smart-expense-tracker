import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Transaction } from '../../types/transaction';
import { getIncomeExpenseComparison, formatNumber } from '../../utils/chartDataHelper';

interface IncomeExpenseBarChartProps {
  transactions: Transaction[];
  months?: number; // Jumlah bulan yang ditampilkan
  height?: number;
  title?: string;
}

const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
  transactions,
  months = 6, // Default 6 bulan terakhir
  height = 220,
  title = 'Pemasukan vs Pengeluaran',
}) => {
  // Get data dari helper
  const { labels, incomeData, expenseData } = getIncomeExpenseComparison(transactions, months);
  
  // Format data untuk BarChart
  const chartData = {
    labels,
    datasets: [
      {
        data: incomeData,
        color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`, // Green for income
      },
      {
        data: expenseData,
        color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`, // Red for expense
      },
    ],
  };
  
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    barPercentage: 0.6,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#eaeaea',
    },
    formatYLabel: (value: string) => {
      const num = parseInt(value);
      return formatNumber(num);
    },
  };

  // Cek apakah ada data
  const hasIncomeData = incomeData.some(amount => amount > 0);
  const hasExpenseData = expenseData.some(amount => amount > 0);
  const hasAnyData = hasIncomeData || hasExpenseData;

  if (!hasAnyData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Belum ada data pemasukan dan pengeluaran
        </Text>
        <Text style={styles.emptySubtext}>
          Tambahkan transaksi untuk melihat grafik
        </Text>
      </View>
    );
  }

  // Hitung total dan rata-rata
  const totalIncome = incomeData.reduce((a, b) => a + b, 0);
  const totalExpense = expenseData.reduce((a, b) => a + b, 0);
  const averageIncome = totalIncome / months;
  const averageExpense = totalExpense / months;
  const netBalance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{months} bulan terakhir</Text>
      </View>
      
      <BarChart
        data={chartData}
        width={Dimensions.get('window').width - 80}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars={true}
        fromZero={true}
        withInnerLines={true}
        yAxisLabel="Rp "
        yAxisSuffix=""
        verticalLabelRotation={30}
      />
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#28a745' }]} />
          <Text style={styles.legendLabel}>Pemasukan</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#dc3545' }]} />
          <Text style={styles.legendLabel}>Pengeluaran</Text>
        </View>
      </View>
      
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Pemasukan</Text>
          <Text style={[styles.statValue, styles.incomeValue]}>
            {formatNumber(totalIncome)}
          </Text>
          <Text style={styles.statSubtext}>
            Rata-rata: {formatNumber(averageIncome)}/bulan
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Pengeluaran</Text>
          <Text style={[styles.statValue, styles.expenseValue]}>
            {formatNumber(totalExpense)}
          </Text>
          <Text style={styles.statSubtext}>
            Rata-rata: {formatNumber(averageExpense)}/bulan
          </Text>
        </View>
        
        <View style={[styles.statCard, styles.balanceCard]}>
          <Text style={styles.statLabel}>Saldo Bersih</Text>
          <Text style={[
            styles.statValue, 
            netBalance >= 0 ? styles.incomeValue : styles.expenseValue
          ]}>
            {formatNumber(netBalance)}
          </Text>
          <Text style={styles.statSubtext}>
            {netBalance >= 0 ? 'Surplus' : 'Defisit'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chart: {
    borderRadius: 16,
    marginLeft: -30,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#e8f5e9',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  incomeValue: {
    color: '#28a745',
  },
  expenseValue: {
    color: '#dc3545',
  },
  statSubtext: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default IncomeExpenseBarChart;