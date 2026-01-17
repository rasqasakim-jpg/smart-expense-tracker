// src/auth/auth.store.ts
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { AuthState, LoginPayload, RegisterPayload } from "./auth.types.tsx";
import { AuthService } from "./auth.service";

type AuthResult = { success: boolean; error?: string };

type AuthContextType = AuthState & {
  login: (payload: LoginPayload) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined) as React.Context<AuthContextType | undefined>;

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Restore tokens on mount
  React.useEffect(() => {
    const restore = async () => {
      setState((s: AuthState) => ({ ...s, isLoading: true }));
      const tokens = await AuthService.getStoredTokens();
      if (tokens) {
        // We have tokens; assume authenticated. Optionally, you can fetch user profile here.
        setState({
          user: null,
          tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState((s: AuthState) => ({ ...s, isLoading: false }));
      }
    };
    restore();
  }, []);

  const login = async (payload: LoginPayload): Promise<AuthResult> => {
    try {
      setState((s: AuthState) => ({ ...s, isLoading: true, error: null }));
      const res = await AuthService.login(payload);

      await AuthService.saveTokens(res.tokens);

      setState({
        user: res.user,
        tokens: res.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err: any) {
      const message = err?.message ?? 'Login failed';
      setState((s: AuthState) => ({
        ...s,
        isLoading: false,
        error: message,
      }));
      return { success: false, error: message };
    }
  };

  const register = async (payload: RegisterPayload): Promise<AuthResult> => {
    setState((s: AuthState) => ({ ...s, isLoading: true, error: null }));
    try {
      await AuthService.register(payload);
      setState((s: AuthState) => ({ ...s, isLoading: false }));
      return { success: true };
    } catch (err: any) {
      setState((s: AuthState) => ({ ...s, isLoading: false, error: err?.message ?? 'Register failed' }));
      return { success: false, error: err?.message };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setState(initialState);
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};