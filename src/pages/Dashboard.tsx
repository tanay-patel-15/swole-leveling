import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import LevelProgress from "@/components/LevelProgress";
import WorkoutHistory from "@/components/WorkoutHistory";
import WorkoutForm from "@/components/WorkoutForm";
import ExerciseList from "@/components/ExerciseList";
import { useUserData } from "@/hooks/useUserData";
import Profile from "@/components/Profile";

const Dashboard = () => {
  const { userData, addWorkout } = useUserData();
  const { logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="container py-8 max-w-5xl mx-auto px-4">
      <header className="mb-8 text-center">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-gradient">Swole Leveling</h1>
          <Button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Log Out
          </Button>
        </div>
        <p className="text-xl text-muted-foreground">Level up your fitness journey</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Profile />
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle>Weekly Streak</CardTitle>
            <CardDescription>{userData.workoutsThisWeek} of 4 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, index) => (
                <div 
                  key={index} 
                  className={`h-8 rounded-md flex items-center justify-center ${
                    userData.workoutDays.includes(index) 
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white" 
                      : "bg-slate-800/50"
                  }`}
                >
                  {["S", "M", "T", "W", "T", "F", "S"][index]}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              XP Multiplier: <span className={userData.workoutsThisWeek >= 4 ? "text-gradient font-bold" : ""}>{userData.workoutsThisWeek >= 4 ? "x2" : "x1"}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle>Stats</CardTitle>
            <CardDescription>Your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total XP:</span>
                <span className="font-medium text-gradient">{userData.totalXP}</span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Volume:</span>
                <span className="font-medium text-emerald-400">{userData.weeklyVolume} lbs</span>
              </div>
              <div className="flex justify-between">
                <span>Workouts Completed:</span>
                <span className="font-medium text-pink-300">{userData.workouts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur">
          <TabsTrigger value="workout" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-fuchsia-700 data-[state=active]:text-white">New Workout</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-fuchsia-700 data-[state=active]:text-white">History</TabsTrigger>
          <TabsTrigger value="exercises" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-fuchsia-700 data-[state=active]:text-white">Exercise Library</TabsTrigger>
        </TabsList>
        <TabsContent value="workout" className="mt-6">
          <WorkoutForm onSaveWorkout={addWorkout} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <WorkoutHistory workouts={userData.workouts} />
        </TabsContent>
        <TabsContent value="exercises" className="mt-6">
          <ExerciseList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard; 