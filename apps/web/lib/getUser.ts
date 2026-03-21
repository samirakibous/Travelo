import { cache } from 'react';
import { apiGetMe } from '../services/auth.service';
import type { User } from '../types/auth';

// React cache() déduplique les appels dans le même render tree
// Layout + dashboard appellent getUser() → une seule requête API est faite
export const getUser = cache(async (): Promise<User | null> => {
  try {
    return await apiGetMe() as User;
  } catch {
    return null;
  }
});
