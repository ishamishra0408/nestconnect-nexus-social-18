
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendList } from "@/components/friends/FriendList";
import { FriendRequestList } from "@/components/friends/FriendRequestList";
import { UserList } from "@/components/friends/UserList";
import { useFriends } from "@/context/FriendContext";
import { useUsers } from "@/hooks/useUsers";
import { useState, useEffect } from "react";
import { User } from "@/types";

const Friends = () => {
  const { getFriends, getPendingRequests } = useFriends();
  const { users } = useUsers();
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<{ request: any; user: User }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [friendsData, requestsData] = await Promise.all([
          getFriends(),
          getPendingRequests()
        ]);
        setFriends(friendsData);
        setPendingRequests(requestsData);
      } catch (error) {
        console.error('Error loading friends data:', error);
      }
    };
    
    loadData();
  }, [getFriends, getPendingRequests]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Friends</h1>
          <p className="text-gray-500">Connect with your colleagues</p>
        </div>
        
        <Tabs defaultValue="friends">
          <TabsList>
            <TabsTrigger value="friends">My Connections</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="discover">Discover People</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>My Connections</CardTitle>
                <CardDescription>People you've connected with</CardDescription>
              </CardHeader>
              <CardContent>
                <FriendList friends={friends} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Connection Requests</CardTitle>
                <CardDescription>Pending requests from other users</CardDescription>
              </CardHeader>
              <CardContent>
                <FriendRequestList requests={pendingRequests} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="discover" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Discover People</CardTitle>
                <CardDescription>Find and connect with other employees</CardDescription>
              </CardHeader>
              <CardContent>
                <UserList users={users} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Friends;
