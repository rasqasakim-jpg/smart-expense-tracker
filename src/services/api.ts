import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

// Determine a dev server host that works across environments:
// - If Metro packager is running, parse its host from SourceCode.scriptURL (works for emulators and real devices connected to Metro)
// - Fallbacks: Android emulator default (10.0.2.2), Genymotion (10.0.3.2), iOS simulator / desktop use localhost
const getDevApiBase = (): string => {
  try {
    const scriptURL = (NativeModules?.SourceCode?.scriptURL as string) || '';
    if (scriptURL) {
      const matched = scriptURL.match(/https?:\/\/([^/]+)/);
      if (matched && matched[1]) {
        // `host:port` or `hostname` (e.g., 10.0.2.2:8081 or 192.168.1.10:8081)
        const hostPort = matched[1];
        const host = hostPort.split(':')[0];
        return `http://${host}:5000/api`;
      }
    }
  } catch (_) {
    // ignore and fallback
  }

  // Fallback to device ipv4 (works with adb reverse on physical devices)
  return 'http://172.10.2.241:5000/api';
};

// We'll resolve a reachable dev host at request time for physical devices/emulators
const DEFAULT_DEV_BASE = getDevApiBase();

// Cache the resolved base (e.g., 'http://192.168.1.10:5000/api')
let resolvedDevBase: string | null = null;

const candidateHosts = async (): Promise<string[]> => {
  const hosts = new Set<string>();
  // host from metro script if available
  try {
    const scriptURL = (NativeModules?.SourceCode?.scriptURL as string) || '';
    const matched = scriptURL.match(/https?:\/\/([^/]+)/);
    if (matched && matched[1]) {
      hosts.add(matched[1].split(':')[0]);
    }
  } catch (_) {}

  hosts.add('10.0.2.2'); // Android emulator
  hosts.add('10.0.3.2'); // Genymotion
  hosts.add('localhost'); // iOS simulator / desktop
  hosts.add('127.0.0.1'); // localhost IP

  // Optionally try to get device network IP using a lightweight RN lib if installed.
  // We import dynamically so the app won't crash if the package isn't present.
  try {
    // react-native-network-info exports NetworkInfo.getIPV4Address()
    // and is useful on devices to discover the device IP address.
    // If it's not installed, this block simply no-ops.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const NetworkInfo = await import('react-native-network-info').then(m => m.NetworkInfo || m);
    if (NetworkInfo && typeof NetworkInfo.getIPV4Address === 'function') {
      const ip = await NetworkInfo.getIPV4Address();
      if (ip) hosts.add(ip);
    }
  } catch (_) {
    // ignore if the optional package is not installed
  }

  return Array.from(hosts);
};

const probeHostRoot = async (host: string, timeout = 1000) => {
  const url = `http://${host}:5000/`;
  try {
    const t = axios.create({ timeout });
    await t.get(url);
    return true;
  } catch (e) {
    return false;
  }
};

const resolveDevBase = async () => {
  if (resolvedDevBase) return resolvedDevBase;

  // Allow manual override from AsyncStorage (DEV_API_BASE) for debugging/testing
  try {
    const manual = await AsyncStorage.getItem('DEV_API_BASE');
    if (manual) {
      resolvedDevBase = manual;
      console.log(`[api] Using manual DEV_API_BASE override: ${resolvedDevBase}`);
      return resolvedDevBase;
    }
  } catch (_) {
    // ignore
  }

  const hosts = await candidateHosts();
  // try each host quickly to find a reachable backend
  for (const h of hosts) {
    // eslint-disable-next-line no-console
    console.log(`[api] Probing host: ${h}`);
    // eslint-disable-next-line no-await-in-loop
    if (await probeHostRoot(h)) {
      resolvedDevBase = `http://${h}:5000/api`;
      // eslint-disable-next-line no-console
      console.log(`[api] Resolved dev base to: ${resolvedDevBase}`);
      return resolvedDevBase;
    }
  }

  // fallback to default, even if not reachable
  resolvedDevBase = DEFAULT_DEV_BASE;
  // eslint-disable-next-line no-console
  console.warn(`[api] Falling back to default dev base: ${resolvedDevBase}`);
  return resolvedDevBase;
};

// Helper to set manual override programmatically (saved in AsyncStorage)
export const setDevApiBase = async (url: string | null) => {
  if (!url) {
    await AsyncStorage.removeItem('DEV_API_BASE');
    resolvedDevBase = null;
    console.log('[api] Removed DEV_API_BASE override');
    return;
  }
  await AsyncStorage.setItem('DEV_API_BASE', url);
  resolvedDevBase = url;
  console.log(`[api] Set DEV_API_BASE override to: ${url}`);
};

const api = axios.create({
  baseURL: __DEV__ ? DEFAULT_DEV_BASE : 'https://api.smart-expense.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s default timeout to surface slow requests
});

// Attach token from AsyncStorage for every request
api.interceptors.request.use(
  async (config) => {
    // On dev builds, ensure we have a reachable base URL resolved (works for real devices)
    if (__DEV__) {
      try {
        const base = await resolveDevBase();
        if (base) {
          // ensure the request hits the resolved dev API
          config.baseURL = base;
        }
      } catch (_) {
        // ignore; we'll use whatever base is set on the instance
      }
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch (_) {
      console.log('Failed to read token from storage');
    }

    if (__DEV__) {
      const method = (config.method || 'GET').toUpperCase();
      const url = `${config.baseURL ?? api.defaults.baseURL}${config.url ?? ''}`;
      console.log(`[api] Request => ${method} ${url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Return response.data directly, map errors and provide clearer network error messages
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[api] Response <= ${response.status} ${response.config?.url}`, response.data);
    }
    return response.data;
  },
  (error) => {
    // Network error (no response)
    if (!error.response) {
      const hostInUse = __DEV__ ? (resolvedDevBase ?? DEFAULT_DEV_BASE) : 'https://api.smart-expense.app/api/v1';
      console.warn('Network Error:', error.message, 'host:', hostInUse);
      return Promise.reject({ message: `Network Error: Unable to reach backend at ${hostInUse}. Is the server running?` });
    }

    if (error.response?.status === 401) {
      console.log('Unauthorized, token may be invalid');
    }

    if (__DEV__) {
      console.log('[api] Response Error <=', error.response?.status, error.response?.data);
    }

    return Promise.reject(error.response?.data || { message: 'Request failed' });
  }
);

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post('/auth/register', data),
};

export const walletAPI = {
  ping: () => api.get('/wallets/ping'),
  getAll: () => api.get('/wallets'),
  create: (data: { name: string; type: string; initialBalance?: number }) =>
    api.post('/wallets', data),
  update: (id: string, data: { name?: string; type?: string; balance?: number }) =>
    api.put(`/wallets/${id}`, data),
  remove: (id: string) => api.delete(`/wallets/${id}`),
};

export default api;