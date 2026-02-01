import React, { useState, useEffect, useRef } from 'react'; // ← TAMBAH useRef
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated, // ← TAMBAH Animated
  Easing, // ← TAMBAH Easing
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons'; // ← FIX import
import { Wallet } from '../../types/wallet';
import WalletCard from '../../components/wallet/WalletCard';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/designSystem';
import SuccessToast from '../../components/common/SuccesToast'; // ← TAMBAH
import LoadingOverlay from '../../components/common/LoadingOverlay'; // ← TAMBAH

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
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Animation refs
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const balanceScaleAnim = useRef(new Animated.Value(0.5)).current;
  const separatorWidthAnim = useRef(new Animated.Value(0)).current;
  const cardOpacityAnims = useRef<Animated.Value[]>([]).current;
  const cardTranslateAnims = useRef<Animated.Value[]>([]).current;
  const addButtonScaleAnim = useRef(new Animated.Value(1)).current;

  // Initialize animation values untuk setiap wallet card
  wallets.forEach((_, index) => {
    if (!cardOpacityAnims[index]) {
      cardOpacityAnims[index] = new Animated.Value(0);
      cardTranslateAnims[index] = new Animated.Value(50);
    }
  });

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    if (!loading && wallets.length > 0) {
      startAnimations();
    }
  }, [loading, wallets]);

  const loadWallets = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
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
      setLoading(false);
    }, 800);
  };

  const startAnimations = () => {
    // 1. Header slide down
    Animated.spring(headerSlideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // 2. Balance scale up dengan bounce
    Animated.sequence([
      Animated.timing(balanceScaleAnim, {
        toValue: 1.2,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(balanceScaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Separator line expand
    Animated.timing(separatorWidthAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // 4. Staggered card animations
    const cardAnimations = wallets.map((_, index) =>
      Animated.parallel([
        Animated.timing(cardOpacityAnims[index], {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateAnims[index], {
          toValue: 0,
          friction: 8,
          tension: 40,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(100, cardAnimations).start();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddWallet = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(addButtonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(addButtonScaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate setelah animation
    setTimeout(() => {
      navigation.navigate('WalletForm', {});
    }, 150);
  };

  const handleWalletDetail = (wallet: Wallet) => {
    // Card press animation
    const index = wallets.findIndex(w => w.id === wallet.id);
    if (index >= 0 && cardTranslateAnims[index]) {
      Animated.sequence([
        Animated.timing(cardTranslateAnims[index], {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateAnims[index], {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Navigate
    navigation.navigate('WalletDetail', { wallet });
  };

  const handleRefresh = () => {
    // Pull to refresh animation
    Animated.sequence([
      Animated.timing(headerSlideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setSuccessMessage('Data wallet diperbarui');
    setShowSuccess(true);
    loadWallets();
    
    // Auto hide success message
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const renderWalletItem = ({ item, index }: { item: Wallet; index: number }) => {
    // Initialize animation values jika belum ada
    if (!cardOpacityAnims[index]) {
      cardOpacityAnims[index] = new Animated.Value(0);
      cardTranslateAnims[index] = new Animated.Value(50);
    }

    return (
      <Animated.View
        style={{
          opacity: cardOpacityAnims[index],
          transform: [{ translateY: cardTranslateAnims[index] }],
        }}
      >
        <WalletCard
          wallet={item}
          onDetailPress={() => handleWalletDetail(item)}
        />
      </Animated.View>
    );
  };

  if (loading) {
    return <LoadingOverlay visible={loading} message="Memuat wallet..." />;
  }

  return (
    <View style={styles.container}>
      {/* Success Toast */}
      <SuccessToast
        message={successMessage}
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
      />
      
      {/* Header Area dengan animation */}
      <Animated.View 
        style={[
          styles.headerArea,
          { transform: [{ translateY: headerSlideAnim }] }
        ]}
      >
        <Text style={styles.headerTitle}>Wallet Saya</Text>
        
        <Animated.View 
          style={[
            styles.balanceContainer,
            { transform: [{ scale: balanceScaleAnim }] }
          ]}
        >
          <Text style={styles.balanceLabel}>Total Saldo</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(totalBalance)}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Separator Line dengan animation */}
      <View style={styles.separatorContainer}>
        <Animated.View 
          style={[
            styles.separatorLine,
            {
              transform: [{
                scaleX: separatorWidthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }]
            }
          ]}
        />
      </View>

      {/* Scrollable content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={handleRefresh}
      >
        {/* Wallet List */}
        <View style={styles.walletListContainer}>
          <FlatList
            data={wallets}
            renderItem={renderWalletItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Add Wallet Button dengan animation */}
        <Animated.View
          style={{
            transform: [{ scale: addButtonScaleAnim }],
          }}
        >
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddWallet}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.addButtonText}>Tambah Wallet Baru</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Empty space untuk scroll */}
        <View style={{ height: 30 }} />
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
    transformOrigin: 'left center',
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