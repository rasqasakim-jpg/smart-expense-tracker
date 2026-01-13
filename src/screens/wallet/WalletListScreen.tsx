import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Wallet } from '../../types/wallet';
import WalletCard from '../../components/wallet/WalletCard';

type WalletStackParamList = {
  WalletList: undefined;
  WalletDetail: { wallet: Wallet };
  WalletForm: { wallet?: Wallet };
};

type WalletListScreenNavigationProp = StackNavigationProp<
  WalletStackParamList,
  'WalletList'
>;

interface Props {
  navigation: WalletListScreenNavigationProp;
}

const WalletListScreen: React.FC<Props> = ({ navigation }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = () => {
    const mockWallets: Wallet[] = [
      {
        id: 1,
        name: 'Kas',
        balance: 2000000,
        type: 'CASH',
        color: '#007bff',
        createdAt: '2024-01-13',
      },
      {
        id: 2,
        name: 'Bank BCA',
        balance: 5250000,
        type: 'BANK',
        color: '#28a745',
        createdAt: '2024-01-13',
      },
      {
        id: 3,
        name: 'OVO',
        balance: 750000,
        type: 'E-WALLET',
        color: '#6f42c1',
        createdAt: '2024-01-13',
      },
      {
        id: 4,
        name: 'Tabungan',
        balance: 10000000,
        type: 'SAVINGS',
        color: '#ffc107',
        createdAt: '2024-01-13',
      },
    ];

    setWallets(mockWallets);
    const total = mockWallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    setTotalBalance(total);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddWallet = () => {
    navigation.navigate('WalletForm', {});
  };

  const handleWalletDetail = (wallet: Wallet) => {
    navigation.navigate('WalletDetail', { wallet });
  };

  const renderWalletItem = ({ item }: { item: Wallet }) => (
    <WalletCard
      wallet={item}
      onDetailPress={() => handleWalletDetail(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header Area - PERSIS seperti screenshot */}
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>Wallet Saya</Text>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Saldo</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(totalBalance)}
          </Text>
        </View>
      </View>

      {/* Separator Line */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.scrollView}>
        {/* Wallet List */}
        <View style={styles.walletListContainer}>
          <FlatList
            data={wallets}
            renderItem={renderWalletItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Add Wallet Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddWallet}>
          <Ionicons name="add" size={24} color="#007bff" />
          <Text style={styles.addButtonText}>Tambah Wallet Baru</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Background putih seperti screenshot
  },
  headerArea: {
    backgroundColor: '#007bff', 
    paddingHorizontal: 20,
    paddingTop: 60, // Untuk status bar + padding
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'flex-start', // Seperti screenshot, rata kiri
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  separatorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  walletListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#007bff',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginLeft: 10,
  },
});

export default WalletListScreen;