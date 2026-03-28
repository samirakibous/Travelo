export type PostAuthor = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
};

import type { Category } from './category';

export type Post = {
  _id: string;
  title: string;
  description: string;
  category: Category;
  author: PostAuthor;
  mediaUrls: string[];
  upvotes: string[];
  downvotes: string[];
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
  category?: string;
  page?: number;
  limit?: number;
};
