import { Exercise } from "@/models/types";

const API_URL = "https://exercisedb.p.rapidapi.com";
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY!;
const API_HOST = "exercisedb.p.rapidapi.com";

// Function to load exercises from API with cache
export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    const cachedData = localStorage.getItem("exerciseCache");
    const cacheTimestamp = localStorage.getItem("exerciseCacheTimestamp");

    if (cachedData && cacheTimestamp) {
      const now = Date.now();
      const age = now - parseInt(cacheTimestamp);
      const oneHour = 1000 * 60 * 60;

      if (age < oneHour) {
        return JSON.parse(cachedData);
      }
    }

    const response = await fetch(`${API_URL}/exercises?limit=100`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }

    const data = await response.json();

    const formattedData: Exercise[] = data.map((item: any) => ({
      id: item.id || String(Math.random()),
      name: item.name,
      bodyPart: item.bodyPart,
      target: item.target,
      equipment: item.equipment,
      gifUrl: item.gifUrl,
    }));

    // Cache results
    localStorage.setItem("exerciseCache", JSON.stringify(formattedData));
    localStorage.setItem("exerciseCacheTimestamp", Date.now().toString());

    return formattedData;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return demoExercises;
  }
};

// Demo fallback data
const demoExercises: Exercise[] = [
  {
    id: "0001",
    name: "Barbell Bench Press",
    bodyPart: "chest",
    target: "pectorals",
    equipment: "barbell",
    gifUrl: "",
  },
  {
    id: "0002",
    name: "Pull-up",
    bodyPart: "back",
    target: "lats",
    equipment: "body weight",
    gifUrl: "",
  },
  {
    id: "0003",
    name: "Squat",
    bodyPart: "legs",
    target: "quadriceps",
    equipment: "barbell",
    gifUrl: "",
  },
  {
    id: "0004",
    name: "Deadlift",
    bodyPart: "legs",
    target: "glutes",
    equipment: "barbell",
    gifUrl: "",
  },
  {
    id: "0005",
    name: "Shoulder Press",
    bodyPart: "shoulders",
    target: "deltoids",
    equipment: "dumbbell",
    gifUrl: "",
  },
  {
    id: "0006",
    name: "Bicep Curl",
    bodyPart: "arms",
    target: "biceps",
    equipment: "dumbbell",
    gifUrl: "",
  },
  {
    id: "0007",
    name: "Tricep Extension",
    bodyPart: "arms",
    target: "triceps",
    equipment: "cable",
    gifUrl: "",
  },
  {
    id: "0008",
    name: "Leg Press",
    bodyPart: "legs",
    target: "quadriceps",
    equipment: "machine",
    gifUrl: "",
  },
];
