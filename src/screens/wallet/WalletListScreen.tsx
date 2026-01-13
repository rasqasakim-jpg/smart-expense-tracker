import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWallets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadWallets();
    }, [])
  );

  const loadWallets = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      console.log('[wallet] loadWallets start');
      const res = await (await import('../../services/api')).walletAPI.getAll();
      const data = res?.data || res || [];
      const arr = Array.isArray(data) ? data : [data];
      setWallets(arr);
      const total = arr.reduce((sum: number, w: any) => sum + Number(w.balance || 0), 0);
      setTotalBalance(total);
      const elapsed = Date.now() - start;
      console.log(`[wallet] loadWallets success elapsed=${elapsed}ms count=${arr.length}`);
    } catch (err) {
      const elapsed = Date.now() - start;
      console.log(`[wallet] loadWallets error elapsed=${elapsed}ms`, err);

      // Try pinging wallet ping endpoint (no auth) to detect connectivity vs auth issues
      try {
        const ping = await (await import('../../services/api')).walletAPI.ping();
        console.log('[wallet] ping response', ping);
      } catch (pingErr) {
        console.log('[wallet] ping failed', pingErr);
      }

    } finally {
      setLoading(false);
    }
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
          {loading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <FlatList
              data={wallets}
              renderItem={renderWalletItem}
              keyExtractor={(item) => String(item.id)}
              scrollEnabled={false}
            />
          )}
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
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'flex-start', // Seperti screenshot, rata kiri
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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