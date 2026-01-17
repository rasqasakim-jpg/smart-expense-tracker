export interface Transaction {
  id: string; // UUID from backend
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  name: string; // Backend uses 'name' instead of 'description'
  category: string;
  categoryId: number;
  walletId: string; // UUID from backend
  walletName: string;
  transactionDate: string;
  createdAt: string;
  note?: string; // Backend uses 'note' instead of 'notes'
  updatedAt?: string;
}

export interface TransactionFormData {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  name: string; // Changed from description to name
  categoryId: number;
  walletId: string; // Changed to string UUID
  transactionDate: string;
  note?: string; // Changed from notes to note
}

export interface TransactionSection {
  title: string;
  data: Transaction[];
}

export type TransactionStackParamList = {
  TransactionList: undefined;
  TransactionDetail: { transactionId: string };
  TransactionForm: { transactionId?: string } | undefined 
};