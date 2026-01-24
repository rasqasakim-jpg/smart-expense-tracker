import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { BudgetStackParamList, BudgetWithStatus } from '../../types/budget';
import { budgetAPI } from '../../services/budgetApi';
import { transactionAPI } from '../../services/transactionApi';
import { Transaction } from '../../types/transaction';
import BudgetProgressBar from '../../components/budget/BudgetProgressBar';
import BudgetStatusBadge from '../../components/budget/BudgetStatusBudget';
import TransactionItem from '../../components/transaction/TransactionItem';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { formatBudgetPeriod, getStatusDescription } from '../../utils/budgetHelper';

type BudgetDetailScreenNavigationProp = StackNavigationProp<
  BudgetStackParamList,
  'BudgetDetail'
>;

type BudgetDetailScreenRouteProp = RouteProp<BudgetStackParamList, 'BudgetDetail'>;

interface Props {
  navigation: BudgetDetailScreenNavigationProp;
  route: BudgetDetailScreenRouteProp;
}

const BudgetDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { budgetId } = route.params;
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<BudgetWithStatus | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    loadBudgetDetail();
  }, [budgetId]);

  const loadBudgetDetail = async () => {
    try {
      const [budgetResponse, transactionsResponse] = await Promise.all([
        budgetAPI.getById(budgetId),
        transactionAPI.getAll({ categoryId: budgetId }),
      ]);
      
      setBudget(budgetResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Error loading budget detail:', error);
      Alert.alert('Error', 'Gagal memuat detail budget');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (budget) {
      navigation.navigate('BudgetForm', { budget });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Budget',
      `Apakah Anda yakin ingin menghapus budget ${budget?.categoryName}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await budgetAPI.delete(budgetId);
              Alert.alert('Success', 'Budget berhasil dihapus');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus budget');
            }
          },
        },
      ]
    );
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // Navigate to transaction detail
    // navigation.navigate('TransactionDetail', { transactionId: transaction.id });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Memuat detail budget...</Text>
      </View>
    );
  }

  if (!budget) {
    return (
      <View style={styles.centered}>
        <Text>Budget tidak ditemukan</Text>
      </View>
    );
  }

  const periodText = formatBudgetPeriod(budget.period, budget.month);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Detail Budget"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color="#007bff" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Budget Header */}
        <View style={styles.headerCard}>
          <View style={styles.categoryHeader}>
            <View style={[styles.IoniconsContainer, { backgroundColor: budget.status.color + '20' }]}>
              <Ionicons name="pie-chart" size={32} color={budget.status.color} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{budget.categoryName}</Text>
              <Text style={styles.period}>{periodText} {budget.year}</Text>
            </View>
            <BudgetStatusBadge status={budget.status.status} size="medium" />
          </View>
          
          <View style={styles.statusDescription}>
            <Ionicons name="information-outline" size={16} color={budget.status.color} />
            <Text style={[styles.statusDescriptionText, { color: budget.status.color }]}>
              {getStatusDescription(budget.status.status)}
            </Text>
          </View>
        </View>

        {/* Budget Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Statistik Budget</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Budget</Text>
              <Text style={styles.statValue}>{formatCurrency(budget.amount)}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Terpakai</Text>
              <Text style={[
                styles.statValue,
                budget.status.status === 'BOROS' && styles.overspentValue
              ]}>
                {formatCurrency(budget.currentSpent)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                {budget.status.status === 'BOROS' ? 'Kelebihan' : 'Sisa'}
              </Text>
              <Text style={[
                styles.statValue,
                budget.status.status === 'BOROS' ? styles.overspentValue : styles.remainingValue
              ]}>
                {budget.status.status === 'BOROS'
                  ? `+${formatCurrency(budget.status.overspent)}`
                  : formatCurrency(budget.status.remaining)
                }
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Persentase</Text>
              <Text style={[styles.statValue, { color: budget.status.color }]}>
                {budget.status.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
          
          <BudgetProgressBar 
            status={budget.status}
            height={12}
            showLabel={true}
          />
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsCard}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Transaksi Terkait</Text>
            <Text style={styles.transactionsCount}>
              {transactions.length} transaksi
            </Text>
          </View>
          
          {transactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {transactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyTransactions}>
              <Ionicons name="receipt" size={48} color="#ccc" />
              <Text style={styles.emptyTransactionsText}>
                Belum ada transaksi untuk kategori ini
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="pencil-outline" size={20} color="#007bff" />
            <Text style={styles.editButtonText}>Edit Budget</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="close-circle-outline" size={20} color="#dc3545" />
            <Text style={styles.deleteButtonText}>Hapus Budget</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  IoniconsContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  period: {
    fontSize: 14,
    color: '#666',
  },
  statusDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  statusDescriptionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  overspentValue: {
    color: '#dc3545',
  },
  remainingValue: {
    color: '#28a745',
  },
  transactionsCard: {
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
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  transactionsCount: {
    fontSize: 14,
    color: '#666',
  },
  transactionsList: {
    gap: 8,
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
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
  },
});

export default BudgetDetailScreen;