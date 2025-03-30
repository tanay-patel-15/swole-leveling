
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LevelProgress from "@/components/LevelProgress";
import WorkoutHistory from "@/components/WorkoutHistory";
import WorkoutForm from "@/components/WorkoutForm";
import ExerciseList from "@/components/ExerciseList";
import { useUserData } from "@/hooks/useUserData";

const Index = () => {
  const { userData, addWorkout } = useUserData();
  
  return (
    <div className="container py-8 max-w-5xl mx-auto px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Swole Leveling</h1>
        <p className="text-xl text-muted-foreground mt-2">Level up your fitness journey</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Level {userData.level}</CardTitle>
            <CardDescription>Current progress</CardDescription>
          </CardHeader>
          <CardContent>
            <LevelProgress userData={userData} />
          </CardContent>
        </Card>
        
        <Card>
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
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}
                >
                  {["S", "M", "T", "W", "T", "F", "S"][index]}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              XP Multiplier: {userData.workoutsThisWeek >= 4 ? "x2" : "x1"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Stats</CardTitle>
            <CardDescription>Your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total XP:</span>
                <span className="font-medium">{userData.totalXP}</span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Volume:</span>
                <span className="font-medium">{userData.weeklyVolume} lbs</span>
              </div>
              <div className="flex justify-between">
                <span>Workouts Completed:</span>
                <span className="font-medium">{userData.workouts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workout">New Workout</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
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

export default Index;
