import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl">Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img 
            src={user?.picture} 
            alt={user?.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile; 