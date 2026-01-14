export interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  category: string;
  categoryId: number;
  walletId: number;
  walletName: string;
  transactionDate: string;
  createdAt: string;
  notes?: string;
}

export interface TransactionFormData {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  categoryId: number;
  walletId: number;
  transactionDate: string;
  notes?: string;
}

export interface TransactionSection {
  title: string;
  data: Transaction[];
}

export type TransactionStackParamList = {
  TransactionList: undefined;
  TransactionDetail: { transactionId: number };
  TransactionForm: { transactionId?: number } | undefined 
};