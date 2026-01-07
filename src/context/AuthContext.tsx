import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setUserToken(token);
      } catch (e) {
        console.log('Failed to restore token', e);
      } finally {
        setLoading(false);
      }
    };

    restoreToken();
  }, []);

  const signIn = async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      setUserToken(token);
    } catch (e) {
      console.log('Failed to store token', e);
      throw e;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserToken(null);
    } catch (e) {
      console.log('Failed to remove token', e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
