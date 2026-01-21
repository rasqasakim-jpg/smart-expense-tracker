import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useWallets } from '../../store/contexts/WalletProvider';
import { Wallet } from '../../types/wallet';

interface WalletPickerProps {
  selectedWalletId?: number;
  onSelectWallet: (wallet: Wallet) => void;
  label?: string;
  error?: string;
}

const WalletPicker: React.FC<WalletPickerProps> = ({
  selectedWalletId,
  onSelectWallet,
  label = 'Wallet',
  error,
}) => {
  const { wallets, loading } = useWallets();
  const [showModal, setShowModal] = useState(false);

  const selectedWallet = wallets.find(wallet => wallet.id === selectedWalletId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'CASH': return 'money';
      case 'BANK': return 'account-balance';
      case 'E-WALLET': return 'smartphone';
      case 'SAVINGS': return 'savings';
      default: return 'account-balance-wallet';
    }
  };

  const handleSelect = (wallet: Wallet) => {
    onSelectWallet(wallet);
    setShowModal(false);
  };

  const renderWalletItem = ({ item }: { item: Wallet }) => (
    <TouchableOpacity
      style={[
        styles.walletItem,
        selectedWalletId === item.id && styles.walletItemSelected,
      ]}
      onPress={() => handleSelect(item)}
    >
      <View style={[styles.walletIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={20} color="#fff" />
      </View>
      <View style={styles.walletInfo}>
        <Text
          style={[
            styles.walletName,
            selectedWalletId === item.id && styles.walletNameSelected,
          ]}
        >
          {item.name}
        </Text>
        <Text style={styles.walletBalance}>{formatCurrency(item.balance)}</Text>
      </View>
      {selectedWalletId === item.id && (
        <Ionicons name="checkmark" size={20} color="#007bff" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.pickerButton, error && styles.pickerButtonError]}
        onPress={() => setShowModal(true)}
        disabled={loading}
      >
        {selectedWallet ? (
          <View style={styles.selectedWallet}>
            <View style={[styles.walletIcon, { backgroundColor: selectedWallet.color }]}>
              <Ionicons name={selectedWallet.icon as any} size={16} color="#fff" />
            </View>
            <View style={styles.selectedWalletInfo}>
              <Text style={styles.selectedWalletName}>{selectedWallet.name}</Text>
              <Text style={styles.selectedWalletBalance}>
                {formatCurrency(selectedWallet.balance)}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.placeholderText}>Pilih Wallet</Text>
        )}
        <Ionicons name="wallet-outline" size={24} color="#666" />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Wallet</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text>Memuat wallet...</Text>
              </View>
            ) : (
              <FlatList
                data={wallets}
                renderItem={renderWalletItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.walletList}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text>Belum ada wallet</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
    minHeight: 50,
  },
  pickerButtonError: {
    borderColor: '#dc3545',
  },
  selectedWallet: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedWalletInfo: {
    flex: 1,
  },
  selectedWalletName: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  selectedWalletBalance: {
    fontSize: 12,
    color: '#666',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  walletList: {
    padding: 16,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  walletItemSelected: {
    backgroundColor: '#e7f3ff',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  walletInfo: {
    flex: 1,
    marginLeft: 12,
  },
  walletName: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  walletNameSelected: {
    color: '#007bff',
    fontWeight: '600',
  },
  walletBalance: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});

export default WalletPicker;