import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { TransactionStackParamList } from '../../types/transaction';
import { transactionAPI } from '../../services/transactionApi';
import { Transaction } from '../../types/transaction';
import ScreenHeader from '../../components/layout/ScreenHeader';

type TransactionDetailScreenNavigationProp = StackNavigationProp<
  TransactionStackParamList,
  'TransactionDetail'
>;

type TransactionDetailScreenRouteProp = RouteProp<
  TransactionStackParamList, 
  'TransactionDetail'
>;

interface Props {
  navigation: TransactionDetailScreenNavigationProp;
  route: TransactionDetailScreenRouteProp;
}

const TransactionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    try {
      const response = await transactionAPI.getById(transactionId);
      setTransaction(response.data);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat detail transaksi');
    } finally {
      setLoading(false);
    }
  };

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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleEdit = () => {
    if (transaction) {
      navigation.navigate('TransactionForm', { transactionId: transaction.id });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Transaksi',
      'Apakah Anda yakin ingin menghapus transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await transactionAPI.delete(transactionId);
              Alert.alert('Success', 'Transaksi berhasil dihapus');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus transaksi');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.centered}>
        <Text>Transaksi tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Detail Transaksi"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color="#007bff" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Jumlah</Text>
          <Text
            style={[
              styles.amount,
              { color: transaction.type === 'INCOME' ? '#28a745' : '#dc3545' }
            ]}
          >
            {transaction.type === 'INCOME' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.typeBadge}>
            {transaction.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Detail Transaksi</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Deskripsi</Text>
            <Text style={styles.detailValue}>{transaction.description}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kategori</Text>
            <Text style={styles.detailValue}>{transaction.category}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Wallet</Text>
            <Text style={styles.detailValue}>{transaction.walletName}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tanggal</Text>
            <Text style={styles.detailValue}>
              {formatDate(transaction.transactionDate)}
            </Text>
          </View>
          
          {transaction.notes && (
            <>
              <View style={styles.separator} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Catatan</Text>
                <Text style={styles.detailValue}>{transaction.notes}</Text>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#007bff" />
            <Text style={styles.editButtonText}>Edit Transaksi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#dc3545" />
            <Text style={styles.deleteButtonText}>Hapus Transaksi</Text>
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
    paddingTop: 50
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  amountCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: '#f8f9fa',
    color: '#666',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flex: 0.48,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flex: 0.48,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc3545',
    marginLeft: 8,
  },
});

export default TransactionDetailScreen;