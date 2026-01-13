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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Nama wallet harus diisi');
      return;
    }

    setSubmitting(true);
    const start = Date.now();

    try {
      const payload = {
        name,
        type,
        balance: initialBalance ? Number(initialBalance) : 0,
      };

      console.log('[wallet] submit start', { isEdit, payload });

      let response: any;
      if (isEdit) {
        response = await (await import('../../services/api')).walletAPI.update(wallet.id, {
          name,
          type,
          balance: Number(initialBalance || wallet.balance || 0),
        });
      } else {
        response = await (await import('../../services/api')).walletAPI.create(payload);
      }

      const elapsed = Date.now() - start;
      console.log(`[wallet] submit success elapsed=${elapsed}ms`, response);

      Alert.alert('Success', isEdit ? 'Wallet berhasil diperbarui' : 'Wallet berhasil ditambahkan');
      navigation.goBack();
    } catch (err: any) {
      const elapsed = Date.now() - start;
      console.log(`[wallet] submit error elapsed=${elapsed}ms`, err);
      const message = err?.message || (err?.data && err.data.message) || 'Gagal menyimpan wallet';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const walletTypes = [
    { value: 'CASH', label: 'Kas', icon: 'money', color: '#007bff' },
    { value: 'BANK', label: 'Bank', icon: 'account-balance', color: '#28a745' },
    { value: 'E-WALLET', label: 'E-Wallet', icon: 'smartphone', color: '#6f42c1' },
    { value: 'SAVINGS', label: 'Tabungan', icon: 'savings', color: '#ffc107' },
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
          <Text style={styles.label}>Nama Wallet</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Dompet Utama, BCA, OVO"
            value={name}
            onChangeText={setName}
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
                  { borderColor: walletType.color }
                ]}
                onPress={() => setType(walletType.value as any)}
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
        </View>

        {/* Saldo Awal (hanya untuk tambah baru) */}
        {!isEdit && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Saldo Awal (Opsional)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={initialBalance}
              onChangeText={setInitialBalance}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={[styles.submitButton, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
  typeLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  typeLabelSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WalletFormScreen;