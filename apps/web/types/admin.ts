export type AdminStats = {
  users: { total: number; active: number; banned: number };
  posts: number;
  reportedPosts: number;
  advices: number;
  zones: number;
  reviews: number;
};

export type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'tourist' | 'guide' | 'admin';
  isActive: boolean;
  profilePicture: string | null;
  createdAt: string;
};

export type AdminPost = {
  _id: string;
  title: string;
  description: string;
  destination: string;
  category: { _id: string; name: string; color: string };
  author: { _id: string; firstName: string; lastName: string; email: string };
  reports: string[];
  createdAt: string;
};

export type AdminAdvice = {
  _id: string;
  title: string;
  content: string;
  category: string;
  address?: string;
  author: { _id: string; firstName: string; lastName: string; email: string };
  createdAt: string;
};

export type AdminReview = {
  _id: string;
  guideId: {
    _id: string;
    userId: { _id: string; firstName: string; lastName: string; profilePicture: string | null };
  };
  touristId: { _id: string; firstName: string; lastName: string; email: string; profilePicture: string | null };
  rating: number;
  comment: string;
  createdAt: string;
};

export type AdminPagedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
