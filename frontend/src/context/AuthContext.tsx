import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../api/auth';

// Define user interface
interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to parse JWT and extract user information
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

// Function to get stored user from localStorage
const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const loading = false; // No async check, so loading is always false
  const isAuthenticated = !!token;

  // Save user and token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = async (payload: LoginPayload) => {
    const res: AuthResponse = await apiLogin(payload);
    setToken(res.token);
    // Get user info from response or decode from token
    if (res.user) {
      setUser(res.user);
    } else {
      const decoded = parseJwt(res.token);
      if (decoded && decoded.user) {
        setUser(decoded.user);
      }
    }
  };

  const register = async (payload: RegisterPayload) => {
    const res: AuthResponse = await apiRegister(payload);
    setToken(res.token);
    // Get user info from response or decode from token
    if (res.user) {
      setUser(res.user);
    } else {
      const decoded = parseJwt(res.token);
      if (decoded && decoded.user) {
        setUser(decoded.user);
      } else {
        setUser({
          id: '',
          email: payload.email,
          username: payload.username
        });
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        login, 
        register, 
        logout, 
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
