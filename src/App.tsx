
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { MessageProvider } from "@/context/MessageContext";
import { FriendProvider } from "@/context/FriendContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";
import PrivateChat from "./pages/PrivateChat";
import Friends from "./pages/Friends";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FriendProvider>
          <MessageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/messages/:userId" element={<PrivateChat />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </MessageProvider>
        </FriendProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
