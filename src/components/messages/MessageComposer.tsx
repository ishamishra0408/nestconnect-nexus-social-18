
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessages } from "@/context/MessageContext";

interface MessageComposerProps {
  recipientId?: string;
  isPrivate?: boolean;
}

export function MessageComposer({ recipientId, isPrivate = false }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendMessage } = useMessages();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      sendMessage(message, isPrivate ? recipientId : undefined);
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-4">
      <div className="space-y-2">
        <Textarea
          placeholder={isPrivate ? "Type a private message..." : "Share something with everyone..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!message.trim() || isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </form>
  );
}
