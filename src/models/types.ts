
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl?: string;
}

export interface ExerciseSet {
  weight: number;
  reps: number;
  xpEarned: number;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
  totalXP: number;
  totalVolume: number;
}

export interface UserData {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  weeklyVolume: number;
  workoutsThisWeek: number;
  workoutDays: number[];
  workouts: Workout[];
}
