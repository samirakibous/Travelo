import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL;

// Instance authentifiée — Server Components et Server Actions uniquement
export async function getAuthApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
