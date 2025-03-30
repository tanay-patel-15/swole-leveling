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
import MuscleMapPanel from "@/components/MuscleMapPanel";
import BackMusclePanel from "@/components/BackMusclePanel";
import { useUserData } from "@/hooks/useUserData";

const Index = () => {
  const { userData, addWorkout } = useUserData();

  // 🧠 Muscles trained this week
  const musclesTrainedThisWeek = Array.from(
    new Set(
      userData.workouts
        .filter(workout => {
          const workoutDate = new Date(workout.date);
          const now = new Date();
          const diffDays = (now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        })
        .flatMap(workout =>
          workout.exercises.map(ex => ex.exercise.target)
        )
    )
  );

  return (
    <div className="container py-8 max-w-5xl mx-auto px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gradient">Swole Leveling</h1>
        <p className="text-xl text-muted-foreground mt-2">Level up your fitness journey</p>
      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle>Level {userData.level}</CardTitle>
            <CardDescription>Current progress</CardDescription>
          </CardHeader>
          <CardContent>
            <LevelProgress userData={userData} />
          </CardContent>
        </Card>
        
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
              XP Multiplier:{" "}
              <span className={userData.workoutsThisWeek >= 4 ? "text-gradient font-bold" : ""}>
                {userData.workoutsThisWeek >= 4 ? "x2" : "x1"}
              </span>
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

        {/* 👇 New combined muscle map card */}
        <Card className="glass-card col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Muscles Trained This Week</CardTitle>
            <CardDescription>Visualized on your body</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row justify-center items-center gap-8">
            <MuscleMapPanel workouts={userData.workouts} />
            <BackMusclePanel workouts={userData.workouts} />
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur">
          <TabsTrigger value="workout" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-fuchsia-700 data-[state=active]:text-white">
            New Workout
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-fuchsia-700 data-[state=active]:text-white">
            History
          </TabsTrigger>
          <TabsTrigger value="exercises" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-fuchsia-700 data-[state=active]:text-white">
            Exercise Library
          </TabsTrigger>
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
