export type AdviceType = 'danger' | 'prudence' | 'recommandation';

export type Advice = {
  _id: string;
  title: string;
  content: string;
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
  createdAt: string;
};

export type AdviceQuery = {
  certifiedOnly?: 'true' | 'false';
  authorId?: string;
  adviceType?: string;
};
