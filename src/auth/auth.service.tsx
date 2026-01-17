// src/auth/auth.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginPayload, RegisterPayload, User, AuthTokens } from "./auth.types.tsx";
import { authAPI } from '../services/api';

const STORAGE_KEY = 'token';

export const AuthService = {
  async login(payload: LoginPayload): Promise<{ user: User; tokens: AuthTokens }> {
    // call backend
    const res: any = await authAPI.login(payload); // res = { success, message, data }

    if (!res || !res.success) {
      const msg = res?.message || 'Login failed';
      const err: any = new Error(msg);
      throw err;
    }

    const user = {
      id: res.data.user.id,
      fullName: res.data.user.fullName,
      email: res.data.user.email,
    } as User;

    const tokens = {
      accessToken: res.data.accessToken,
    } as AuthTokens;

    return { user, tokens };
  },

  async register(payload: RegisterPayload): Promise<boolean> {
    const res: any = await authAPI.register(payload); // res = { success, message, data }
    if (!res || !res.success) {
      const err: any = new Error(res?.message || 'Register failed');
      throw err;
    }
    return true;
  },

  async logout(): Promise<void> {
    // backend does not provide logout; just clear local tokens
    await this.clearTokens();
  },

  async saveTokens(tokens: AuthTokens) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } catch (e) {
      console.warn('Failed to save tokens', e);
    }
  },

  async getStoredTokens(): Promise<AuthTokens | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthTokens;
    } catch (e) {
      console.warn('Failed to read tokens', e);
      return null;
    }
  },

  async clearTokens() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear tokens', e);
    }
  },
};