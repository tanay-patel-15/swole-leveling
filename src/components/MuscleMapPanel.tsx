import React from "react";
import MuscleSVG from "./MuscleSVG";
import { Workout } from "../models/types";

// Maps app muscle names (from exercise.target) to SVG IDs
const MUSCLE_MAP: Record<string, string> = {
  abs: "abdominals",
  abdominals: "abdominals",
  obliques: "obliques",
  "serratus anterior": "obliques",
  biceps: "biceps",
  triceps: "triceps",
  delts: "front-shoulders",
  shoulders: "front-shoulders",
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

interface MuscleMapPanelProps {
  workouts: Workout[];
}

const MuscleMapPanel: React.FC<MuscleMapPanelProps> = ({ workouts }) => {
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
    <div className="w-full flex justify-center">
      <MuscleSVG highlightedMuscles={Array.from(musclesWorked)} />
    </div>
  );
};

export default MuscleMapPanel;