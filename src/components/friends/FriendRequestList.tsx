
import { User, Friend } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFriends } from "@/context/FriendContext";

interface FriendRequestItem {
  request: Friend;
  user: User;
}

interface FriendRequestListProps {
  requests: FriendRequestItem[];
}

export function FriendRequestList({ requests }: FriendRequestListProps) {
  const { acceptFriendRequest, rejectFriendRequest } = useFriends();
  
  if (requests.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No pending friend requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(({ request, user }) => (
        <Card key={request.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => acceptFriendRequest(request.id)}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectFriendRequest(request.id)}
                >
                  Decline
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
