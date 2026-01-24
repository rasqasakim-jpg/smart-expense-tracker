import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BudgetStatus } from '../../types/budget';

interface BudgetProgressBarProps {
  status: BudgetStatus;
  height?: number;
  showLabel?: boolean;
  showPercentage?: boolean;
}

const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  status,
  height = 12,
  showLabel = true,
  showPercentage = true,
}) => {
  // Batasi percentage maksimal 100% untuk display
  const displayPercentage = Math.min(status.percentage, 100);
  
  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Penggunaan Budget</Text>
          {showPercentage && (
            <Text style={[styles.percentage, { color: status.color }]}>
              {displayPercentage.toFixed(0)}%
            </Text>
          )}
        </View>
      )}
      
      <View style={[styles.progressBarContainer, { height }]}>
        <View 
          style={[
            styles.progressBar,
            { 
              width: `${displayPercentage}%`,
              backgroundColor: status.color,
              height,
            }
          ]}
        />
      </View>
      
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: status.color }]} />
        <Text style={[styles.statusText, { color: status.color }]}>
          {status.status}
        </Text>
        
        {status.status === 'BOROS' ? (
          <Text style={styles.overspentText}>
            Lebih: Rp {status.overspent.toLocaleString('id-ID')}
          </Text>
        ) : (
          <Text style={styles.remainingText}>
            Sisa: Rp {status.remaining.toLocaleString('id-ID')}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    borderRadius: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 'auto',
  },
  remainingText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },
  overspentText: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '500',
  },
});

export default BudgetProgressBar;