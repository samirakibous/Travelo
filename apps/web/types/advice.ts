export type AdviceCategory = 'safety' | 'health' | 'transport' | 'culture' | 'emergency';

export type Advice = {
  _id: string;
  title: string;
  content: string;
  category: AdviceCategory;
  lat: number;
  lng: number;
  address?: string;
  mediaUrls: string[];
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  isCertifiedGuide: boolean;
  linkedZone?: string;
  createdAt: string;
};

export type AdviceQuery = {
  category?: string;
  certifiedOnly?: 'true' | 'false';
};
