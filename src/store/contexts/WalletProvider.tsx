import React, { createContext, useState, useContext, useEffect } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Wallet } from '../../types/wallet';

interface WalletContextProps {
  wallets: Wallet[];
  loading: boolean;
  refreshWallets: () => Promise<void>;
  getWalletById: (id: number) => Wallet | undefined;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data untuk development dengan icon Ionicons
  const mockWallets: Wallet[] = [
    { 
      id: 1, 
      name: 'Dompet Utama', 
      balance: 2000000, 
      type: 'CASH', 
      color: '#007bff', 
      createdAt: '2024-01-13',
      icon: 'wallet-outline' // Ionicons: wallet-outline
    },
    { 
      id: 2, 
      name: 'Bank BCA', 
      balance: 15000000, 
      type: 'BANK', 
      color: '#28a745', 
      createdAt: '2024-01-13',
      icon: 'business-outline' // Ionicons: business-outline
    },
    { 
      id: 3, 
      name: 'OVO', 
      balance: 500000, 
      type: 'E-WALLET', 
      color: '#6f42c1', 
      createdAt: '2024-01-13',
      icon: 'phone-portrait-outline' // Ionicons: phone-portrait-outline
    },
    { 
      id: 4, 
      name: 'GoPay', 
      balance: 300000, 
      type: 'E-WALLET', 
      color: '#00a859', 
      createdAt: '2024-01-13',
      icon: 'logo-google' // Ionicons: logo-google (karena GoPay milik Google)
    },
    { 
      id: 5, 
      name: 'Tabungan', 
      balance: 10000000, 
      type: 'SAVINGS', 
      color: '#ffc107', 
      createdAt: '2024-01-13',
      icon: 'cash-outline' // Ionicons: cash-outline
    },
    { 
      id: 6, 
      name: 'Dana', 
      balance: 750000, 
      type: 'E-WALLET', 
      color: '#118eea', 
      createdAt: '2024-01-13',
      icon: 'card-outline' // Ionicons: card-outline
    },
    { 
      id: 7, 
      name: 'LinkAja', 
      balance: 200000, 
      type: 'E-WALLET', 
      color: '#f15a29', 
      createdAt: '2024-01-13',
      icon: 'flash-outline' // Ionicons: flash-outline
    },
    { 
      id: 8, 
      name: 'Mandiri', 
      balance: 8000000, 
      type: 'BANK', 
      color: '#0033a0', 
      createdAt: '2024-01-13',
      icon: 'journal-outline' // Ionicons: bank-outline (custom, bisa pakai business-outline)
    },
  ];

  const refreshWallets = async () => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      // const response = await walletAPI.getAll();
      // setWallets(response.data);
      
      // Using mock data for now
      setWallets(mockWallets);
    } catch (error) {
      console.error('Error loading wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWalletById = (id: number) => {
    return wallets.find(wallet => wallet.id === id);
  };

  useEffect(() => {
    refreshWallets();
  }, []);

  return (
    <WalletContext.Provider value={{
      wallets,
      loading,
      refreshWallets,
      getWalletById,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallets = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallets must be used within WalletProvider');
  }
  return context;
};