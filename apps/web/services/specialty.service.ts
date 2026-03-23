import { api } from './api';
import type { Specialty } from '../types/specialty';

export async function apiGetSpecialties(): Promise<Specialty[]> {
  const { data } = await api.get<Specialty[]>('/specialties');
  return data;
}
