import React, { createContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  checkAuthStatus as apiCheckAuthStatus,
} from "../api/auth";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../api/auth";

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
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to parse JWT and extract user information
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Function to get stored user from localStorage
const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState<boolean>(true); // Now we need to check auth status initially
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuthStatus = async () => {
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      setLoading(true);
      const data = await apiCheckAuthStatus();

      if (data.isAuthenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // If the server says we're not authenticated, clear the state
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch {
      // If there's an error, assume we're not authenticated
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };
  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save user and token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [token, user]);
  const login = async (payload: LoginPayload) => {
    try {
      setLoading(true);
      const res: AuthResponse = await apiLogin(payload);
      setToken(res.token);
      // Get user info from response or decode from token
      if (res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      } else {
        const decoded = parseJwt(res.token);
        if (decoded && decoded.user) {
          setUser(decoded.user);
          setIsAuthenticated(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      setLoading(true);
      const res: AuthResponse = await apiRegister(payload);
      setToken(res.token);
      // Get user info from response or decode from token
      if (res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      } else {
        const decoded = parseJwt(res.token);
        if (decoded && decoded.user) {
          setUser(decoded.user);
          setIsAuthenticated(true);
        } else {
          setUser({
            id: "",
            email: payload.email,
            username: payload.username,
          });
          setIsAuthenticated(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        isAuthenticated,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
