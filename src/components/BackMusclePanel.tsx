import React from "react";
import BackMuscleSVG from "./BackMuscleSVG"; // Replace with correct path if needed
import { Workout } from "../models/types";

// Reuse same muscle-to-ID mapping
const MUSCLE_MAP: Record<string, string> = {
  abs: "abdominals",
  abdominals: "abdominals",
  obliques: "obliques",
  "serratus anterior": "obliques",
  biceps: "biceps",
  triceps: "triceps",
  delts: "delts",
  shoulders: "delts",
  traps: "traps",
  chest: "chest",
  pectorals: "chest",
  forearms: "forearms",
  lats: "lats",
  "upper back": "lats",
  quads: "quads",
  hamstrings: "hamstrings",
  glutes: "glutes",
  calves: "calves",
};

interface BackMusclePanelProps {
  workouts: Workout[];
}

const BackMusclePanel: React.FC<BackMusclePanelProps> = ({ workouts }) => {
  const now = new Date();
  const musclesWorked = new Set<string>();

  workouts.forEach((workout) => {
    const date = new Date(workout.date);
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays <= 7) {
      workout.exercises.forEach((ex) => {
        const normalized = ex.exercise.target.toLowerCase();
        const svgId = MUSCLE_MAP[normalized];
        if (svgId) musclesWorked.add(svgId);
      });
    }
  });

  return (
    <div className="w-full flex justify-center mt-8">
      <BackMuscleSVG highlightedMuscles={Array.from(musclesWorked)} />
    </div>
  );
};

export default BackMusclePanel;
