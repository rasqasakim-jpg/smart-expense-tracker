export type ActivityType = 
  | 'LOGIN'
  | 'REGISTER'
  | 'TRANSACTION_CREATE'
  | 'TRANSACTION_UPDATE'
  | 'TRANSACTION_DELETE'
  | 'WALLET_CREATE'
  | 'WALLET_UPDATE'
  | 'WALLET_DELETE'
  | 'CATEGORY_CREATE'
  | 'CATEGORY_UPDATE'
  | 'CATEGORY_DELETE'
  | 'PROFILE_UPDATE'
  | 'OTP_SENT'
  | 'PASSWORD_RESET'
  | 'SYSTEM';

export interface ActivityLog {
  id: number;
  userId: number;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: Record<string, any>; // Data tambahan
  ipAddress?: string;
  device?: string;
  timestamp: string; // ISO string
  createdAt: string;
}

export interface ActivitySection {
  title: string;
  data: ActivityLog[];
}