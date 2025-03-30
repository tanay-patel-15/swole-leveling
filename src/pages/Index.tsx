import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const AUTH0_DOMAIN = "your-actual-domain.auth0.com";
const AUTH0_CLIENT_ID = "your-actual-client-id";

const Index = () => {
  const navigate = useNavigate();

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
    </div>
  );
};

export default Index;
