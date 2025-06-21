
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams, Navigate } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
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
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/not-found" replace />;
  
  const isCurrentUser = currentUser?.id === user.id;
  
  if (isCurrentUser) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <ProfileHeader user={user} isCurrentUser={false} />
        <ProfileInfo user={user} isCurrentUser={false} />
      </div>
    </MainLayout>
  );
};

export default UserProfile;
