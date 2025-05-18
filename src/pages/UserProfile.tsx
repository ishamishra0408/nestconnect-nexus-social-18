
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams, Navigate } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/lib/data";

const UserProfile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return <Navigate to="/not-found" replace />;
  }
  
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
