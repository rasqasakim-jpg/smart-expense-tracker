import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Transaction } from '../../types/transaction';
import { getMonthlyExpenses, formatNumber } from '../../utils/chartDataHelper';

interface MonthlyExpenseChartProps {
  transactions: Transaction[];
  year?: number;
  height?: number;
}

const MonthlyExpenseChart: React.FC<MonthlyExpenseChartProps> = ({
  transactions,
  year = new Date().getFullYear(),
  height = 200,
}) => {
  const { labels, data } = getMonthlyExpenses(transactions, year);
  
  // Format data untuk chart
  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`, // Red
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
  
  // Jika tidak ada data pengeluaran
  const hasExpenseData = data.some(amount => amount > 0);
  
  if (!hasExpenseData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Belum ada data pengeluaran untuk tahun {year}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pengeluaran {year}</Text>
        <Text style={styles.subtitle}>Statistik bulanan</Text>
      </View>
      
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={height}
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
    marginLeft: -20,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MonthlyExpenseChart;