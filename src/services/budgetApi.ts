import api from './api';
import { Budget, BudgetFormData } from '../types/budget';
import { calculateBudgetStatus } from '../utils/budgetHelper';

// Mock data untuk budget
let mockBudgets: Budget[] = [
  {
    id: 1,
    userId: 1,
    categoryId: 5, // Makanan
    categoryName: 'Makanan',
    amount: 1000000,
    period: 'MONTHLY',
    month: 1, // Januari
    year: 2026,
    currentSpent: 450000,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-13T10:00:00',
  },
  {
    id: 2,
    userId: 1,
    categoryId: 4, // Transport
    categoryName: 'Transport',
    amount: 500000,
    period: 'MONTHLY',
    month: 1,
    year: 2026,
    currentSpent: 400000,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-13T10:00:00',
  },
  {
    id: 3,
    userId: 1,
    categoryId: 2, // Belanja
    categoryName: 'Belanja',
    amount: 1000000,
    period: 'MONTHLY',
    month: 1,
    year: 2026,
    currentSpent: 1200000,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-13T10:00:00',
  },
  {
    id: 4,
    userId: 1,
    categoryId: 3, // Tagihan
    categoryName: 'Tagihan',
    amount: 800000,
    period: 'MONTHLY',
    month: 1,
    year: 2026,
    currentSpent: 350000,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-13T10:00:00',
  },
];

export const budgetAPI = {
  // Get semua budget dengan status
  getAll: async (filters?: {
    month?: number;
    year?: number;
    period?: string;
  }) => {
    await new Promise<void>(resolve => setTimeout(resolve, 800));
    
    let filtered = [...mockBudgets];
    
    if (filters?.month !== undefined) {
      filtered = filtered.filter(budget => budget.month === filters.month);
    }
    
    if (filters?.year !== undefined) {
      filtered = filtered.filter(budget => budget.year === filters.year);
    }
    
    if (filters?.period) {
      filtered = filtered.filter(budget => budget.period === filters.period);
    }
    
    // Hitung status untuk setiap budget
    const budgetsWithStatus = filtered.map(budget => ({
      ...budget,
      status: calculateBudgetStatus(budget.amount, budget.currentSpent),
    }));
    
    return {
      success: true,
      message: 'Budgets retrieved successfully',
      data: budgetsWithStatus,
    };
  },
  
  // Get budget by ID
  getById: async (id: number) => {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    const budget = mockBudgets.find(b => b.id === id);
    if (!budget) {
      throw new Error('Budget not found');
    }
    
    const budgetWithStatus = {
      ...budget,
      status: calculateBudgetStatus(budget.amount, budget.currentSpent),
    };
    
    return {
      success: true,
      message: 'Budget retrieved successfully',
      data: budgetWithStatus,
    };
  },
  
  // Create budget baru
  create: async (data: BudgetFormData) => {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    // Cek apakah sudah ada budget untuk kategori & periode yang sama
    const existingBudget = mockBudgets.find(budget => 
      budget.categoryId === data.categoryId &&
      budget.period === data.period &&
      budget.month === data.month &&
      budget.year === data.year
    );
    
    if (existingBudget) {
      throw {
        success: false,
        message: 'Budget sudah ada untuk kategori dan periode ini',
        errors: {
          categoryId: ['Budget sudah ada'],
        },
      };
    }
    
    const newBudget: Budget = {
      id: mockBudgets.length + 1,
      userId: 1,
      categoryId: data.categoryId,
      categoryName: 'Kategori Baru', // Nanti diisi dari category service
      amount: data.amount,
      period: data.period,
      month: data.month,
      year: data.year,
      currentSpent: 0, // Default 0
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockBudgets.push(newBudget);
    
    return {
      success: true,
      message: 'Budget created successfully',
      data: newBudget,
    };
  },
  
  // Update budget
  update: async (id: number, data: Partial<BudgetFormData>) => {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    const index = mockBudgets.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Budget not found');
    }
    
    mockBudgets[index] = {
      ...mockBudgets[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      message: 'Budget updated successfully',
      data: mockBudgets[index],
    };
  },
  
  // Delete budget
  delete: async (id: number) => {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    const initialLength = mockBudgets.length;
    mockBudgets = mockBudgets.filter(b => b.id !== id);
    
    if (mockBudgets.length === initialLength) {
      throw new Error('Budget not found');
    }
    
    return {
      success: true,
      message: 'Budget deleted successfully',
      data: null,
    };
  },
  
  // Update current spent (dipanggil ketika ada transaksi baru)
  updateSpent: async (categoryId: number, amount: number, isExpense: boolean) => {
    // Find budgets for this category
    const budgets = mockBudgets.filter(b => b.categoryId === categoryId);
    
    // Update current spent for each budget
    budgets.forEach(budget => {
      if (isExpense) {
        budget.currentSpent += amount;
      } else {
        // If income, subtract? Usually budgets only track expenses
        // For simplicity, we only add expenses
      }
      budget.updatedAt = new Date().toISOString();
    });
    
    return {
      success: true,
      message: 'Budget spent updated',
      data: budgets,
    };
  },
};