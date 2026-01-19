import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  height?: number;
  showValues?: boolean;
  title?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  height = 150,
  showValues = true,
  title,
}) => {
  // Cari nilai maksimum untuk scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Warna default jika tidak disediakan
  const defaultColors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8'];

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={[styles.chartContainer, { height }]}>
        {/* Grid lines */}
        <View style={styles.gridContainer}>
          {[0, 25, 50, 75, 100].map((percent) => (
            <View key={percent} style={styles.gridLine}>
              <View style={[styles.line, { top: `${percent}%` }]} />
              {percent > 0 && (
                <Text style={styles.gridLabel}>
                  {Math.round((maxValue * percent) / 100).toLocaleString('id-ID')}
                </Text>
              )}
            </View>
          ))}
        </View>
        
        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            const color = item.color || defaultColors[index % defaultColors.length];
            
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${barHeight}%`,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
                
                <Text style={styles.barLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                
                {showValues && (
                  <Text style={styles.valueLabel}>
                    {item.value.toLocaleString('id-ID')}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    position: 'relative',
    height: 1,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  gridLabel: {
    position: 'absolute',
    right: '100%',
    top: -8,
    marginRight: 8,
    fontSize: 10,
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingLeft: 40, // Space for grid labels
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '80%',
    maxWidth: 40,
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  valueLabel: {
    fontSize: 9,
    color: '#333',
    marginTop: 2,
    fontWeight: '500',
  },
});

export default SimpleBarChart;