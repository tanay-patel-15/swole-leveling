
import { useState, useEffect } from 'react';
import { UserData, Workout } from '@/models/types';

const INITIAL_USER_DATA: UserData = {
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  totalXP: 0,
  weeklyVolume: 0,
  workoutsThisWeek: 0,
  workoutDays: [],
  workouts: []
};

// Calculate XP needed for a given level
const calculateXpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData>(() => {
    const savedData = localStorage.getItem('swoleLevelingUserData');
    return savedData ? JSON.parse(savedData) : INITIAL_USER_DATA;
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('swoleLevelingUserData', JSON.stringify(userData));
  }, [userData]);

  // Add a new workout
  const addWorkout = (workout: Workout) => {
    // Calculate streak bonus
    const multiplier = userData.workoutsThisWeek >= 4 ? 2 : 1;
    const xpWithBonus = workout.totalXP * multiplier;
    
    // Get the day of week (0-6, Sunday is 0)
    const workoutDate = new Date(workout.date);
    const dayOfWeek = workoutDate.getDay();
    
    // Update workoutDays for streak tracking (only if it's this week)
    const isCurrentWeek = isDateInCurrentWeek(workoutDate);
    const updatedWorkoutDays = isCurrentWeek && !userData.workoutDays.includes(dayOfWeek) 
      ? [...userData.workoutDays, dayOfWeek]
      : userData.workoutDays;
    
    // Calculate new XP values
    let newTotalXP = userData.totalXP + xpWithBonus;
    let newCurrentXP = userData.currentXP + xpWithBonus;
    let newLevel = userData.level;
    let newXpToNextLevel = userData.xpToNextLevel;
    
    // Handle level up
    while (newCurrentXP >= newXpToNextLevel) {
      newLevel++;
      newCurrentXP -= newXpToNextLevel;
      newXpToNextLevel = calculateXpForLevel(newLevel);
    }
    
    // Update user data
    setUserData({
      ...userData,
      level: newLevel,
      currentXP: newCurrentXP,
      xpToNextLevel: newXpToNextLevel,
      totalXP: newTotalXP,
      weeklyVolume: isCurrentWeek 
        ? userData.weeklyVolume + workout.totalVolume 
        : userData.weeklyVolume,
      workoutsThisWeek: isCurrentWeek 
        ? updatedWorkoutDays.length 
        : userData.workoutsThisWeek,
      workoutDays: updatedWorkoutDays,
      workouts: [workout, ...userData.workouts]
    });
  };

  // Reset weekly stats if needed
  useEffect(() => {
    const checkAndResetWeeklyStats = () => {
      const lastReset = localStorage.getItem('lastWeeklyReset');
      const now = new Date();
      const currentWeekStart = getStartOfWeek(now);
      
      if (!lastReset || new Date(lastReset) < currentWeekStart) {
        setUserData(prevData => ({
          ...prevData,
          weeklyVolume: 0,
          workoutsThisWeek: 0,
          workoutDays: []
        }));
        localStorage.setItem('lastWeeklyReset', currentWeekStart.toISOString());
      }
    };
    
    checkAndResetWeeklyStats();
  }, []);

  return { userData, addWorkout };
};

// Helper functions
function getStartOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = date.getDay();
  result.setDate(date.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function isDateInCurrentWeek(date: Date): boolean {
  const currentWeekStart = getStartOfWeek(new Date());
  const nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(currentWeekStart.getDate() + 7);
  
  return date >= currentWeekStart && date < nextWeekStart;
}
