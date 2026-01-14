import api from './api';
import { Transaction, TransactionFormData } from '../types/transaction';

// Mock data sesuai wireframe
let mockTransactions: Transaction[] = [
  // Hari Ini
  {
    id: 1,
    amount: 8000000,
    type: 'INCOME',
    description: 'Gaji Bulanan',
    category: 'Pendapatan',
    categoryId: 1,
    walletId: 2,
    walletName: 'Bank BCA',
    transactionDate: '2026-01-05',
    createdAt: '2026-01-05T08:00:00',
  },
  {
    id: 2,
    amount: 1200000,
    type: 'EXPENSE',
    description: 'Belanja Bulanan',
    category: 'Belanja',
    categoryId: 2,
    walletId: 1,
    walletName: 'Kas',
    transactionDate: '2026-01-04',
    createdAt: '2026-01-04T14:30:00',
  },
  // Minggu Ini
  {
    id: 3,
    amount: 450000,
    type: 'EXPENSE',
    description: 'Tagihan Listrik',
    category: 'Tagihan',
    categoryId: 3,
    walletId: 2,
    walletName: 'Bank BCA',
    transactionDate: '2026-01-03',
    createdAt: '2026-01-03T10:15:00',
  },
  {
    id: 4,
    amount: 250000,
    type: 'EXPENSE',
    description: 'Transportasi',
    category: 'Transport',
    categoryId: 4,
    walletId: 1,
    walletName: 'Kas',
    transactionDate: '2026-01-02',
    createdAt: '2026-01-02T18:45:00',
  },
  {
    id: 5,
    amount: 2500000,
    type: 'INCOME',
    description: 'Freelance Project',
    category: 'Pendapatan',
    categoryId: 1,
    walletId: 3,
    walletName: 'OVO',
    transactionDate: '2026-01-01',
    createdAt: '2026-01-01T12:00:00',
  },
  {
    id: 6,
    amount: 350000,
    type: 'EXPENSE',
    description: 'Makan & Minum',
    category: 'Makanan',
    categoryId: 5,
    walletId: 1,
    walletName: 'Kas',
    transactionDate: '2026-01-01',
    createdAt: '2026-01-01T19:30:00',
  },
  // Bulan Lalu
  {
    id: 7,
    amount: 350000,
    type: 'EXPENSE',
    description: 'Tagihan Internet',
    category: 'Tagihan',
    categoryId: 3,
    walletId: 2,
    walletName: 'Bank BCA',
    transactionDate: '2025-12-28',
    createdAt: '2025-12-28T09:20:00',
  },
];

export const transactionAPI = {
  // Get semua transactions dengan filter
  // Di getAll function, tambahkan filter by type:
getAll: async (filters?: {
  search?: string;
  categoryId?: number;
  walletId?: number;
  startDate?: string;
  type?: 'INCOME' | 'EXPENSE' | 'ALL';
}) => {
   await new Promise(resolve => setTimeout(() => resolve(true), 500));
  
  let filtered = [...mockTransactions];
  
  // Filter by search
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(t => 
      t.description.toLowerCase().includes(searchLower) ||
      t.category.toLowerCase().includes(searchLower)
    );
  }
  
  // ✅ FIX: Filter by category
  if (filters?.categoryId) {
    filtered = filtered.filter(t => t.categoryId === filters.categoryId);
  }
  
  // ✅ FIX: Filter by wallet
  if (filters?.walletId) {
    filtered = filtered.filter(t => t.walletId === filters.walletId);
  }
  
  // ✅ FIX: Filter by type
  if (filters?.type && filters.type !== 'ALL') {
    filtered = filtered.filter(t => t.type === filters.type);
  }
  
  // ✅ FIX: Filter by date range
  if (filters?.startDate) {
    const today = new Date();
    let startDate = new Date();
    
    switch (filters.startDate) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      default:
        // 'all' - no date filter
        break;
    }
    
    if (filters.startDate !== 'all') {
      filtered = filtered.filter(t => {
        const transDate = new Date(t.transactionDate);
        return transDate >= startDate;
      });
    }
  }
  
  return {
    success: true,
    message: 'Transactions retrieved successfully',
    data: filtered,
  };
},
  
  // Get by ID
  getById: async (id: number) => {
    await new Promise(resolve => setTimeout(() => resolve(true), 300));
    
    const transaction = mockTransactions.find(t => t.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return {
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    };
  },
  
  // Create transaction baru
  create: async (data: TransactionFormData) => {
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
    
    const newTransaction: Transaction = {
      id: mockTransactions.length + 1,
      ...data,
      category: 'Unknown', // Nanti diisi dari categoryId
      walletName: 'Unknown', // Nanti diisi dari walletId
      createdAt: new Date().toISOString(),
    };
    
    mockTransactions.unshift(newTransaction);
    
    return {
      success: true,
      message: 'Transaction created successfully',
      data: newTransaction,
    };
  },
  
  // Update transaction
  update: async (id: number, data: Partial<TransactionFormData>) => {
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
    
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    
    mockTransactions[index] = {
      ...mockTransactions[index],
      ...data,
    };
    
    return {
      success: true,
      message: 'Transaction updated successfully',
      data: mockTransactions[index],
    };
  },
  
  // Delete transaction
  delete: async (id: number) => {
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
    
    const initialLength = mockTransactions.length;
    mockTransactions = mockTransactions.filter(t => t.id !== id);
    
    if (mockTransactions.length === initialLength) {
      throw new Error('Transaction not found');
    }
    
    return {
      success: true,
      message: 'Transaction deleted successfully',
      data: null,
    };
  },
};