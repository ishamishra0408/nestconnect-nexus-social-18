
import { createContext, useState, useContext, ReactNode } from "react";
import { User, users } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("nestconnect-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const { toast } = useToast();
  
  const isAuthenticated = !!currentUser;

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to validate credentials
    try {
      const user = users.find((u) => u.email === email);
      
      if (!user) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      // In a real app, we would validate the password here
      
      setCurrentUser(user);
      localStorage.setItem("nestconnect-user", JSON.stringify(user));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (username: string, email: string, name: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to create a new user
    try {
      // Check if user with email already exists
      const existingUser = users.find((u) => u.email === email || u.username === username);
      
      if (existingUser) {
        toast({
          title: "Signup Failed",
          description: "Email or username already exists",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `${users.length + 1}`,
        username,
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        role: "Employee",
        aboutMe: "",
        department: "General",
        joined: new Date().toISOString().split('T')[0]
      };
      
      // In a real app, we would save the user to the database
      // For now, we'll just update our local array and localStorage
      users.push(newUser);
      
      setCurrentUser(newUser);
      localStorage.setItem("nestconnect-user", JSON.stringify(newUser));
      
      toast({
        title: "Signup Successful",
        description: `Welcome to NestConnect, ${newUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An error occurred during signup",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("nestconnect-user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const updateProfile = (profile: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...profile };
    setCurrentUser(updatedUser);
    localStorage.setItem("nestconnect-user", JSON.stringify(updatedUser));
    
    // Update the user in our dummy data array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex >= 0) {
      users[userIndex] = updatedUser;
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
