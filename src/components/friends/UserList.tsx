import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFriends } from "@/context/FriendContext";

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const { currentUser } = useAuth();
  const { getFriendStatus, sendFriendRequest } = useFriends();
  
  if (!currentUser) return null;
  
  if (users.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => {
        const friendStatus = getFriendStatus(user.id);
        
        return (
          <Card key={user.id} className="animate-fade-in hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${user.id}`} className="hover:underline">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${user.id}`} className="hover:underline">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-500 truncate">{user.role}</p>
                  <p className="text-xs text-gray-500 truncate">{user.department}</p>
                </div>
                {friendStatus === "not_friends" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendFriendRequest(user.id)}
                  >
                    Add Friend
                  </Button>
                )}
                {friendStatus === "pending" && (
                  <Button size="sm" variant="outline" disabled>
                    Request Sent
                  </Button>
                )}
                {friendStatus === "requested" && (
                  <Button size="sm" variant="outline" disabled>
                    Respond to Request
                  </Button>
                )}
                {friendStatus === "friends" && (
                  <Button size="sm" variant="ghost" disabled>
                    Friends
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
