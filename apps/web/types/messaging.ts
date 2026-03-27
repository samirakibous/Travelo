export type MessageParticipant = {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  role: string;
};

export type ChatMessage = {
  _id: string;
  conversation: string;
  sender: MessageParticipant;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export type Conversation = {
  _id: string;
  participants: MessageParticipant[];
  lastMessage?: ChatMessage;
  updatedAt: string;
};
