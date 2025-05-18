
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { useFriends } from "@/context/FriendContext";

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
}

export function ProfileHeader({ user, isCurrentUser }: ProfileHeaderProps) {
  const { getFriendStatus, sendFriendRequest, removeFriend } = useFriends();
  
  const friendStatus = !isCurrentUser ? getFriendStatus(user.id) : "self";
  
  const handleFriendAction = () => {
    if (friendStatus === "not_friends") {
      sendFriendRequest(user.id);
    } else if (friendStatus === "friends") {
      removeFriend(user.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white rounded-lg p-6 shadow-sm border">
      <img
        src={user.avatar}
        alt={user.name}
        className="h-24 w-24 rounded-full"
      />
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">@{user.username}</p>
        <div className="mt-2">
          <p className="text-sm text-gray-600">{user.role}</p>
          <p className="text-sm text-gray-600">{user.department}</p>
        </div>
      </div>
      {!isCurrentUser && (
        <div>
          {friendStatus === "not_friends" && (
            <Button onClick={handleFriendAction}>Add Friend</Button>
          )}
          {friendStatus === "pending" && (
            <Button variant="outline" disabled>
              Request Sent
            </Button>
          )}
          {friendStatus === "requested" && (
            <Button variant="outline" disabled>
              Respond to Request
            </Button>
          )}
          {friendStatus === "friends" && (
            <Button variant="outline" onClick={handleFriendAction}>
              Remove Friend
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
