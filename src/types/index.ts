export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  about_me: string;
  department: string;
  joined: string;
  created_at: string;
  updated_at?: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export type PartialUser = Pick<User, 'id' | 'username' | 'name' | 'avatar'>;

export interface Message {
  id: string;
  text: string;
  sender_id: string;
  recipient_id?: string;
  is_private: boolean;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
  sender?: PartialUser;
}
