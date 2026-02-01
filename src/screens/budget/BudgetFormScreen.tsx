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
import { BudgetStackParamList, Budget, BudgetFormData } from '../../types/budget';
import { budgetAPI } from '../../services/budgetApi';
import { validateBudgetForm, formatBudgetPeriod } from '../../utils/budgetHelper';
import ScreenHeader from '../../components/layout/ScreenHeader';

type BudgetFormScreenNavigationProp = StackNavigationProp<
  BudgetStackParamList,
  'BudgetForm'
>;

type BudgetFormScreenRouteProp = RouteProp<BudgetStackParamList, 'BudgetForm'>;

interface Props {
  navigation: BudgetFormScreenNavigationProp;
  route: BudgetFormScreenRouteProp;
}

const BudgetFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const budget = route.params?.budget;
  const isEdit = !!budget;
  
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  
  const [formData, setFormData] = useState<BudgetFormData>({
    categoryId: budget?.categoryId || 0,
    amount: budget?.amount || 0,
    period: budget?.period || 'MONTHLY',
    month: budget?.month || new Date().getMonth() + 1,
    year: budget?.year || new Date().getFullYear(),
  });
  
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
    Ionicons?: string;
  } | null>(null);

  // Mock categories (nanti integrate dengan category service)
  const categories = [
    { id: 2, name: 'Belanja', Ionicons: 'cart-outline' },
    { id: 3, name: 'Tagihan', Ionicons: 'receipt' },
    { id: 4, name: 'Transport', Ionicons: 'car-sport-outline' },
    { id: 5, name: 'Makanan', Ionicons: 'restaurant' },
    { id: 6, name: 'Hiburan', Ionicons: 'videocam-outline' },
    { id: 7, name: 'Kesehatan', Ionicons: 'medkit-outline' },
    { id: 8, name: 'Pendidikan', Ionicons: 'school' },
    { id: 9, name: 'Lainnya', Ionicons: 'ellipsis-horizontal-outline' },
  ];

  const periodOptions = [
    { value: 'MONTHLY', label: 'Bulanan' },
    { value: 'WEEKLY', label: 'Mingguan' },
    { value: 'YEARLY', label: 'Tahunan' },
  ];

  const monthOptions = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const yearOptions = [
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
  ];

  useEffect(() => {
    if (budget) {
      const category = categories.find(c => c.id === budget.categoryId);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [budget]);

  const handleSubmit = async () => {
    const errors = validateBudgetForm(formData);
    if (errors.length > 0) {
      Alert.alert('Validasi Gagal', errors[0]);
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit && budget) {
        await budgetAPI.update(budget.id, formData);
        Alert.alert('Success', 'Budget berhasil diperbarui');
      } else {
        await budgetAPI.create(formData);
        Alert.alert('Success', 'Budget berhasil dibuat');
      }
      
      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving budget:', error);
      
      if (error?.errors?.categoryId) {
        Alert.alert('Error', error.errors.categoryId[0]);
      } else {
        Alert.alert('Error', error?.message || 'Gagal menyimpan budget');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: typeof categories[0]) => {
    setSelectedCategory(category);
    setFormData({ ...formData, categoryId: category.id });
    setShowCategoryModal(false);
  };

  const handlePeriodSelect = (period: 'MONTHLY' | 'WEEKLY' | 'YEARLY') => {
    setFormData({ ...formData, period });
    setShowPeriodModal(false);
  };

  const handleMonthSelect = (month: number) => {
    setFormData({ ...formData, month });
    setShowMonthModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSelectedMonthName = () => {
    const month = monthOptions.find(m => m.value === formData.month);
    return month ? month.label : '';
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={isEdit ? 'Edit Budget' : 'Buat Budget Baru'}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowCategoryModal(true)}
          >
            {selectedCategory ? (
              <View style={styles.selectedCategory}>
                <Ionicons 
                  name={selectedCategory.Ionicons as any || 'category'} 
                  size={20} 
                  color="#007bff" 
                />
                <Text style={styles.selectedCategoryText}>
                  {selectedCategory.name}
                </Text>
              </View>
            ) : (
              <Text style={styles.pickerPlaceholder}>Pilih kategori</Text>
            )}
            <Ionicons name="pricetags-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jumlah Budget</Text>
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

        {/* Period Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Periode Budget</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowPeriodModal(true)}
          >
            <Text style={styles.pickerText}>
              {formatBudgetPeriod(formData.period, formData.month)}
            </Text>
            <Ionicons name="timer-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Month Selection (only for monthly) */}
        {formData.period === 'MONTHLY' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bulan</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowMonthModal(true)}
            >
              <Text style={styles.pickerText}>
                {getSelectedMonthName()}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Year Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tahun</Text>
          <View style={styles.yearButtonsContainer}>
            {yearOptions.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearButton,
                  formData.year === year && styles.yearButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, year })}
              >
                <Text style={[
                  styles.yearButtonText,
                  formData.year === year && styles.yearButtonTextSelected,
                ]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-outline" size={20} color="#007bff" />
          <Text style={styles.infoText}>
            Budget akan membantu Anda mengontrol pengeluaran per kategori.
            Sistem akan menampilkan status HEMAT/NORMAL/BOROS berdasarkan penggunaan.
          </Text>
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
              {isEdit ? 'Simpan Perubahan' : 'Buat Budget'}
            </Text>
          )}
        </TouchableOpacity>
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
            <ScrollView style={styles.modalBody}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalItem,
                    selectedCategory?.id === category.id && styles.modalItemSelected,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Ionicons 
                    name={category.Ionicons as any || 'category'} 
                    size={24} 
                    color={selectedCategory?.id === category.id ? '#fff' : '#666'} 
                  />
                  <Text style={[
                    styles.modalItemText,
                    selectedCategory?.id === category.id && styles.modalItemTextSelected,
                  ]}>
                    {category.name}
                  </Text>
                  {selectedCategory?.id === category.id && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Period Modal */}
      <Modal
        visible={showPeriodModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Periode</Text>
              <TouchableOpacity onPress={() => setShowPeriodModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {periodOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalItem,
                    formData.period === option.value && styles.modalItemSelected,
                  ]}
                  onPress={() => handlePeriodSelect(option.value as any)}
                >
                  <Text style={[
                    styles.modalItemText,
                    formData.period === option.value && styles.modalItemTextSelected,
                  ]}>
                    {option.label}
                  </Text>
                  {formData.period === option.value && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Month Modal */}
      <Modal
        visible={showMonthModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Bulan</Text>
              <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {monthOptions.map(month => (
                <TouchableOpacity
                  key={month.value}
                  style={[
                    styles.modalItem,
                    formData.month === month.value && styles.modalItemSelected,
                  ]}
                  onPress={() => handleMonthSelect(month.value)}
                >
                  <Text style={[
                    styles.modalItemText,
                    formData.month === month.value && styles.modalItemTextSelected,
                  ]}>
                    {month.label}
                  </Text>
                  {formData.month === month.value && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  formContainer: {
    padding: 16,
    paddingBottom: 32,
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
  pickerPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  pickerText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedCategoryText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 8,
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
  yearButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  yearButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  yearButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  yearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  yearButtonTextSelected: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0066cc',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalBody: {
    padding: 20,
    paddingBottom: 40,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#007bff',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
    marginLeft: 12,
  },
  modalItemTextSelected: {
    color: '#fff',
  },
});

export default BudgetFormScreen;