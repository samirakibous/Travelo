import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Instance de base sans auth (login, register)
export const api = axios.create({
  baseURL: API_URL,
});

// Instance authentifiée — lit le cookie access_token automatiquement
// À utiliser dans les Server Components et Server Actions uniquement
export async function getAuthApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// Extraction centralisée des messages d'erreur API
export function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return `Impossible de contacter le serveur (${API_URL})`;
    }
    const message = error.response.data?.message;
    return Array.isArray(message)
      ? message.join(', ')
      : message || `Erreur ${error.response.status}`;
  }
  return String(error);
}
