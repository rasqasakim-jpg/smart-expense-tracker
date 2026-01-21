import { Transaction } from '../types/transaction';

// Helper untuk format currency (tanpa Rp)
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}Jt`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
};

// Hitung total pengeluaran per bulan
export const getMonthlyExpenses = (
  transactions: Transaction[],
  year: number = new Date().getFullYear()
): { labels: string[]; data: number[] } => {
  const monthlyTotals: number[] = new Array(12).fill(0);
  
  transactions.forEach(transaction => {
    if (transaction.type === 'EXPENSE') {
      const date = new Date(transaction.transactionDate);
      if (date.getFullYear() === year) {
        const month = date.getMonth(); // 0-11
        monthlyTotals[month] += transaction.amount;
      }
    }
  });
  
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  
  return {
    labels,
    data: monthlyTotals,
  };
};

// Hitung pengeluaran per kategori
export const getExpensesByCategory = (
  transactions: Transaction[]
): { labels: string[]; data: number[]; colors: string[] } => {
  const categoryMap: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'EXPENSE') {
      const category = transaction.category;
      categoryMap[category] = (categoryMap[category] || 0) + transaction.amount;
    }
  });
  
  const labels = Object.keys(categoryMap);
  const data = Object.values(categoryMap);
  
  // Warna untuk setiap kategori
  const categoryColors: Record<string, string> = {
    'Belanja': '#FF6B6B',
    'Tagihan': '#4ECDC4',
    'Transport': '#FFD166',
    'Makanan': '#06D6A0',
    'Hiburan': '#118AB2',
    'Kesehatan': '#EF476F',
    'Pendidikan': '#073B4C',
    'Lainnya': '#6C757D',
  };
  
  const colors = labels.map(label => categoryColors[label] || '#6C757D');
  
  return { labels, data, colors };
};

// Hitung perbandingan pemasukan vs pengeluaran
export const getIncomeExpenseComparison = (
  transactions: Transaction[],
  months: number = 6 // 6 bulan terakhir
): { labels: string[]; incomeData: number[]; expenseData: number[] } => {
  const today = new Date();
  const result = {
    labels: [] as string[],
    incomeData: [] as number[],
    expenseData: [] as number[],
  };
  
  // Generate label untuk N bulan terakhir
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(today.getMonth() - i);
    
    const month = date.getMonth();
    const year = date.getFullYear();
    const label = `${monthNames[month]} ${year.toString().slice(2)}`;
    
    result.labels.push(label);
    
    // Hitung untuk bulan ini
    let income = 0;
    let expense = 0;
    
    transactions.forEach(transaction => {
      const transDate = new Date(transaction.transactionDate);
      if (
        transDate.getMonth() === month &&
        transDate.getFullYear() === year
      ) {
        if (transaction.type === 'INCOME') {
          income += transaction.amount;
        } else {
          expense += transaction.amount;
        }
      }
    });
    
    result.incomeData.push(income);
    result.expenseData.push(expense);
  }
  
  return result;
};

// Hitung total untuk dashboard
export const getDashboardTotals = (transactions: Transaction[]) => {
  let totalIncome = 0;
  let totalExpense = 0;
  
  transactions.forEach(transaction => {
    if (transaction.type === 'INCOME') {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });
  
  const totalBalance = totalIncome - totalExpense;
  
  return {
    totalBalance,
    totalIncome,
    totalExpense,
  };
};