import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageList } from "@/components/messages/MessageList";
import { MessageComposer } from "@/components/messages/MessageComposer";
import { useMessages } from "@/hooks/useMessages";
import { useFriends } from "@/context/FriendContext";
import { User } from "@/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Messages = () => {
  const { getPublicMessages, getPrivateMessagesByUser, markMessageAsRead } = useMessages();
  const { getFriends } = useFriends();
  
  const publicMessages = getPublicMessages();
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  
  const privateMessages = selectedFriend 
    ? getPrivateMessagesByUser(selectedFriend.id)
    : [];

  useEffect(() => {
    const loadFriends = async () => {
      const friendsData = await getFriends();
      setFriends(friendsData);
    };
    
    loadFriends();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500">Communicate with your colleagues</p>
        </div>
        
        <Tabs defaultValue="public">
          <TabsList>
            <TabsTrigger value="public">Public Feed</TabsTrigger>
            <TabsTrigger value="private">Private Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="public" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Feed</CardTitle>
                <CardDescription>Public messages visible to all employees</CardDescription>
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
          </TabsContent>
          
          <TabsContent value="private" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                  <CardDescription>Your private messages</CardDescription>
                </CardHeader>
                <CardContent>
                  {friends.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p>No friends yet</p>
                      <Link to="/friends">
                        <Button variant="link" className="mt-2">
                          Find Friends
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {friends.map((friend) => (
                        <button
                          key={friend.id}
                          className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                            selectedFriend?.id === friend.id
                              ? "bg-nestconnect-blue"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedFriend(friend)}
                        >
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span>{friend.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedFriend ? `Chat with ${selectedFriend.name}` : "Select a Friend"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedFriend ? (
                    <>
                      <div className="mt-6">
                        <MessageList 
                          messages={privateMessages} 
                          emptyMessage={`No messages yet with ${selectedFriend.name}`} 
                          onMarkAsRead={markMessageAsRead}
                        />
                      </div>
                      <div className="mt-6">
                        <MessageComposer recipientId={selectedFriend.id} isPrivate={true} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <p>Select a friend to start chatting</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Messages;
