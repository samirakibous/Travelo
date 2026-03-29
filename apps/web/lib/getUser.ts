import { cache } from 'react';
import { getAuthApi } from '../services/api.server';
import type { User } from '../types/auth';

// React cache() déduplique les appels dans le même render tree
// Layout + dashboard appellent getUser() → une seule requête API est faite
export const getUser = cache(async (): Promise<User | null> => {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<User>('/auth/me');
    return data;
  } catch {
    return null;
  }
});
