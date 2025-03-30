import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
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
        
const AUTH0_DOMAIN = "your-actual-domain.auth0.com";
const AUTH0_CLIENT_ID = "your-actual-client-id";

const Index = () => {
  const { userData, addWorkout } = useUserData();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Swole Leveling
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Level up your fitness journey with gamified workouts
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">Level Up</CardTitle>
              <CardDescription className="text-gray-300">
                Track your progress and level up as you complete workouts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-pink-400">Track Workouts</CardTitle>
              <CardDescription className="text-gray-300">
                Log your exercises, sets, and reps to earn XP
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">Achieve Goals</CardTitle>
              <CardDescription className="text-gray-300">
                Set and track your fitness goals with our gamified system
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Swole Leveling?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Gamified Experience</h3>
              <p className="text-gray-300">
                Transform your workouts into an exciting RPG-like experience
              </p>
            </div>
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-300">
                Monitor your fitness journey with detailed statistics
              </p>
            </div>
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Community Support</h3>
              <p className="text-gray-300">
                Connect with other fitness enthusiasts
              </p>
            </div>
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Customizable Workouts</h3>
              <p className="text-gray-300">
                Create and track your own workout routines
              </p>
            </div>
          </div>
        </div>
      </div>
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
