import React, { ComponentProps } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Wallet } from '../../types/wallet';

type IoniconName = ComponentProps<typeof Ionicons>['name']

interface WalletCardProps {
  wallet: Wallet;
  onDetailPress: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, onDetailPress }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeIcon = (type: Wallet['type']): IoniconName => {
  switch (type) {
    case 'CASH':
      return 'cash-outline';
    case 'BANK':
      return 'wallet-outline';
    case 'E-WALLET':
      return 'phone-portrait-outline';
    case 'SAVINGS':
      return 'save-outline';
    default:
      return 'wallet-outline';
  }
};


  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CASH': return 'Kas';
      case 'BANK': return 'Bank';
      case 'E-WALLET': return 'E-Wallet';
      case 'SAVINGS': return 'Tabungan';
      default: return type;
    }
  };

  // Map type ke warna sesuai wireframe
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CASH': return '#007bff'; // Biru
      case 'BANK': return '#28a745'; // Hijau
      case 'E-WALLET': return '#6f42c1'; // Ungu
      case 'SAVINGS': return '#ffc107'; // Kuning
      default: return '#007bff';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: getTypeColor(wallet.type) }]}>
          <Ionicons name={getTypeIcon(wallet.type)} size={24} color="#fff" />
        </View>
        <View style={styles.walletInfo}>
          <Text style={styles.walletName}>{wallet.name}</Text>
          <Text style={styles.walletType}>{getTypeLabel(wallet.type)}</Text>
        </View>
      </View>
      
      <View style={styles.footerContainer}>
        <Text style={styles.balanceAmount}>{formatCurrency(wallet.balance)}</Text>
        <TouchableOpacity style={styles.detailButton} onPress={onDetailPress}>
          <Text style={styles.detailButtonText}>Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  walletType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  detailButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WalletCard;