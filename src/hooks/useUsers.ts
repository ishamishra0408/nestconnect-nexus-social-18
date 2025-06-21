
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUser?.id || '')
        .order('name');
      
      if (error) throw error;
      
      const formattedUsers: User[] = (data || []).map(profile => ({
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
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  return { users, loading, refetch: fetchUsers };
}
