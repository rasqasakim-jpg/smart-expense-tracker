import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Wallet } from '../../types/wallet';
import ScreenHeader from '../../components/layout/ScreenHeader';
import ValidatedInput from '../../components/common/ValidatedInput';

type WalletStackParamList = {
  WalletList: undefined;
  WalletDetail: { wallet: Wallet };
  WalletForm: { wallet?: Wallet };
};

type WalletFormScreenNavigationProp = StackNavigationProp<
  WalletStackParamList,
  'WalletForm'
>;

type WalletFormScreenRouteProp = RouteProp<WalletStackParamList, 'WalletForm'>;

interface Props {
  navigation: WalletFormScreenNavigationProp;
  route: WalletFormScreenRouteProp;
}

interface FormErrors {
  name?: string;
  type?: string;
  initialBalance?: string;
}

const WalletFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const wallet = route.params?.wallet;
  const isEdit = !!wallet;

  const [name, setName] = useState(wallet?.name || '');
  const [type, setType] = useState<'CASH' | 'BANK' | 'E-WALLET' | 'SAVINGS'>(
    wallet?.type || 'CASH'
  );
  const [initialBalance, setInitialBalance] = useState(
    wallet?.balance?.toString() || ''
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    type: false,
    initialBalance: false,
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Nama wallet harus diisi';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }
    
    // Validate type
    if (!type) {
      newErrors.type = 'Tipe wallet harus dipilih';
    }
    
    // Validate initial balance (if provided)
    if (initialBalance.trim() && isNaN(parseInt(initialBalance))) {
      newErrors.initialBalance = 'Saldo harus berupa angka';
    } else if (parseInt(initialBalance) < 0) {
      newErrors.initialBalance = 'Saldo tidak boleh negatif';
    }
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    setTouched({
      name: true,
      type: true,
      initialBalance: true,
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (text: string) => {
    setName(text);
    
    // Clear error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleTypeChange = (newType: 'CASH' | 'BANK' | 'E-WALLET' | 'SAVINGS') => {
    setType(newType);
    
    // Clear error when type is selected
    if (errors.type) {
      setErrors(prev => ({ ...prev, type: undefined }));
    }
  };

  const handleInitialBalanceChange = (text: string) => {
    // Hanya angka
    const cleaned = text.replace(/\D/g, '');
    setInitialBalance(cleaned);
    
    // Clear error when user starts typing
    if (errors.initialBalance) {
      setErrors(prev => ({ ...prev, initialBalance: undefined }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field on blur
    switch (field) {
      case 'name':
        if (!name.trim()) {
          setErrors(prev => ({ ...prev, name: 'Nama wallet harus diisi' }));
        } else if (name.trim().length < 2) {
          setErrors(prev => ({ ...prev, name: 'Nama minimal 2 karakter' }));
        }
        break;
      case 'initialBalance':
        if (initialBalance.trim() && isNaN(parseInt(initialBalance))) {
          setErrors(prev => ({ ...prev, initialBalance: 'Saldo harus berupa angka' }));
        } else if (parseInt(initialBalance) < 0) {
          setErrors(prev => ({ ...prev, initialBalance: 'Saldo tidak boleh negatif' }));
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
      
      // TODO: Panggil API untuk simpan wallet
      const walletData = {
        name: name.trim(),
        type,
        initialBalance: initialBalance ? parseInt(initialBalance) : 0,
      };

      console.log('Wallet data:', walletData);
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(() => resolve(true), 1000));
      
      Alert.alert(
        'Success',
        isEdit ? 'Wallet berhasil diperbarui' : 'Wallet berhasil ditambahkan',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setName('');
              setType('CASH');
              setInitialBalance('');
              setErrors({});
              setTouched({
                name: false,
                type: false,
                initialBalance: false,
              });
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      // Handle API errors (422 validation errors)
      if (error?.errors) {
        const apiErrors: FormErrors = {};
        Object.keys(error.errors).forEach(key => {
          if (key === 'name') apiErrors.name = error.errors[key][0];
          if (key === 'type') apiErrors.type = error.errors[key][0];
          if (key === 'initialBalance' || key === 'balance') {
            apiErrors.initialBalance = error.errors[key][0];
          }
        });
        setErrors(apiErrors);
      } else {
        Alert.alert('Error', error?.message || 'Gagal menyimpan wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  const walletTypes = [
    { value: 'CASH', label: 'Kas', icon: 'cash-outline', color: '#007bff' },
    { value: 'BANK', label: 'Bank', icon: 'business-outline', color: '#28a745' },
    { value: 'E-WALLET', label: 'E-Wallet', icon: 'phone-portrait-outline', color: '#6f42c1' },
    { value: 'SAVINGS', label: 'Tabungan', icon: 'wallet-outline', color: '#ffc107' },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={isEdit ? 'Edit Wallet' : 'Tambah Wallet Baru'}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Nama Wallet */}
        <View style={styles.inputGroup}>
          <ValidatedInput
            label="Nama Wallet"
            placeholder="Contoh: Dompet Utama, BCA, OVO"
            value={name}
            onChangeText={handleNameChange}
            onBlur={() => handleBlur('name')}
            error={errors.name}
            touched={touched.name}
            editable={!loading}
            maxLength={50}
          />
        </View>

        {/* Tipe Wallet */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipe Wallet</Text>
          <View style={styles.typeContainer}>
            {walletTypes.map((walletType) => (
              <TouchableOpacity
                key={walletType.value}
                style={[
                  styles.typeOption,
                  type === walletType.value && styles.typeOptionSelected,
                  { borderColor: walletType.color },
                  errors.type && touched.type && styles.typeOptionError,
                ]}
                onPress={() => handleTypeChange(walletType.value as any)}
                disabled={loading}
              >
                <Ionicons
                  name={walletType.icon as any}
                  size={20}
                  color={type === walletType.value ? '#fff' : walletType.color}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    type === walletType.value && styles.typeLabelSelected,
                  ]}
                >
                  {walletType.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.type && touched.type && (
            <Text style={styles.errorText}>{errors.type}</Text>
          )}
        </View>

        {/* Saldo Awal (hanya untuk tambah baru) */}
        {!isEdit && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Saldo Awal (Opsional)</Text>
            <View style={[
              styles.balanceContainer,
              errors.initialBalance && touched.initialBalance && styles.inputError
            ]}>
              <Text style={styles.currencySymbol}>Rp</Text>
              <TextInput
                style={styles.balanceInput}
                placeholder="0"
                value={initialBalance}
                onChangeText={handleInitialBalanceChange}
                onBlur={() => handleBlur('initialBalance')}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
            {errors.initialBalance && touched.initialBalance && (
              <Text style={styles.errorText}>{errors.initialBalance}</Text>
            )}
          </View>
        )}

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
              {isEdit ? 'Simpan Perubahan' : 'Tambah Wallet'}
            </Text>
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
    paddingTop: 50,
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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#fff',
    minWidth: 100,
  },
  typeOptionSelected: {
    backgroundColor: '#007bff',
  },
  typeOptionError: {
    borderColor: '#dc3545',
  },
  typeLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  typeLabelSelected: {
    color: '#fff',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  balanceInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1a1a1a',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
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

export default WalletFormScreen;