export type CommentAuthor = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type Comment = {
  _id: string;
  post: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
};
