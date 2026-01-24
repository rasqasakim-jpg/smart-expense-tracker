import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { BudgetWithStatus } from '../../types/budget';
import BudgetProgressBar from './BudgetProgressBar';
import BudgetStatusBadge from './BudgetStatusBudget';
import { formatBudgetPeriod } from '../../utils/budgetHelper';

interface BudgetCardProps {
  budget: BudgetWithStatus;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onPress,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const periodText = formatBudgetPeriod(budget.period, budget.month);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <View style={[styles.iconContainer, { backgroundColor: budget.status.color + '20' }]}>
            <Ionicons name="pie-chart" size={20} color={budget.status.color} />
          </View>
          <View>
            <Text style={styles.categoryName}>{budget.categoryName}</Text>
            <Text style={styles.period}>{periodText} {budget.year}</Text>
          </View>
        </View>
        
        <BudgetStatusBadge status={budget.status.status} size="small" />
      </View>
      
      <View style={styles.amountContainer}>
        <View style={styles.amountColumn}>
          <Text style={styles.amountLabel}>Budget</Text>
          <Text style={styles.budgetAmount}>{formatCurrency(budget.amount)}</Text>
        </View>
        
        <View style={styles.amountColumn}>
          <Text style={styles.amountLabel}>Terpakai</Text>
          <Text style={[
            styles.spentAmount,
            budget.status.status === 'BOROS' && styles.overspentAmount
          ]}>
            {formatCurrency(budget.currentSpent)}
          </Text>
        </View>
        
        <View style={styles.amountColumn}>
          <Text style={styles.amountLabel}>
            {budget.status.status === 'BOROS' ? 'Kelebihan' : 'Sisa'}
          </Text>
          <Text style={[
            styles.remainingAmount,
            budget.status.status === 'BOROS' ? styles.overspentAmount : styles.remainingText
          ]}>
            {budget.status.status === 'BOROS' 
              ? `+${formatCurrency(budget.status.overspent)}`
              : formatCurrency(budget.status.remaining)
            }
          </Text>
        </View>
      </View>
      
      <BudgetProgressBar 
        status={budget.status}
        height={10}
        showLabel={false}
      />
      
      {(onEdit || onDelete) && (
        <View style={styles.actionButtons}>
          {onEdit && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={16} color="#007bff" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color="#dc3545" />
              <Text style={styles.deleteButtonText}>Hapus</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  period: {
    fontSize: 12,
    color: '#666',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountColumn: {
    alignItems: 'center',
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  remainingText: {
    color: '#28a745',
  },
  overspentAmount: {
    color: '#dc3545',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    gap: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  editButtonText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default BudgetCard;