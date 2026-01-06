import axios from 'axios';

const BASE_URL = 'https://api.smart-expense.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = ''; // Nanti ambil dari async storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized, redirect to login');
    }
    return Promise.reject(error.response?.data);
  }
);

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post('/auth/register', data),
};

export default api;