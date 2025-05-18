
import { useState } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface ProfileInfoProps {
  user: User;
  isCurrentUser: boolean;
}

export function ProfileInfo({ user, isCurrentUser }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutMe, setAboutMe] = useState(user.aboutMe || "");
  const [role, setRole] = useState(user.role || "");
  const [department, setDepartment] = useState(user.department || "");
  const { updateProfile } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isCurrentUser) {
      updateProfile({
        aboutMe,
        role,
        department,
      });
    }
    
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
          {isCurrentUser && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>
          {isCurrentUser ? "Your personal information" : `${user.name}'s information`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing && isCurrentUser ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Your role in the company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Your department"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutMe">About Me</Label>
              <Textarea
                id="aboutMe"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                placeholder="Tell others about yourself"
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1">{user.role || "No role specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Department</h3>
              <p className="mt-1">{user.department || "No department specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">About Me</h3>
              <p className="mt-1">{user.aboutMe || "No information provided"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Joined</h3>
              <p className="mt-1">{user.joined || "Unknown"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
