import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.smart-expense.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from AsyncStorage for every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Failed to read token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Return response.data directly, map errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized, token may be invalid');
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post('/auth/register', data),
};

export default api;