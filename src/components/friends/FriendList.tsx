
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FriendListProps {
  friends: User[];
}

export function FriendList({ friends }: FriendListProps) {
  if (friends.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>You haven't added any friends yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {friends.map((friend) => (
        <Card key={friend.id} className="hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${friend.id}`} className="hover:underline">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {friend.name}
                  </p>
                </Link>
                <p className="text-sm text-gray-500 truncate">{friend.role}</p>
                <p className="text-xs text-gray-500 truncate">{friend.department}</p>
              </div>
              <Link to={`/messages/${friend.id}`}>
                <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
