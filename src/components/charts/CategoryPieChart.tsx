import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Transaction } from '../../types/transaction';
import { getExpensesByCategory, formatNumber } from '../../utils/chartDataHelper';

interface CategoryPieChartProps {
  transactions: Transaction[];
  height?: number;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  transactions,
  height = 200,
}) => {
  const { labels, data, colors } = getExpensesByCategory(transactions);
  
  // Format data untuk pie chart
  const chartData = labels.map((label, index) => ({
    name: label,
    population: data[index],
    color: colors[index],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));
  
  // Jika tidak ada data
  const hasExpenseData = data.some(amount => amount > 0);
  
  if (!hasExpenseData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Belum ada data pengeluaran per kategori</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pengeluaran per Kategori</Text>
        <Text style={styles.subtitle}>Distribusi pengeluaran</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 80}
          height={height}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Menampilkan nilai absolut, bukan persentase
          hasLegend={true}
        />
      </View>
      
      {/* Legend Detail */}
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => {
          const percentage = (item.population / data.reduce((a, b) => a + b, 0)) * 100;
          
          return (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendLabel}>{item.name}</Text>
                <Text style={styles.legendValue}>
                  {formatNumber(item.population)} ({percentage.toFixed(1)}%)
                </Text>
              </View>
            </View>
          );
        })}
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
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: 14,
    color: '#333',
  },
  legendValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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

export default CategoryPieChart;