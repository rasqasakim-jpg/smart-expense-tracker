import React, { createContext, useState, useContext, useEffect } from 'react';
import { Category } from '../../types/category';

interface CategoryContextProps {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  loading: boolean;
  refreshCategories: () => Promise<void>;
  getCategoryById: (id: number) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data untuk development
  const mockCategories: Category[] = [
    { id: 1, name: 'Makanan & Minuman', type: 'EXPENSE', icon: 'fast-food-outline', color: '#dc3545', createdAt: '2024-01-13' },
    { id: 2, name: 'Transportasi', type: 'EXPENSE', icon: 'airplane-outline', color: '#fd7e14', createdAt: '2024-01-13' },
    { id: 3, name: 'Belanja', type: 'EXPENSE', icon: 'bag-handle-outline', color: '#6f42c1', createdAt: '2024-01-13' },
    { id: 4, name: 'Hiburan', type: 'EXPENSE', icon: 'videocam-outline', color: '#20c997', createdAt: '2024-01-13' },
    { id: 5, name: 'Tagihan', type: 'EXPENSE', icon: 'receipt-outline', color: '#6f42c1', createdAt: '2024-01-13' },
    { id: 6, name: 'Kesehatan', type: 'EXPENSE', icon: 'bandage-outline', color: '#e83e8c', createdAt: '2024-01-13' },
    { id: 7, name: 'Pendidikan', type: 'EXPENSE', icon: 'school-outline', color: '#17a2b8', createdAt: '2024-01-13' },
    { id: 8, name: 'Gaji', type: 'INCOME', icon: 'code-working-outline', color: '#28a745', createdAt: '2024-01-13' },
    { id: 9, name: 'Bonus', type: 'INCOME', icon: 'gift-outline', color: '#ffc107', createdAt: '2024-01-13' },
    { id: 10, name: 'Investasi', type: 'INCOME', icon: 'trending-up-outline', color: '#007bff', createdAt: '2024-01-13' },
    { id: 11, name: 'Freelance', type: 'INCOME', icon: 'desktop-outline', color: '#6f42c1', createdAt: '2024-01-13' },
    { id: 12, name: 'Lainnya', type: 'INCOME', icon: 'ellipsis-horizontal-outline', color: '#6c757d', createdAt: '2024-01-13' },
  ];

  const incomeCategories = categories.filter(cat => cat.type === 'INCOME');
  const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');

  const refreshCategories = async () => {
    setLoading(true);
    try {
      // TODO: Replace with API call
      // const response = await categoryAPI.getAll();
      // setCategories(response.data);
      
      // Using mock data for now
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = (id: number) => {
    return categories.find(category => category.id === id);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{
      categories,
      incomeCategories,
      expenseCategories,
      loading,
      refreshCategories,
      getCategoryById,
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider');
  }
  return context;
};