export type PostCategory = 'sécurité' | 'transport' | 'arnaque' | 'culture' | 'incident';

export type PostAuthor = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type Post = {
  _id: string;
  title: string;
  description: string;
  destination: string;
  category: PostCategory;
  author: PostAuthor;
  upvotes: string[];
  downvotes: string[];
  reports: { user: string; reason: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
};

export type PostsResponse = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
};

export type PostQuery = {
  destination?: string;
  category?: PostCategory;
  sort?: 'recent' | 'popular';
  page?: number;
  limit?: number;
};
