import { useContext } from 'react';
import { FriendContext, FriendContextType } from '@/context/FriendContext';

export function useFriends() {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error("useFriends must be used within a FriendProvider");
  }
  return context;
} 