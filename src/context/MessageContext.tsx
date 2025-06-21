import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Message, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface MessageContextType {
  messages: Message[];
  loading: boolean;
  sendMessage: (text: string, recipientId?: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  getPublicMessages: () => Message[];
  getPrivateMessagesByUser: (userId: string) => Message[];
  refreshMessages: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const fetchMessages = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id (
            id,
            username,
            name,
            avatar
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshMessages = async () => {
    await fetchMessages();
  };

  useEffect(() => {
    if (currentUser) {
      fetchMessages();
    }
  }, [currentUser]);

  const sendMessage = async (text: string, recipientId?: string) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          text,
          sender_id: currentUser.id,
          recipient_id: recipientId,
          is_private: !!recipientId,
          is_read: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newMessage = { ...data, sender: currentUser };
      setMessages(prev => [newMessage, ...prev]);
      
      toast({
        title: "Message Sent",
        description: recipientId ? "Private message sent successfully" : "Message posted successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMessages(prev => prev.filter(m => m.id !== id));
      
      toast({
        title: "Message Deleted",
        description: "Message has been deleted",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const getPublicMessages = () => {
    return messages.filter(message => !message.is_private);
  };

  const getPrivateMessagesByUser = (userId: string) => {
    if (!currentUser) return [];
    
    return messages.filter(message => 
      message.is_private && (
        (message.sender_id === currentUser.id && message.recipient_id === userId) || 
        (message.sender_id === userId && message.recipient_id === currentUser.id)
      )
    );
  };

  return (
    <MessageContext.Provider value={{ 
      messages, 
      loading,
      sendMessage, 
      deleteMessage, 
      getPublicMessages, 
      getPrivateMessagesByUser,
      refreshMessages
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
