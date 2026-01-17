import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Transaction } from '../../types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // ✅ UPDATE: Arrow icons untuk income/expense
  const getTransactionIcon = () => {
    if (transaction.type === 'INCOME') {
      return 'trending-down'; // Arrow serong ke bawah (hijau)
    } else {
      return 'trending-up'; // Arrow serong ke atas (merah)
    }
  };

  const getIconColor = () => {
    return transaction.type === 'INCOME' ? '#28a745' : '#dc3545';
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pendapatan': return '#28a745';
      case 'belanja': return '#dc3545';
      case 'tagihan': return '#6f42c1';
      case 'transport': return '#fd7e14';
      case 'makanan': return '#e83e8c';
      default: return '#6c757d';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: getIconColor() }]}>
          <Ionicons 
            name={getTransactionIcon()} 
            size={20} 
            color="#fff" 
          />
        </View>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <View style={styles.metaInfo}>
          <Text style={[styles.category, { color: getCategoryColor(transaction.category) }]}>
            {transaction.category}
          </Text>
          <Text style={styles.date}>
            {formatDate(transaction.transactionDate)}
          </Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <Text 
          style={[
            styles.amount,
            { color: transaction.type === 'INCOME' ? '#28a745' : '#dc3545' }
          ]}
        >
          {transaction.type === 'INCOME' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionItem;