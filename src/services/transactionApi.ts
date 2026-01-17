import api from './api';
import {TransactionFormData } from '../types/transaction';

// Real API implementation
export const transactionAPI = {
  // Get all transactions with filters
  getAll: async (filters?: {
    search?: string;
    categoryId?: number;
    walletId?: number;
    startDate?: string;
    type?: 'INCOME' | 'EXPENSE' | 'ALL';
    page?: number;
    limit?: number;
  }) => {
    try {
      const params: any = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.type && filters.type !== 'ALL') params.type = filters.type;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      // Note: Backend uses different field names, but we'll adapt in the service layer
      const response = await api.get('/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get transaction by ID
  getById: async (id: string) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // Create new transaction
  create: async (data: TransactionFormData) => {
    try {
      // Transform frontend data to match backend expectations
      const payload = {
        wallet_id: data.walletId.toString(), // Backend expects string UUID, but we're using numbers for now
        category_id: data.categoryId,
        name: data.name,
        amount: data.amount,
        type: data.type,
        transaction_date: new Date(data.transactionDate).toISOString(),
        note: data.note || undefined,
      };

      const response = await api.post('/transactions', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update transaction
  update: async (id: string, data: Partial<TransactionFormData>) => {
    try {
      // Transform frontend data to match backend expectations
      const payload: any = {};

      if (data.name) payload.name = data.name;
      if (data.amount !== undefined) payload.amount = data.amount;
      if (data.type) payload.type = data.type;
      if (data.transactionDate) payload.transaction_date = new Date(data.transactionDate).toISOString();
      if (data.note !== undefined) payload.note = data.note;
      if (data.categoryId) payload.category_id = data.categoryId;
      if (data.walletId) payload.wallet_id = data.walletId.toString();

      const response = await api.put(`/transactions/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete transaction
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
};