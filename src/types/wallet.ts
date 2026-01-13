export interface Wallet {
  id: number;
  name: string;
  balance: number;
  type: 'CASH' | 'BANK' | 'E-WALLET' | 'SAVINGS';
  color: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WalletFormData {
  name: string;
  type: 'CASH' | 'BANK' | 'E-WALLET' | 'SAVINGS';
  initialBalance?: number;
  color?: string;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: Wallet | Wallet[];
}

export interface CreateWalletRequest {
  name: string;
  type: string;
  initialBalance?: number;
}

export interface UpdateWalletRequest {
  name?: string;
  type?: string;
}