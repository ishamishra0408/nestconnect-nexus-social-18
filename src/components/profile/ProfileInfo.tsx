
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface ProfileInfoProps {
  user: User;
  isCurrentUser: boolean;
}

export function ProfileInfo({ user, isCurrentUser }: ProfileInfoProps) {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    about_me: user.about_me,
    role: user.role,
    department: user.department,
  });

  const handleSave = async () => {
    await updateProfile(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user.name,
      about_me: user.about_me,
      role: user.role,
      department: user.department,
    });
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={user.username} disabled />
          </div>
          <div>
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={editedUser.name}
                onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
              />
            ) : (
              <Input id="name" value={user.name} disabled />
            )}
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            {isEditing ? (
              <Select value={editedUser.role} onValueChange={(value: "Employee" | "Manager" | "Admin") => setEditedUser(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input id="role" value={user.role} disabled />
            )}
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            {isEditing ? (
              <Input
                id="department"
                value={editedUser.department}
                onChange={(e) => setEditedUser(prev => ({ ...prev, department: e.target.value }))}
              />
            ) : (
              <Input id="department" value={user.department} disabled />
            )}
          </div>
          <div>
            <Label htmlFor="joined">Joined</Label>
            <Input id="joined" value={user.joined} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <Textarea
              placeholder="Tell us about yourself..."
              value={editedUser.about_me}
              onChange={(e) => setEditedUser(prev => ({ ...prev, about_me: e.target.value }))}
              rows={6}
            />
          ) : (
            <div className="min-h-[120px] p-3 bg-gray-50 rounded-md">
              <p className="text-gray-700">{user.about_me || "No information provided yet."}</p>
            </div>
          )}
          
          {isCurrentUser && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  Edit Profile
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
