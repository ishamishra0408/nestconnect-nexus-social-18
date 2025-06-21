import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Friend, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FriendContextType {
  friends: Friend[];
  loading: boolean;
  sendFriendRequest: (friendId: string) => Promise<void>;
  acceptFriendRequest: (friendshipId: string) => Promise<void>;
  rejectFriendRequest: (friendshipId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  getFriendStatus: (friendId: string) => "not_friends" | "pending" | "requested" | "friends";
  getFriends: () => Promise<User[]>;
  getPendingRequests: () => Promise<{ request: Friend; user: User }[]>;
  refreshFriends: () => Promise<void>;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export function FriendProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const fetchFriends = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`);
      
      if (error) throw error;
      
      setFriends(data || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const refreshFriends = async () => {
    await fetchFriends();
  };

  useEffect(() => {
    if (currentUser) {
      fetchFriends();
    }
  }, [currentUser]);

  const sendFriendRequest = async (friendId: string) => {
    if (!currentUser || requestLoading) return;

    const existingFriendship = friends.find(f =>
      (f.user_id === currentUser.id && f.friend_id === friendId) ||
      (f.user_id === friendId && f.friend_id === currentUser.id)
    );

    if (existingFriendship) {
      toast({
        title: "Request already sent",
        description: "You have already sent or received a request from this user.",
        variant: "default",
      });
      return;
    }

    setRequestLoading(true);
    try {
      const { data, error } = await supabase
        .from('friends')
        .insert({
          user_id: currentUser.id,
          friend_id: friendId,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setFriends(prev => [...prev, data]);
      
      toast({
        title: "Friend Request Sent",
        description: "Your friend request has been sent",
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    } finally {
      setRequestLoading(false);
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', friendshipId)
        .select()
        .single();
      
      if (error) throw error;
      
      setFriends(prev => prev.map(f => f.id === friendshipId ? data : f));
      
      toast({
        title: "Friend Request Accepted",
        description: "You have accepted the friend request",
      });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    }
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .update({ status: 'rejected' })
        .eq('id', friendshipId)
        .select()
        .single();
      
      if (error) throw error;
      
      setFriends(prev => prev.map(f => f.id === friendshipId ? data : f));
      
      toast({
        title: "Friend Request Rejected",
        description: "You have rejected the friend request",
      });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to reject friend request",
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${currentUser.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${currentUser.id})`);
      
      if (error) throw error;
      
      setFriends(prev => prev.filter(f => 
        !((f.user_id === currentUser.id && f.friend_id === friendId) ||
          (f.user_id === friendId && f.friend_id === currentUser.id))
      ));
      
      toast({
        title: "Friend Removed",
        description: "You have removed this connection",
      });
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Error",
        description: "Failed to remove friend",
        variant: "destructive",
      });
    }
  };

  const getFriendStatus = (friendId: string): "not_friends" | "pending" | "requested" | "friends" => {
    if (!currentUser) return "not_friends";
    
    const friendship = friends.find(f => 
      (f.user_id === currentUser.id && f.friend_id === friendId) ||
      (f.user_id === friendId && f.friend_id === currentUser.id)
    );
    
    if (!friendship) return "not_friends";
    
    if (friendship.status === "accepted") return "friends";
    
    if (friendship.status === "pending") {
      return friendship.user_id === currentUser.id ? "pending" : "requested";
    }
    
    return "not_friends";
  };

  const getFriends = async (): Promise<User[]> => {
    if (!currentUser) return [];
    
    try {
      // Get accepted friendships with profile data
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          user_profile:profiles!friends_user_id_fkey(*),
          friend_profile:profiles!friends_friend_id_fkey(*)
        `)
        .eq('status', 'accepted')
        .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`);
      
      if (error) throw error;
      
      return (data || []).map(friendship => {
        const profile = friendship.user_id === currentUser.id 
          ? friendship.friend_profile 
          : friendship.user_profile;
        
        return {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
          role: profile.role,
          about_me: profile.about_me || '',
          department: profile.department || 'General',
          joined: profile.joined || new Date().toISOString().split('T')[0],
          created_at: profile.created_at,
          updated_at: profile.updated_at
        } as User;
      });
    } catch (error) {
      console.error('Error fetching friends:', error);
      return [];
    }
  };

  const getPendingRequests = async (): Promise<{ request: Friend; user: User }[]> => {
    if (!currentUser) return [];
    
    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          user_profile:profiles!friends_user_id_fkey(*)
        `)
        .eq('status', 'pending')
        .eq('friend_id', currentUser.id);
      
      if (error) throw error;
      
      return (data || []).map(request => ({
        request,
        user: {
          id: request.user_profile.id,
          username: request.user_profile.username,
          email: request.user_profile.email,
          name: request.user_profile.name,
          avatar: request.user_profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.user_profile.username}`,
          role: request.user_profile.role,
          about_me: request.user_profile.about_me || '',
          department: request.user_profile.department || 'General',
          joined: request.user_profile.joined || new Date().toISOString().split('T')[0],
          created_at: request.user_profile.created_at,
          updated_at: request.user_profile.updated_at
        } as User
      }));
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  };

  return (
    <FriendContext.Provider value={{ 
      friends, 
      loading: requestLoading,
      sendFriendRequest, 
      acceptFriendRequest, 
      rejectFriendRequest, 
      removeFriend, 
      getFriendStatus, 
      getFriends,
      getPendingRequests,
      refreshFriends
    }}>
      {children}
    </FriendContext.Provider>
  );
}

export function useFriends() {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error("useFriends must be used within a FriendProvider");
  }
  return context;
}
