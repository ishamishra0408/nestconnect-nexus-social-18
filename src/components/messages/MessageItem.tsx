import { Message, User } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface MessageItemProps {
  message: Message;
  currentUser: User;
  onMarkAsRead?: (messageId: string) => void;
}

export function MessageItem({ message, currentUser, onMarkAsRead }: MessageItemProps) {
  const sender = message.sender;
  
  const isOwnMessage = message.sender_id === currentUser.id;
  const isPrivateMessage = message.is_private;
  
  const handleMarkAsRead = () => {
    if (!message.is_read && !isOwnMessage && onMarkAsRead) {
      onMarkAsRead(message.id);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });

  return (
    <div 
      className={`p-4 border rounded-lg ${
        !message.is_read && !isOwnMessage ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start space-x-3">
        <img
          src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender_id}`}
          alt={sender?.name || 'Unknown User'}
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{sender?.name || 'Unknown User'}</span>
              {isPrivateMessage && (
                <span className="text-sm text-gray-500">
                  → {message.recipient_id === currentUser.id ? 'You' : 'recipient name'}
                </span>
              )}
              {isPrivateMessage && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Private
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">{timeAgo}</span>
          </div>
          <p className="mt-1 text-gray-700">{message.text}</p>
          {!message.is_read && !isOwnMessage && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Unread
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
