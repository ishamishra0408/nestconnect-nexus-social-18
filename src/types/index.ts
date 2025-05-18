
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  aboutMe: string;
  department: string;
  joined: string;
}

export interface Friend {
  id: string;
  status: "pending" | "accepted" | "rejected";
  userId: string;
  friendId: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  recipientId?: string;
  timestamp: string;
  isPrivate: boolean;
  isRead: boolean;
}
