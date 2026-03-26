import { getAuthApi } from './api.server';
import type { Booking } from '../types/booking';

export async function apiGetMyBookings(): Promise<Booking[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Booking[]>('/bookings/mine');
    return data;
  } catch {
    return [];
  }
}

export async function apiGetIncomingBookings(): Promise<Booking[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Booking[]>('/bookings/incoming');
    return data;
  } catch {
    return [];
  }
}
