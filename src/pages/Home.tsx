import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { MessageComposer } from "@/components/messages/MessageComposer";
import { MessageList } from "@/components/messages/MessageList";
import { useMessages } from "@/hooks/useMessages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const { currentUser } = useAuth();
  const { getPublicMessages, markMessageAsRead } = useMessages();
  
  const publicMessages = getPublicMessages();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {currentUser?.name}</h1>
          <p className="text-gray-500">Share updates with your colleagues</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Feed</CardTitle>
            <CardDescription>Public messages from all employees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MessageComposer />
            <div className="mt-6">
              <MessageList 
                messages={publicMessages} 
                emptyMessage="No public messages yet. Be the first to post!"
                onMarkAsRead={markMessageAsRead}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Home;
