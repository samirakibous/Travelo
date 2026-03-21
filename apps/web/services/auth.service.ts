import { api, getAuthApi } from './api';

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
};

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function apiRegister(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function apiGetMe(): Promise<AuthResponse['user']> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<AuthResponse['user']>('/auth/me');
  return data;
}

export async function apiLogout(userId: string): Promise<void> {
  const authApi = await getAuthApi();
  await authApi.post('/auth/logout', { userId });
}
