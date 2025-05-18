
import { Message } from "@/types";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  emptyMessage?: string;
}

export function MessageList({ messages, emptyMessage = "No messages yet" }: MessageListProps) {
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
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}
