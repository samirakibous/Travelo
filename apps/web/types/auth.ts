export type Role = 'tourist' | 'guide' | 'admin';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  profilePicture: string | null;
  isActive: boolean;
};
