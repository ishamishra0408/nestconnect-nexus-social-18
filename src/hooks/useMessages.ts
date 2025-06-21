import { useContext } from 'react';
import { MessageContext, MessageContextType } from '@/context/MessageContext';

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
} 