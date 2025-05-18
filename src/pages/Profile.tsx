
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";

const Profile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <ProfileHeader user={currentUser} isCurrentUser={true} />
        <ProfileInfo user={currentUser} isCurrentUser={true} />
      </div>
    </MainLayout>
  );
};

export default Profile;
