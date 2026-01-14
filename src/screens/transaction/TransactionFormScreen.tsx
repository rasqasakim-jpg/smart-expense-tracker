import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { TransactionStackParamList, TransactionFormData } from '../../types/transaction';
import { transactionAPI } from '../../services/transactionApi';
import ScreenHeader from '../../components/layout/ScreenHeader';

// Mock data untuk categories dan wallets
const mockCategories = [
  { id: 1, name: 'Pendapatan', type: 'INCOME' },
  { id: 2, name: 'Belanja', type: 'EXPENSE' },
  { id: 3, name: 'Tagihan', type: 'EXPENSE' },
  { id: 4, name: 'Transport', type: 'EXPENSE' },
  { id: 5, name: 'Makanan', type: 'EXPENSE' },
];

const mockWallets = [
  { id: 1, name: 'Kas' },
  { id: 2, name: 'Bank BCA' },
  { id: 3, name: 'OVO' },
  { id: 4, name: 'Tabungan' },
];

type TransactionFormScreenNavigationProp = StackNavigationProp<
  TransactionStackParamList,
  'TransactionForm'
>;

type TransactionFormScreenRouteProp = RouteProp<
  TransactionStackParamList,
  'TransactionForm'
>;

interface Props {
  navigation: TransactionFormScreenNavigationProp;
  route: TransactionFormScreenRouteProp;
}

const TransactionFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactionId } = route.params || {};
  const isEdit = !!transactionId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    type: 'EXPENSE',
    description: '',
    categoryId: 0,
    walletId: 0,
    transactionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    notes: '',
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadTransaction();
    }
  }, []);

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getById(transactionId!);
      const transaction = response.data;
      
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        categoryId: transaction.categoryId,
        walletId: transaction.walletId,
        transactionDate: transaction.transactionDate,
        notes: transaction.notes || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Deskripsi harus diisi');
      return;
    }

    if (formData.amount <= 0) {
      Alert.alert('Error', 'Jumlah harus lebih dari 0');
      return;
    }

    if (!formData.categoryId) {
      Alert.alert('Error', 'Pilih kategori');
      return;
    }

    if (!formData.walletId) {
      Alert.alert('Error', 'Pilih wallet');
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit) {
        await transactionAPI.update(transactionId!, formData);
        Alert.alert('Success', 'Transaksi berhasil diperbarui');
      } else {
        await transactionAPI.create(formData);
        Alert.alert('Success', 'Transaksi berhasil dibuat');
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan transaksi');
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
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryName = (id: number) => {
    const category = mockCategories.find(c => c.id === id);
    return category ? category.name : 'Pilih Kategori';
  };

  const getWalletName = (id: number) => {
    const wallet = mockWallets.find(w => w.id === id);
    return wallet ? wallet.name : 'Pilih Wallet';
  };

  if (loading && isEdit) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Type Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipe Transaksi</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'EXPENSE' && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, type: 'EXPENSE' })}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'EXPENSE' && styles.typeButtonTextActive,
                ]}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'INCOME' && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, type: 'INCOME' })}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'INCOME' && styles.typeButtonTextActive,
                ]}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jumlah</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>Rp</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              value={formData.amount === 0 ? '' : formData.amount.toString()}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, '') || '0');
                setFormData({ ...formData, amount: num });
              }}
              keyboardType="numeric"
            />
          </View>
          {formData.amount > 0 && (
            <Text style={styles.amountPreview}>
              {formatCurrency(formData.amount)}
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Gaji Bulanan, Belanja Mingguan"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={[
              styles.pickerButtonText,
              !formData.categoryId && styles.pickerButtonPlaceholder
            ]}>
              {getCategoryName(formData.categoryId)}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Wallet Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Wallet</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowWalletModal(true)}
          >
            <Text style={[
              styles.pickerButtonText,
              !formData.walletId && styles.pickerButtonPlaceholder
            ]}>
              {getWalletName(formData.walletId)}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDateModal(true)}
          >
            <Text style={styles.pickerButtonText}>
              {formatDate(formData.transactionDate)}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catatan (Opsional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tambahkan catatan jika perlu"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Simpan Perubahan' : 'Simpan Transaksi'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Kategori</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {mockCategories
                .filter(cat => cat.type === formData.type)
                .map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.modalItem}
                    onPress={() => {
                      setFormData({ ...formData, categoryId: category.id });
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{category.name}</Text>
                    {formData.categoryId === category.id && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Wallet Modal */}
      <Modal
        visible={showWalletModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Wallet</Text>
              <TouchableOpacity onPress={() => setShowWalletModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {mockWallets.map(wallet => (
                <TouchableOpacity
                  key={wallet.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData({ ...formData, walletId: wallet.id });
                    setShowWalletModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{wallet.name}</Text>
                  {formData.walletId === wallet.id && (
                    <Ionicons name="checkmark" size={20} color="#007bff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Simple Date Modal */}
      <Modal
        visible={showDateModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Tanggal</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.dateOptions}>
              {['Hari Ini', 'Kemarin', '3 Hari Lalu', 'Minggu Lalu'].map((option, index) => {
                const date = new Date();
                if (option === 'Kemarin') date.setDate(date.getDate() - 1);
                if (option === '3 Hari Lalu') date.setDate(date.getDate() - 3);
                if (option === 'Minggu Lalu') date.setDate(date.getDate() - 7);
                
                const dateString = date.toISOString().split('T')[0];
                
                return (
                  <TouchableOpacity
                    key={option}
                    style={styles.modalItem}
                    onPress={() => {
                      setFormData({ ...formData, transactionDate: dateString });
                      setShowDateModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{option}</Text>
                    <Text style={styles.datePreview}>
                      {formatDate(dateString)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
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
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#1a1a1a',
  },
  amountPreview: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  pickerButtonPlaceholder: {
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  dateOptions: {
    paddingBottom: 20,
  },
  datePreview: {
    fontSize: 14,
    color: '#666',
  },
});

export default TransactionFormScreen;