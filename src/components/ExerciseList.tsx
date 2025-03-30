import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchExercises } from "@/services/exerciseService";
import { Exercise } from "@/models/types";

const ExerciseList = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchExercises();
        setExercises(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  // Get unique muscle groups (target)
  const muscleGroups = [...new Set(exercises.map(ex => ex.target))].sort();

  // Filter exercises for the selected muscle
  const filteredExercises = exercises.filter(ex => ex.target === selectedMuscle);

  // Get the selected exercise object
  useEffect(() => {
    const match = exercises.find(ex => ex.id === selectedExerciseId);
    setSelectedExercise(match || null);
  }, [selectedExerciseId, exercises]);

  if (loading) {
    return <div className="text-center p-8 text-white">Loading exercises...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-pink-400 text-center">Swole Leveling</h1>

      {/* Select Muscle Group */}
      <div>
        <label className="block text-sm mb-2 text-gray-300">Select Muscle Group</label>
        <Select value={selectedMuscle} onValueChange={(value) => {
          setSelectedMuscle(value);
          setSelectedExerciseId("");
          setSelectedExercise(null);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a muscle..." />
          </SelectTrigger>
          <SelectContent>
            {muscleGroups.map((muscle) => (
              <SelectItem key={muscle} value={muscle}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid Preview of Exercises */}
      {selectedMuscle && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="rounded-xl p-4 bg-[#1e1e2f] border border-gray-700 hover:ring-2 hover:ring-pink-500 transition-all">
              <h3 className="text-lg font-bold text-pink-300 capitalize">{exercise.name}</h3>
              <div className="text-sm text-gray-400 mt-2 space-y-1">
                <p>🎯 Target: <span className="capitalize">{exercise.target}</span></p>
                <p>📍 Body Part: <span className="capitalize">{exercise.bodyPart}</span></p>
                <p>🏋️ Equipment: <span className="capitalize">{exercise.equipment}</span></p>
              </div>
              {exercise.gifUrl && (
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  loading="lazy"
                  className="mt-4 w-full rounded-md border border-gray-700"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Optional: Select Specific Exercise */}
      {selectedMuscle && (
        <div className="pt-6">
          <label className="block text-sm mb-2 text-gray-300">Or select one to highlight:</label>
          <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an exercise..." />
            </SelectTrigger>
            <SelectContent>
              {filteredExercises.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Highlighted Exercise Preview */}
      {selectedExercise && (
        <div className="mt-6 rounded-xl p-4 bg-[#1f2937] border border-pink-500">
          <h2 className="text-xl font-semibold mb-2 text-pink-300 capitalize">
            {selectedExercise.name}
          </h2>
          <div className="text-sm text-gray-300 space-y-1">
            <p>🎯 Target: {selectedExercise.target}</p>
            <p>📍 Body Part: {selectedExercise.bodyPart}</p>
            <p>🏋️ Equipment: {selectedExercise.equipment}</p>
          </div>
          {selectedExercise.gifUrl && (
            <img
              src={selectedExercise.gifUrl}
              alt={selectedExercise.name}
              className="mt-4 w-full rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
