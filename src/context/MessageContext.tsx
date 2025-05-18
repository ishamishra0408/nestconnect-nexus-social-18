
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Message } from "@/types";
import { messages as initialMessages } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface MessageContextType {
  messages: Message[];
  sendMessage: (text: string, recipientId?: string) => void;
  deleteMessage: (id: string) => void;
  getPublicMessages: () => Message[];
  getPrivateMessagesByUser: (userId: string) => Message[];
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("nestconnect-messages");
    return savedMessages ? JSON.parse(savedMessages) : initialMessages;
  });
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("nestconnect-messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (text: string, recipientId?: string) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }
    
    const newMessage: Message = {
      id: `${Date.now()}`,
      text,
      senderId: currentUser.id,
      recipientId,
      timestamp: new Date().toISOString(),
      isPrivate: !!recipientId,
      isRead: false,
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    toast({
      title: "Message Sent",
      description: recipientId ? "Private message sent successfully" : "Message posted successfully",
    });
  };

  const deleteMessage = (id: string) => {
    if (!currentUser) return;
    
    const message = messages.find((m) => m.id === id);
    
    if (!message) {
      toast({
        title: "Error",
        description: "Message not found",
        variant: "destructive",
      });
      return;
    }
    
    // Only allow the sender or recipient to delete the message
    if (message.senderId !== currentUser.id && message.recipientId !== currentUser.id) {
      toast({
        title: "Error",
        description: "You don't have permission to delete this message",
        variant: "destructive",
      });
      return;
    }
    
    setMessages((prevMessages) => prevMessages.filter((m) => m.id !== id));
    
    toast({
      title: "Message Deleted",
      description: "Message has been deleted",
    });
  };

  const getPublicMessages = () => {
    return messages
      .filter((message) => !message.isPrivate)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getPrivateMessagesByUser = (userId: string) => {
    if (!currentUser) return [];
    
    return messages
      .filter((message) => (
        // Show messages between the current user and the specified user
        message.isPrivate && (
          (message.senderId === currentUser.id && message.recipientId === userId) || 
          (message.senderId === userId && message.recipientId === currentUser.id)
        )
      ))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  return (
    <MessageContext.Provider value={{ 
      messages, 
      sendMessage, 
      deleteMessage, 
      getPublicMessages, 
      getPrivateMessagesByUser 
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
}
