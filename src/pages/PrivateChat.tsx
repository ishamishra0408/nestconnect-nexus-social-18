
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageList } from "@/components/messages/MessageList";
import { MessageComposer } from "@/components/messages/MessageComposer";
import { useMessages } from "@/context/MessageContext";
import { users } from "@/lib/data";
import { useParams, Navigate } from "react-router-dom";

const PrivateChat = () => {
  const { userId } = useParams();
  const { getPrivateMessagesByUser } = useMessages();
  
  if (!userId) {
    return <Navigate to="/messages" replace />;
  }
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return <Navigate to="/messages" replace />;
  }
  
  const privateMessages = getPrivateMessagesByUser(user.id);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">Chat with {user.name}</h1>
            <p className="text-gray-500">{user.role}</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Private Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MessageList 
              messages={privateMessages} 
              emptyMessage={`No messages yet with ${user.name}. Start the conversation!`} 
            />
            <div className="mt-6">
              <MessageComposer recipientId={user.id} isPrivate={true} />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PrivateChat;
