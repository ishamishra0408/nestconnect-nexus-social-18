
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Friend } from "@/types";
import { friends as initialFriends, users } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { User } from "@/types";

interface FriendContextType {
  friends: Friend[];
  sendFriendRequest: (friendId: string) => void;
  acceptFriendRequest: (friendshipId: string) => void;
  rejectFriendRequest: (friendshipId: string) => void;
  removeFriend: (friendId: string) => void;
  getFriendStatus: (friendId: string) => "not_friends" | "pending" | "requested" | "friends";
  getFriends: () => User[];
  getPendingRequests: () => { request: Friend; user: User }[];
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export function FriendProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>(() => {
    const savedFriends = localStorage.getItem("nestconnect-friends");
    return savedFriends ? JSON.parse(savedFriends) : initialFriends;
  });
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Save friends to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("nestconnect-friends", JSON.stringify(friends));
  }, [friends]);

  const sendFriendRequest = (friendId: string) => {
    if (!currentUser) return;
    
    // Check if there's already a friendship between these users
    const existingFriendship = friends.find(
      (f) => (
        (f.userId === currentUser.id && f.friendId === friendId) ||
        (f.userId === friendId && f.friendId === currentUser.id)
      )
    );
    
    if (existingFriendship) {
      toast({
        title: "Friend Request Error",
        description: "You already have a connection with this user",
        variant: "destructive",
      });
      return;
    }
    
    const newFriendship: Friend = {
      id: `${Date.now()}`,
      status: "pending",
      userId: currentUser.id,
      friendId,
    };
    
    setFriends((prevFriends) => [...prevFriends, newFriendship]);
    
    toast({
      title: "Friend Request Sent",
      description: "Your friend request has been sent",
    });
  };

  const acceptFriendRequest = (friendshipId: string) => {
    if (!currentUser) return;
    
    setFriends((prevFriends) =>
      prevFriends.map((friendship) => {
        if (friendship.id === friendshipId && friendship.friendId === currentUser.id) {
          return { ...friendship, status: "accepted" };
        }
        return friendship;
      })
    );
    
    toast({
      title: "Friend Request Accepted",
      description: "You have accepted the friend request",
    });
  };

  const rejectFriendRequest = (friendshipId: string) => {
    if (!currentUser) return;
    
    setFriends((prevFriends) =>
      prevFriends.map((friendship) => {
        if (friendship.id === friendshipId && friendship.friendId === currentUser.id) {
          return { ...friendship, status: "rejected" };
        }
        return friendship;
      })
    );
    
    toast({
      title: "Friend Request Rejected",
      description: "You have rejected the friend request",
    });
  };

  const removeFriend = (friendId: string) => {
    if (!currentUser) return;
    
    setFriends((prevFriends) =>
      prevFriends.filter(
        (friendship) => !(
          (friendship.userId === currentUser.id && friendship.friendId === friendId) ||
          (friendship.userId === friendId && friendship.friendId === currentUser.id)
        )
      )
    );
    
    toast({
      title: "Friend Removed",
      description: "You have removed this connection",
    });
  };

  const getFriendStatus = (friendId: string): "not_friends" | "pending" | "requested" | "friends" => {
    if (!currentUser) return "not_friends";
    
    const friendship = friends.find(
      (f) => (
        (f.userId === currentUser.id && f.friendId === friendId) ||
        (f.userId === friendId && f.friendId === currentUser.id)
      )
    );
    
    if (!friendship) return "not_friends";
    
    if (friendship.status === "accepted") return "friends";
    
    if (friendship.status === "pending") {
      return friendship.userId === currentUser.id ? "pending" : "requested";
    }
    
    return "not_friends";
  };

  const getFriends = () => {
    if (!currentUser) return [];
    
    // Get all accepted friendships
    const friendships = friends.filter(
      (friendship) => (
        friendship.status === "accepted" && (
          friendship.userId === currentUser.id || 
          friendship.friendId === currentUser.id
        )
      )
    );
    
    // Map to user objects
    return friendships.map((friendship) => {
      const friendId = friendship.userId === currentUser.id ? friendship.friendId : friendship.userId;
      return users.find(user => user.id === friendId)!;
    }).filter(Boolean);
  };

  const getPendingRequests = () => {
    if (!currentUser) return [];
    
    // Get pending friend requests where current user is the recipient
    const pendingRequests = friends.filter(
      (friendship) => (
        friendship.status === "pending" && 
        friendship.friendId === currentUser.id
      )
    );
    
    // Map to request and user object pairs
    return pendingRequests.map((request) => ({
      request,
      user: users.find(user => user.id === request.userId)!,
    })).filter(item => !!item.user);
  };

  return (
    <FriendContext.Provider value={{ 
      friends, 
      sendFriendRequest, 
      acceptFriendRequest, 
      rejectFriendRequest, 
      removeFriend, 
      getFriendStatus, 
      getFriends,
      getPendingRequests
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
