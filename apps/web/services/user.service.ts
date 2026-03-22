import { getAuthApi } from './api.server';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture: string | null;
  isActive: boolean;
};

export async function apiGetUsers(): Promise<User[]> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<User[]>('/users');
  return data;
}

export async function apiGetUserById(id: string): Promise<User> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<User>(`/users/${id}`);
  return data;
}

export async function apiUpdateUser(id: string, payload: Partial<User>): Promise<User> {
  const authApi = await getAuthApi();
  const { data } = await authApi.patch<User>(`/users/${id}`, payload);
  return data;
}

export async function apiDeleteUser(id: string): Promise<void> {
  const authApi = await getAuthApi();
  await authApi.delete(`/users/${id}`);
}
