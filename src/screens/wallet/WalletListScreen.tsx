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
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/designSysttem';

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
    backgroundColor: colors.white,
  },
  headerArea: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-start',
    ...shadows.lg,
  },
  balanceLabel: {
    fontSize: typography.h6,
    color: colors.textLight,
    marginBottom: spacing.sm,
    fontWeight: typography.medium,
  },
  balanceAmount: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.textLight,
    letterSpacing: 0.5,
  },
  separatorContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  walletListContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: typography.h6,
    fontWeight: typography.semiBold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});

export default WalletListScreen;