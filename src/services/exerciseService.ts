
import { Exercise } from "@/models/types";

const API_URL = "https://exercisedb.p.rapidapi.com";
// This is a placeholder - users will need to add their own RapidAPI key
const API_KEY = "YOUR_RAPIDAPI_KEY";
const API_HOST = "exercisedb.p.rapidapi.com";

// Function to load exercises from API
export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    // First check localStorage cache
    const cachedData = localStorage.getItem('exerciseCache');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // If API key is not set, return demo data
    if (API_KEY === "YOUR_RAPIDAPI_KEY") {
      console.log("Using demo exercise data. Add your RapidAPI key to access the full database.");
      return demoExercises;
    }
    
    const response = await fetch(`${API_URL}/exercises`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    
    const data = await response.json();
    
    // Format the data to match our Exercise type
    const formattedData: Exercise[] = data.map((item: any) => ({
      id: item.id || String(Math.random()),
      name: item.name,
      bodyPart: item.bodyPart,
      target: item.target,
      equipment: item.equipment,
      gifUrl: item.gifUrl
    }));
    
    // Cache the data in localStorage
    localStorage.setItem('exerciseCache', JSON.stringify(formattedData));
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return demoExercises;
  }
};

// Demo exercises for when API key is not set
const demoExercises: Exercise[] = [
  {
    id: "0001",
    name: "Barbell Bench Press",
    bodyPart: "chest",
    target: "pectorals",
    equipment: "barbell"
  },
  {
    id: "0002",
    name: "Pull-up",
    bodyPart: "back",
    target: "lats",
    equipment: "body weight"
  },
  {
    id: "0003",
    name: "Squat",
    bodyPart: "legs",
    target: "quadriceps",
    equipment: "barbell"
  },
  {
    id: "0004",
    name: "Deadlift",
    bodyPart: "legs",
    target: "glutes",
    equipment: "barbell"
  },
  {
    id: "0005",
    name: "Shoulder Press",
    bodyPart: "shoulders",
    target: "deltoids",
    equipment: "dumbbell"
  },
  {
    id: "0006",
    name: "Bicep Curl",
    bodyPart: "arms",
    target: "biceps",
    equipment: "dumbbell"
  },
  {
    id: "0007",
    name: "Tricep Extension",
    bodyPart: "arms",
    target: "triceps",
    equipment: "cable"
  },
  {
    id: "0008",
    name: "Leg Press",
    bodyPart: "legs",
    target: "quadriceps",
    equipment: "machine"
  }
];
