import api from './api';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  name?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export const register = async (payload: RegisterRequest) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const login = async (payload: AuthRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const loginWithGoogle = async (payload: GoogleAuthRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/google', payload);
  return response.data;
};
