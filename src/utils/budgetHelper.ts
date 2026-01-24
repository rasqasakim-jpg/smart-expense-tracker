import { Budget, BudgetStatus } from '../types/budget';
import { Transaction } from '../types/transaction';

// Hitung status budget berdasarkan pengeluaran
export const calculateBudgetStatus = (
  budgetAmount: number,
  currentSpent: number
): BudgetStatus => {
  const percentage = (currentSpent / budgetAmount) * 100;
  
  let status: 'HEMAT' | 'NORMAL' | 'BOROS';
  let color: string;
  
  if (percentage < 70) {
    status = 'HEMAT';
    color = '#28a745'; // Green
  } else if (percentage <= 100) {
    status = 'NORMAL';
    color = '#ffc107'; // Yellow
  } else {
    status = 'BOROS';
    color = '#dc3545'; // Red
  }
  
  const remaining = Math.max(0, budgetAmount - currentSpent);
  const overspent = Math.max(0, currentSpent - budgetAmount);
  
  return {
    percentage: Math.min(percentage, 100), // Maks 100% untuk progress bar
    status,
    remaining,
    overspent,
    color,
  };
};

// Hitung total pengeluaran per kategori dari transaksi
export const calculateCategorySpending = (
  transactions: Transaction[],
  categoryId: number,
  month?: number,
  year?: number
): number => {
  return transactions
    .filter(transaction => {
      // Filter by category
      if (transaction.categoryId !== categoryId) return false;
      
      // Filter by type (hitung pengeluaran saja)
      if (transaction.type !== 'EXPENSE') return false;
      
      // Filter by month & year jika ada
      if (month !== undefined || year !== undefined) {
        const transDate = new Date(transaction.transactionDate);
        if (year !== undefined && transDate.getFullYear() !== year) return false;
        if (month !== undefined && (transDate.getMonth() + 1) !== month) return false;
      }
      
      return true;
    })
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Format currency tanpa Rp (untuk display)
export const formatBudgetCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} JT`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)} K`;
  }
  return amount.toString();
};

// Format period untuk display
export const formatBudgetPeriod = (period: string, month?: number): string => {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  switch (period) {
    case 'MONTHLY':
      return month !== undefined 
        ? `Bulan ${monthNames[month - 1]}`
        : 'Bulanan';
    case 'WEEKLY':
      return 'Mingguan';
    case 'YEARLY':
      return 'Tahunan';
    default:
      return period;
  }
};

// Get status icon
export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'HEMAT':
      return 'trending-down';
    case 'NORMAL':
      return 'trending-flat';
    case 'BOROS':
      return 'trending-up';
    default:
      return 'pie-chart';
  }
};

// Get status description
export const getStatusDescription = (status: string): string => {
  switch (status) {
    case 'HEMAT':
      return 'Pengeluaran masih aman';
    case 'NORMAL':
      return 'Pengeluaran mendekati batas';
    case 'BOROS':
      return 'Pengeluaran melebihi budget';
    default:
      return '';
  }
};

// Validate budget form
export const validateBudgetForm = (data: {
  categoryId: number;
  amount: number;
  period: string;
  year: number;
}): string[] => {
  const errors: string[] = [];
  
  if (!data.categoryId) {
    errors.push('Pilih kategori');
  }
  
  if (!data.amount || data.amount <= 0) {
    errors.push('Jumlah budget harus lebih dari 0');
  }
  
  if (!data.period) {
    errors.push('Pilih periode budget');
  }
  
  if (!data.year) {
    errors.push('Tahun harus diisi');
  }
  
  return errors;
};