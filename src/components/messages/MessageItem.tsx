
import { Message, User } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { users } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { formatDistanceToNow } from "date-fns";
import { Trash } from "lucide-react";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { currentUser } = useAuth();
  const { deleteMessage } = useMessages();
  
  const sender: User | undefined = users.find(u => u.id === message.senderId);
  
  if (!sender || !currentUser) return null;
  
  const isOwnMessage = message.senderId === currentUser.id;
  
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  
  return (
    <Card className={`animate-fade-in w-full ${
      isOwnMessage ? "bg-nestconnect-blue" : "bg-white"
    }`}>
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <img
            src={sender.avatar}
            alt={sender.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium">{sender.name}</p>
                <span className="text-xs text-gray-500">
                  {formattedTime}
                </span>
              </div>
              {(isOwnMessage || message.recipientId === currentUser.id) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteMessage(message.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">{message.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
