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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Category } from '../../types/category';
import { Wallet } from '../../types/wallet';
import CategoryPicker from '../../components/transaction/CategoryPicker';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { useCategories } from '../../store/contexts/CategoryContext';
import { useWallets } from '../../store/contexts/WalletProvider';
import WalletPicker from '../../components/transaction/WalletPicker';

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

interface FormErrors {
  amount?: string;
  title?: string;
  category?: string;
  wallet?: string;
}

const AddTransactionScreen: React.FC<Props> = ({ navigation }) => {
  const [transactionType, setTransactionType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedWallet, setSelectedWallet] = useState<Wallet>();
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    amount: false,
    title: false,
    category: false,
    wallet: false,
  });

  // Gunakan context untuk categories dan wallets
  const { categories, loading: categoriesLoading } = useCategories();
  const { wallets, loading: walletsLoading } = useWallets();

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate amount
    if (!amount.trim()) {
      newErrors.amount = 'Jumlah harus diisi';
    } else if (parseInt(amount) <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0';
    }
    
    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Judul harus diisi';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Judul minimal 3 karakter';
    }
    
    // Validate category
    if (!selectedCategory) {
      newErrors.category = 'Kategori harus dipilih';
    }
    
    // Validate wallet
    if (!selectedWallet) {
      newErrors.wallet = 'Wallet harus dipilih';
    }
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    setTouched({
      amount: true,
      title: true,
      category: true,
      wallet: true,
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (text: string) => {
    // Hanya angka
    const cleaned = text.replace(/\D/g, '');
    setAmount(cleaned);
    
    // Clear error when user starts typing
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    
    // Clear error when user starts typing
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    
    // Clear error when category is selected
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const handleWalletSelect = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    
    // Clear error when wallet is selected
    if (errors.wallet) {
      setErrors(prev => ({ ...prev, wallet: undefined }));
    }
  };

  const handleTypeChange = (type: 'EXPENSE' | 'INCOME') => {
    setTransactionType(type);
    setSelectedCategory(undefined); // Reset category when type changes
    
    // Clear category error if exists
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field on blur
    switch (field) {
      case 'amount':
        if (!amount.trim()) {
          setErrors(prev => ({ ...prev, amount: 'Jumlah harus diisi' }));
        } else if (parseInt(amount) <= 0) {
          setErrors(prev => ({ ...prev, amount: 'Jumlah harus lebih dari 0' }));
        }
        break;
      case 'title':
        if (!title.trim()) {
          setErrors(prev => ({ ...prev, title: 'Judul harus diisi' }));
        } else if (title.trim().length < 3) {
          setErrors(prev => ({ ...prev, title: 'Judul minimal 3 karakter' }));
        }
        break;
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Prepare transaction data
      const transactionData = {
        type: transactionType,
        amount: parseInt(amount),
        description: title,
        categoryId: selectedCategory!.id,
        walletId: selectedWallet!.id,
        transactionDate: date.toISOString().split('T')[0],
        notes: note.trim() || undefined,
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
            setSelectedWallet(undefined);
            setNote('');
            setErrors({});
            setTouched({
              amount: false,
              title: false,
              category: false,
              wallet: false,
            });
            // Navigate back
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      // Handle API errors (422 validation errors)
      if (error?.errors) {
        const apiErrors: FormErrors = {};
        Object.keys(error.errors).forEach(key => {
          if (key === 'amount') apiErrors.amount = error.errors[key][0];
          if (key === 'description' || key === 'title') apiErrors.title = error.errors[key][0];
          if (key === 'categoryId') apiErrors.category = error.errors[key][0];
          if (key === 'walletId') apiErrors.wallet = error.errors[key][0];
        });
        setErrors(apiErrors);
      } else {
        Alert.alert('Error', error?.message || 'Gagal menambahkan transaksi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
            onPress={() => handleTypeChange('EXPENSE')}
            disabled={loading}
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
            onPress={() => handleTypeChange('INCOME')}
            disabled={loading}
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
          <View style={[
            styles.amountContainer,
            errors.amount && touched.amount && styles.inputError
          ]}>
            <Text style={styles.amountPreview}>
              {formatCurrency(amount)}
            </Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              value={amount}
              onChangeText={handleAmountChange}
              onBlur={() => handleBlur('amount')}
              keyboardType="numeric"
              autoFocus={true}
              editable={!loading}
            />
          </View>
          {errors.amount && touched.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
        </View>

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Judul Transaksi</Text>
          <TextInput
            style={[
              styles.input,
              errors.title && touched.title && styles.inputError
            ]}
            placeholder="Contoh: Gaji Bulanan, Belanja Mingguan"
            value={title}
            onChangeText={handleTitleChange}
            onBlur={() => handleBlur('title')}
            editable={!loading}
          />
          {errors.title && touched.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          {/* <Text style={styles.label}>Kategori</Text> */}
          <CategoryPicker
            selectedCategoryId={selectedCategory?.id}
            onSelectCategory={handleCategorySelect}
            transactionType={transactionType}
            error={errors.category && touched.category ? errors.category : undefined}
          />
        </View>

        {/* Wallet Picker */}
        <View style={styles.inputGroup}>
          {/* <Text style={styles.label}>Wallet</Text> */}
          <WalletPicker
            selectedWalletId={selectedWallet?.id}
            onSelectWallet={handleWalletSelect}
            error={errors.wallet && touched.wallet ? errors.wallet : undefined}
          />
        </View>

        {/* Date Display */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </View>
          <Text style={styles.dateHint}>
            Transaksi akan dicatat dengan tanggal hari ini
          </Text>
        </View>

        {/* Note Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catatan (Opsional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Tambahkan catatan jika perlu..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || categoriesLoading || walletsLoading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Tambah Transaksi</Text>
          )}
        </TouchableOpacity>
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
  content: {
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  inputError: {
    borderColor: '#dc3545',
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
    padding: 0,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  noteInput: {
    minHeight: 100,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  dateHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AddTransactionScreen;