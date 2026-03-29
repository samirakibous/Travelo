import axios, { AxiosError } from 'axios';

const API_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL;

// Instance publique — safe côté client et serveur
export const api = axios.create({
  baseURL: API_URL,
});

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
