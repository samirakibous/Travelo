import type { Specialty } from './specialty';

export type ExpertiseLevel = 'elite' | 'professional' | 'local';

export type GuideProfile = {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
    email: string;
  };
  bio: string;
  location: string;
  hourlyRate: number;
  yearsExperience: number;
  tripsCompleted: number;
  specialties: Specialty[];
  languages: string[];
  expertiseLevel: ExpertiseLevel;
  rating: number;
  reviewCount: number;
  isCertified: boolean;
  availableDates: string[];
  createdAt: string;
};

export type GuidesResponse = {
  data: GuideProfile[];
  total: number;
  page: number;
  limit: number;
};

export type GuideQuery = {
  location?: string;
  expertiseLevel?: ExpertiseLevel;
  specialty?: string;
  language?: string;
  minRate?: number;
  maxRate?: number;
  page?: number;
  limit?: number;
};
