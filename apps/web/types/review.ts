export type Review = {
  _id: string;
  guideId: string;
  touristId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  rating: number;
  comment: string;
  photos: string[];
  createdAt: string;
};

export type CreateReviewPayload = {
  rating: number;
  comment: string;
};
