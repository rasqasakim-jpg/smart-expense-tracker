import api from './api';
import { ActivityLog } from '../types/activity';

// Mock data untuk activity log
let mockActivities: ActivityLog[] = [
  // Today
  {
    id: 1,
    userId: 1,
    type: 'LOGIN',
    title: 'Login berhasil',
    description: 'Anda berhasil login ke aplikasi',
    ipAddress: '192.168.1.1',
    device: 'Android Mobile',
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    type: 'TRANSACTION_CREATE',
    title: 'Tambah transaksi: Belanja Bulanan',
    description: 'Transaksi belanja bulanan berhasil dibuat',
    metadata: {
      transactionId: 2,
      description: 'Belanja Bulanan',
      amount: 1200000,
      type: 'EXPENSE',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId: 1,
    type: 'WALLET_CREATE',
    title: 'Buat wallet: OVO',
    description: 'Wallet OVO berhasil dibuat',
    metadata: {
      walletId: 3,
      name: 'OVO',
      balance: 500000,
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    createdAt: new Date().toISOString(),
  },
  // Yesterday
  {
    id: 4,
    userId: 1,
    type: 'TRANSACTION_CREATE',
    title: 'Tambah transaksi: Gaji Bulanan',
    description: 'Transaksi gaji bulanan berhasil dibuat',
    metadata: {
      transactionId: 1,
      description: 'Gaji Bulanan',
      amount: 8000000,
      type: 'INCOME',
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    userId: 1,
    type: 'OTP_SENT',
    title: 'OTP dikirim ke email',
    description: 'Kode OTP telah dikirim ke email Anda',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    userId: 1,
    type: 'PROFILE_UPDATE',
    title: 'Update profile photo',
    description: 'Foto profil berhasil diperbarui',
    timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(),
  },
  // This Week
  {
    id: 7,
    userId: 1,
    type: 'CATEGORY_CREATE',
    title: 'Buat kategori: Transport',
    description: 'Kategori Transport berhasil dibuat',
    metadata: {
      categoryId: 4,
      name: 'Transport',
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    userId: 1,
    type: 'TRANSACTION_UPDATE',
    title: 'Update transaksi: Tagihan Listrik',
    description: 'Transaksi tagihan listrik berhasil diperbarui',
    metadata: {
      transactionId: 3,
      description: 'Tagihan Listrik',
      amount: 450000,
    },
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const activityAPI = {
  // Get all activities
  getAll: async (filters?: {
    search?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    await new Promise<void>(resolve => setTimeout(resolve, 800)); // Simulate delay
    
    let filtered = [...mockActivities];
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.type) {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return {
      success: true,
      message: 'Activities retrieved successfully',
      data: filtered,
    };
  },
  
  // Get activity by ID
  getById: async (id: number) => {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    const activity = mockActivities.find(a => a.id === id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    
    return {
      success: true,
      message: 'Activity retrieved successfully',
      data: activity,
    };
  },
  
  // Log new activity (for other services to call)
  logActivity: async (activity: Omit<ActivityLog, 'id' | 'createdAt'>) => {
    const newActivity: ActivityLog = {
      ...activity,
      id: mockActivities.length + 1,
      createdAt: new Date().toISOString(),
    };
    
    mockActivities.unshift(newActivity);
    
    return {
      success: true,
      message: 'Activity logged successfully',
      data: newActivity,
    };
  },
  
  // Clear activities (optional)
  clearAll: async () => {
    mockActivities = [];
    return {
      success: true,
      message: 'Activities cleared successfully',
      data: null,
    };
  },
};