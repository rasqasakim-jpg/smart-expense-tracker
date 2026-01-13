export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string;
  color: string;
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  color?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}