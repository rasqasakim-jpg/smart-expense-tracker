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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { transactionSchema } from '../../utils/validation';
import { TransactionStackParamList, TransactionFormData } from '../../types/transaction';
import { transactionAPI } from '../../services/transactionApi';
import ScreenHeader from '../../components/layout/ScreenHeader';
import ValidatedInput from '../../components/common/ValidatedInput';

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
    transactionDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

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
    try {
      setLoading(true);
      setFormErrors({});
      
      // Validate with Yup
      await transactionSchema.validate(formData, { abortEarly: false });
      
      // Demo: Simulate API validation error
      if (formData.description.toLowerCase().includes('error')) {
        throw {
          success: false,
          message: 'Validation failed',
          errors: {
            amount: ['Jumlah tidak valid'],
            description: ['Deskripsi mengandung kata terlarang'],
            categoryId: ['Kategori tidak valid'],
          },
        };
      }
      
      if (isEdit) {
        await transactionAPI.update(transactionId!, formData);
        Alert.alert('Success', 'Transaksi berhasil diperbarui');
      } else {
        await transactionAPI.create(formData);
        Alert.alert('Success', 'Transaksi berhasil dibuat');
      }
      
      navigation.goBack();
      
    } catch (error: any) {
      console.log('Submit error:', error);
      
      // Handle Yup validation errors
      if (error.name === 'ValidationError') {
        const errors: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
        
        // Show first error in alert
        const firstError = Object.values(errors)[0];
        if (firstError) {
          Alert.alert('Validasi Gagal', firstError);
        }
        return;
      }
      
      // Handle API validation errors (422)
      if (error?.errors) {
        const errors: Record<string, string> = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = error.errors[key][0];
        });
        setFormErrors(errors);
        
        const firstError = Object.values(errors)[0];
        Alert.alert('Validasi Gagal', firstError);
        return;
      }
      
      // Handle other errors
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

  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFieldTouch = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleAmountChange = (text: string) => {
    const num = parseInt(text.replace(/[^0-9]/g, '') || '0');
    setFormData({ ...formData, amount: num });
    clearError('amount');
  };

  const handleDescriptionChange = (text: string) => {
    setFormData({ ...formData, description: text });
    clearError('description');
  };

  const handleCategorySelect = (id: number) => {
    setFormData({ ...formData, categoryId: id });
    clearError('categoryId');
    setShowCategoryModal(false);
    handleFieldTouch('categoryId');
  };

  const handleWalletSelect = (id: number) => {
    setFormData({ ...formData, walletId: id });
    clearError('walletId');
    setShowWalletModal(false);
    handleFieldTouch('walletId');
  };

  if (loading && isEdit) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView 
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
              disabled={loading}
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
              disabled={loading}
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
          <View style={[
            styles.amountContainer,
            formErrors.amount && styles.inputError
          ]}>
            <Ionicons 
              name="cash-outline" 
              size={20} 
              color={formErrors.amount ? "#FF3B30" : "#666"} 
              style={styles.currencyIcon}
            />
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor="#999"
              value={formData.amount === 0 ? '' : formData.amount.toString()}
              onChangeText={handleAmountChange}
              onBlur={() => handleFieldTouch('amount')}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
          {formErrors.amount && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color="#FF3B30" />
              <Text style={styles.errorText}>{formErrors.amount}</Text>
            </View>
          )}
          {formData.amount > 0 && !formErrors.amount && (
            <Text style={styles.amountPreview}>
              {formatCurrency(formData.amount)}
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <View style={[
            styles.inputWithIcon,
            formErrors.description && styles.inputError
          ]}>
            <Ionicons 
              name="document-text-outline" 
              size={20} 
              color={formErrors.description ? "#FF3B30" : "#666"} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contoh: Gaji Bulanan, Belanja Mingguan"
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={handleDescriptionChange}
              onBlur={() => handleFieldTouch('description')}
              editable={!loading}
            />
          </View>
          {formErrors.description && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color="#FF3B30" />
              <Text style={styles.errorText}>{formErrors.description}</Text>
            </View>
          )}
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori</Text>
          <TouchableOpacity
            style={[
              styles.pickerButton,
              formErrors.categoryId && styles.inputError
            ]}
            onPress={() => setShowCategoryModal(true)}
            disabled={loading}
          >
            <Ionicons
              name="pricetags-outline"
              size={20}
              color={formErrors.categoryId ? "#FF3B30" : "#666"}
              style={styles.pickerIcon}
            />
            <Text style={[
              styles.pickerButtonText,
              !formData.categoryId && styles.pickerButtonPlaceholder,
              formErrors.categoryId && styles.pickerButtonError
            ]}>
              {getCategoryName(formData.categoryId)}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={24} 
              color={formErrors.categoryId ? "#FF3B30" : "#666"} 
            />
          </TouchableOpacity>
          {formErrors.categoryId && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color="#FF3B30" />
              <Text style={styles.errorText}>{formErrors.categoryId}</Text>
            </View>
          )}
        </View>

        {/* Wallet Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Wallet</Text>
          <TouchableOpacity
            style={[
              styles.pickerButton,
              formErrors.walletId && styles.inputError
            ]}
            onPress={() => setShowWalletModal(true)}
            disabled={loading}
          >
            <Ionicons
              name="wallet-outline"
              size={20}
              color={formErrors.walletId ? "#FF3B30" : "#666"}
              style={styles.pickerIcon}
            />
            <Text style={[
              styles.pickerButtonText,
              !formData.walletId && styles.pickerButtonPlaceholder,
              formErrors.walletId && styles.pickerButtonError
            ]}>
              {getWalletName(formData.walletId)}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={24} 
              color={formErrors.walletId ? "#FF3B30" : "#666"} 
            />
          </TouchableOpacity>
          {formErrors.walletId && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color="#FF3B30" />
              <Text style={styles.errorText}>{formErrors.walletId}</Text>
            </View>
          )}
        </View>

        {/* Date Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDateModal(true)}
            disabled={loading}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#666"
              style={styles.pickerIcon}
            />
            <Text style={styles.pickerButtonText}>
              {formatDate(formData.transactionDate)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catatan (Opsional)</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons 
              name="create-outline" 
              size={20} 
              color="#666" 
              style={[styles.inputIcon, styles.textAreaIcon]}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tambahkan catatan jika perlu"
              placeholderTextColor="#999"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>
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
            <>
              <Ionicons 
                name={isEdit ? "checkmark-circle" : "add-circle"} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.submitButtonText}>
                {isEdit ? 'Simpan Perubahan' : 'Simpan Transaksi'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Demo Hint */}
        {!isEdit && (
          <View style={styles.demoHint}>
            <Text style={styles.demoHintText}>
              Demo: Ketik "error" di deskripsi untuk simulasi validation error
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
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
                    onPress={() => handleCategorySelect(category.id)}
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
        onRequestClose={() => setShowWalletModal(false)}
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
                  onPress={() => handleWalletSelect(wallet.id)}
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
        onRequestClose={() => setShowDateModal(false)}
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
    </KeyboardAvoidingView>
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
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
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
    padding: 14,
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
  currencyIcon: {
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
    color: '#28a745',
    fontWeight: '500',
    marginTop: 6,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textAreaIcon: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  pickerIcon: {
    marginRight: 8,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  pickerButtonPlaceholder: {
    color: '#999',
  },
  pickerButtonError: {
    color: '#FF3B30',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoHint: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginTop: 8,
  },
  demoHintText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
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