
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function MainLayout({ children, requireAuth = true }: MainLayoutProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (requireAuth && !isAuthenticated) {
    // Redirect to login if authentication is required but user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Don't show sidebar for non-authenticated pages
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
