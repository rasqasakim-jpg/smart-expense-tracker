import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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

type WalletDetailScreenNavigationProp = StackNavigationProp<
  WalletStackParamList,
  'WalletDetail'
>;

type WalletDetailScreenRouteProp = RouteProp<WalletStackParamList, 'WalletDetail'>;

interface Props {
  navigation: WalletDetailScreenNavigationProp;
  route: WalletDetailScreenRouteProp;
}

const WalletDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { wallet } = route.params;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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

  const handleEdit = () => {
    navigation.navigate('WalletForm', { wallet });
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Wallet',
      `Apakah Anda yakin ingin menghapus ${wallet.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete
            Alert.alert('Success', 'Wallet berhasil dihapus');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Detail Wallet"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color="#007bff" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Wallet Info Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={[styles.iconContainer, { backgroundColor: wallet.color || '#007bff' }]}>
              <Ionicons
            name={
              wallet.type === 'CASH'
                ? 'cash-outline'
                : wallet.type === 'BANK'
                ? 'wallet-outline'
                : wallet.type === 'E-WALLET'
                ? 'phone-portrait-outline'
                : 'save-outline'
            }
            size={32}
            color="#fff"
            />

            </View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletName}>{wallet.name}</Text>
              <Text style={styles.walletType}>{getTypeLabel(wallet.type)}</Text>
            </View>
          </View>

          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Saldo Saat Ini</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(wallet.balance)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#007bff" />
            <Text style={[styles.actionButtonText, { color: '#007bff' }]}>
              Edit Wallet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#dc3545" />
            <Text style={[styles.actionButtonText, { color: '#dc3545' }]}>
              Hapus Wallet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History (Coming Soon) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>Fitur akan datang</Text>
            <Text style={styles.comingSoonSubtext}>
              Riwayat transaksi untuk wallet ini akan ditampilkan di sini
            </Text>
          </View>
        </View>
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
  content: {
    padding: 16,
  },
  walletCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  walletType: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  balanceSection: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
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
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default WalletDetailScreen;