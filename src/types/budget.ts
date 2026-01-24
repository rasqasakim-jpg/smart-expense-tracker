export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  amount: number; // Jumlah budget
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY'; // Periode budget
  month?: number; // Untuk monthly (1-12)
  year: number;
  currentSpent: number; // Jumlah yang sudah terpakai
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  categoryId: number;
  amount: number;
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  month?: number;
  year: number;
}

export interface BudgetStatus {
  percentage: number; // 0-100 atau lebih
  status: 'HEMAT' | 'NORMAL' | 'BOROS';
  remaining: number; // Sisa budget
  overspent: number; // Kelebihan (jika boros)
  color: string; // Warna berdasarkan status
}

export interface BudgetWithStatus extends Budget {
  status: BudgetStatus;
}

// Untuk navigation
export type BudgetStackParamList = {
  BudgetList: undefined;
  BudgetForm: { budget?: Budget };
  BudgetDetail: { budgetId: number };
};