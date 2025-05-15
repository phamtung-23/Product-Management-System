import api from "./axios";

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface AuthStatusResponse {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const register = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const checkAuthStatus = async (): Promise<AuthStatusResponse> => {
  const { data } = await api.get("/auth/status");
  return data;
};
