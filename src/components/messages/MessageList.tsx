import { Message, User } from "@/types";
import { MessageItem } from "./MessageItem";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/hooks/useUsers";

interface MessageListProps {
  messages: Message[];
  emptyMessage?: string;
  onMarkAsRead?: (messageId: string) => void;
}

export function MessageList({ messages, emptyMessage = "No messages yet", onMarkAsRead }: MessageListProps) {
  const { currentUser } = useAuth();
  const { users } = useUsers();

  if (!currentUser) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Please log in to view messages</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          currentUser={currentUser}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}
