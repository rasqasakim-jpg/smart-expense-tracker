import api from './api';

export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  user_id?: string;
}

export interface Wallet {
  id: string; // UUID
  name: string;
  balance: number;
  user_id: string;
}

export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get categories by type
  getByType: async (type: 'INCOME' | 'EXPENSE') => {
    try {
      const response = await api.get(`/categories?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      throw error;
    }
  },
};

export const walletAPI = {
  // Get all wallets
  getAll: async () => {
    try {
      const response = await api.get('/wallets');
      return response.data;
    } catch (error) {
      console.error('Error fetching wallets:', error);
      throw error;
    }
  },
};