export type AdviceCategory = 'safety' | 'health' | 'transport' | 'culture' | 'emergency';
export type AdviceType = 'danger' | 'prudence' | 'recommandation';

export type Advice = {
  _id: string;
  title: string;
  content: string;
  category: AdviceCategory;
  adviceType: AdviceType;
  lat: number;
  lng: number;
  address?: string;
  mediaUrls: string[];
  usefulVotes: string[];
  notUsefulVotes: string[];
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
  authorId?: string;
  adviceType?: string;
};
