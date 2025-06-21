import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageList } from "@/components/messages/MessageList";
import { MessageComposer } from "@/components/messages/MessageComposer";
import { useMessages } from "@/hooks/useMessages";
import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const PrivateChat = () => {
  const { userId } = useParams();
  const { getPrivateMessagesByUser } = useMessages();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          name: data.name,
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
          role: data.role,
          about_me: data.about_me || '',
          department: data.department || 'General',
          joined: data.joined || new Date().toISOString().split('T')[0],
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  if (!userId || loading) {
    return <Navigate to="/messages" replace />;
  }
  
  if (!user) {
    return <Navigate to="/messages" replace />;
  }
  
  const privateMessages = getPrivateMessagesByUser(user.id);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">Chat with {user.name}</h1>
            <p className="text-gray-500">{user.role}</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Private Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MessageList 
              messages={privateMessages} 
              emptyMessage={`No messages yet with ${user.name}. Start the conversation!`} 
            />
            <div className="mt-6">
              <MessageComposer recipientId={user.id} isPrivate={true} />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PrivateChat;
