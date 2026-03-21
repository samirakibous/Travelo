'use client';

import { useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import type { User } from '../types/auth';

type Props = {
  children: React.ReactNode;
  initialUser: User | null;
};

export function AuthProvider({ children, initialUser }: Props) {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
