'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { Booking } from '../types/booking';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getMyBookings(): Promise<Booking[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Booking[]>('/bookings/mine');
    return data;
  } catch {
    return [];
  }
}

export async function getIncomingBookings(): Promise<Booking[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Booking[]>('/bookings/incoming');
    return data;
  } catch {
    return [];
  }
}

export async function createBooking(
  guideId: string,
  payload: { date: string; message?: string },
): Promise<ActionResult<Booking>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<Booking>(`/bookings/guides/${guideId}`, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function confirmBooking(bookingId: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.patch(`/bookings/${bookingId}/confirm`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function rejectBooking(bookingId: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.patch(`/bookings/${bookingId}/reject`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function cancelBooking(bookingId: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.patch(`/bookings/${bookingId}/cancel`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
