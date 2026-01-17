import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category } from '../../types/category';
import CategoryPicker from '../../components/transaction/CategoryPicker';
import ScreenHeader from '../../components/layout/ScreenHeader';

type TransactionStackParamList = {
  AddTransaction: undefined;
};

type AddTransactionScreenNavigationProp = StackNavigationProp<
  TransactionStackParamList,
  'AddTransaction'
>;

interface Props {
  navigation: AddTransactionScreenNavigationProp;
}

const AddTransactionScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [transactionType, setTransactionType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [_showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data mock kategori (nanti ambil dari API/context)
  const [categories, _setCategories] = useState<Category[]>([
    { id: 1, name: 'Makanan & Minuman', type: 'EXPENSE', icon: 'restaurant', color: '#dc3545', createdAt: '2024-01-13' },
    { id: 2, name: 'Transportasi', type: 'EXPENSE', icon: 'directions-car', color: '#fd7e14', createdAt: '2024-01-13' },
    { id: 3, name: 'Belanja', type: 'EXPENSE', icon: 'shopping-cart', color: '#6f42c1', createdAt: '2024-01-13' },
    { id: 4, name: 'Hiburan', type: 'EXPENSE', icon: 'movie', color: '#20c997', createdAt: '2024-01-13' },
    { id: 5, name: 'Gaji', type: 'INCOME', icon: 'work', color: '#007bff', createdAt: '2024-01-13' },
    { id: 6, name: 'Bonus', type: 'INCOME', icon: 'card-giftcard', color: '#6f42c1', createdAt: '2024-01-13' },
    { id: 7, name: 'Investasi', type: 'INCOME', icon: 'trending-up', color: '#28a745', createdAt: '2024-01-13' },
  ]);

  const formatCurrency = (value: string) => {
    if (!value) return 'Rp 0';
    const num = parseInt(value.replace(/\D/g, '') || '0');
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAmountChange = (text: string) => {
    // Hanya angka
    const cleaned = text.replace(/\D/g, '');
    setAmount(cleaned);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseInt(amount) === 0) {
      Alert.alert('Error', 'Jumlah transaksi harus diisi');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Judul transaksi harus diisi');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Kategori harus dipilih');
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Panggil API untuk simpan transaksi
      const transactionData = {
        type: transactionType,
        amount: parseInt(amount),
        title,
        categoryId: selectedCategory.id,
        date: date.toISOString().split('T')[0],
        note: note.trim() || undefined,
      };

      console.log('Transaction data:', transactionData);
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(() => resolve(true), 1500));
      
      Alert.alert('Success', 'Transaksi berhasil ditambahkan', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setAmount('');
            setTitle('');
            setSelectedCategory(undefined);
            setNote('');
            // Navigate back or stay based on requirement
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menambahkan transaksi');
      console.log('Add transaction error:', error);//development log
    } finally {
      setLoading(false);
    }
  };

  // Filter categories by transaction type
  const filteredCategories = categories.filter(cat => cat.type === transactionType);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Tambah Transaksi"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Transaction Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'EXPENSE' && styles.typeButtonActiveExpense,
            ]}
            onPress={() => {
              setTransactionType('EXPENSE');
              setSelectedCategory(undefined); // Reset category when type changes
            }}
          >
            <Text
              style={[
                styles.typeButtonText,
                transactionType === 'EXPENSE' && styles.typeButtonTextActive,
              ]}
            >
              Pengeluaran
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'INCOME' && styles.typeButtonActiveIncome,
            ]}
            onPress={() => {
              setTransactionType('INCOME');
              setSelectedCategory(undefined); // Reset category when type changes
            }}
          >
            <Text
              style={[
                styles.typeButtonText,
                transactionType === 'INCOME' && styles.typeButtonTextActive,
              ]}
            >
              Pemasukan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jumlah</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountPreview}>
              {formatCurrency(amount)}
            </Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              autoFocus={true}
            />
          </View>
        </View>

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Judul</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan judul transaksi"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori</Text>
          <CategoryPicker
            categories={filteredCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            type={transactionType}
            placeholder="Pilih kategori"
          />
        </View>

        {/* Date Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Note Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catatan (Opsional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Tambahkan catatan..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
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
            <Text style={styles.submitButtonText}>Tambah Transaksi</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      {/* {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50
  },
  content: {
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActiveExpense: {
    backgroundColor: '#dc3545',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#28a745',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
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
  amountContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
  },
  amountPreview: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 16,
    color: '#666',
    height: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  noteInput: {
    minHeight: 100,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    height: 56,
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;