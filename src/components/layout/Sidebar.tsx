
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Mail, MessageSquare, Users, User, LogOut } from "lucide-react";
import { useFriends } from "@/context/FriendContext";

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getPendingRequests } = useFriends();
  
  const pendingRequests = getPendingRequests();

  const navigationItems = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/friends", label: "Friends", icon: <Users className="h-5 w-5" />, badge: pendingRequests.length },
    { path: "/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  if (!currentUser) return null;

  return (
    <div className="w-64 bg-sidebar border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-nestconnect-purple">NestConnect</h1>
        <p className="text-sm text-gray-500">Employee Communication</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
                  isActive
                    ? "bg-nestconnect-purple text-white"
                    : "text-gray-600 hover:bg-nestconnect-blue hover:text-nestconnect-purple"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name}
            className="h-8 w-8 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="ml-auto text-gray-500 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
