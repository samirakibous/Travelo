export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

export type Booking = {
  _id: string;
  guideId: {
    _id: string;
    userId: { _id: string; firstName: string; lastName: string; profilePicture: string | null };
    hourlyRate: number;
    location: string;
  };
  touristId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
    email: string;
  };
  date: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
};
