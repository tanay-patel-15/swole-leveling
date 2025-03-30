import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MinusCircle, Save, Dumbbell } from "lucide-react";
import { fetchExercises } from "@/services/exerciseService";
import {
  Exercise,
  Workout,
  WorkoutExercise,
  ExerciseSet,
} from "@/models/types";
import { toast } from "sonner";

interface WorkoutFormProps {
  onSaveWorkout: (workout: Workout) => void;
}

const WorkoutForm = ({ onSaveWorkout }: WorkoutFormProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState("");

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

  const muscleGroups = [...new Set(exercises.map((ex) => ex.target))].sort();
  const filteredExercises = exercises.filter((ex) => ex.target === selectedMuscle);

  const addExercise = (exerciseId: string) => {
    const selectedExercise = exercises.find((ex) => ex.id === exerciseId);
    if (!selectedExercise) return;

    const newWorkoutExercise: WorkoutExercise = {
      exercise: selectedExercise,
      sets: [
        {
          weight: 0,
          reps: 0,
          xpEarned: 0,
        },
      ],
    };

    setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[exerciseIndex].sets.push({
      weight: updatedExercises[exerciseIndex].sets[0].weight,
      reps: updatedExercises[exerciseIndex].sets[0].reps,
      xpEarned: 0,
    });
    setWorkoutExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);

    if (updatedExercises[exerciseIndex].sets.length === 0) {
      updatedExercises.splice(exerciseIndex, 1);
    }

    setWorkoutExercises(updatedExercises);
  };

  const updateSetWeight = (exerciseIndex: number, setIndex: number, weight: number) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[exerciseIndex].sets[setIndex].weight = weight;
    updatedExercises[exerciseIndex].sets[setIndex].xpEarned =
      weight * updatedExercises[exerciseIndex].sets[setIndex].reps;
    setWorkoutExercises(updatedExercises);
  };

  const updateSetReps = (exerciseIndex: number, setIndex: number, reps: number) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[exerciseIndex].sets[setIndex].reps = reps;
    updatedExercises[exerciseIndex].sets[setIndex].xpEarned =
      updatedExercises[exerciseIndex].sets[setIndex].weight * reps;
    setWorkoutExercises(updatedExercises);
  };

  const removeExercise = (exerciseIndex: number) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises.splice(exerciseIndex, 1);
    setWorkoutExercises(updatedExercises);
  };

  const saveWorkout = () => {
    if (workoutExercises.length === 0) {
      toast.error("Add at least one exercise to save workout");
      return;
    }

    const invalidSets = workoutExercises.some((ex) =>
      ex.sets.some((set) => set.reps <= 0 || set.weight <= 0)
    );

    if (invalidSets) {
      toast.error("All sets must have weight and reps greater than 0");
      return;
    }

    let totalXP = 0;
    let totalVolume = 0;

    workoutExercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        totalXP += set.xpEarned;
        totalVolume += set.weight * set.reps;
      });
    });

    const workout: Workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: workoutExercises,
      totalXP,
      totalVolume,
    };

    onSaveWorkout(workout);
    toast.success("Workout saved! You earned " + totalXP + " XP");
    setWorkoutExercises([]);
  };

  if (loading) {
    return <div className="text-center p-8">Loading exercises...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Muscle-first Exercise Selection */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Step 1: Select Muscle Group */}
        <Select
          value={selectedMuscle}
          onValueChange={(value) => setSelectedMuscle(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select muscle group" />
          </SelectTrigger>
          <SelectContent>
            {muscleGroups.map((muscle) => (
              <SelectItem key={muscle} value={muscle}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Step 2: Select Exercise */}
        <Select
          onValueChange={(value) => addExercise(value)}
          disabled={!selectedMuscle || filteredExercises.length === 0}
          value=""
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Add exercise" />
          </SelectTrigger>
          <SelectContent>
            {filteredExercises.map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.id}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exercise & Sets Display */}
      {workoutExercises.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Add exercises to start your workout</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workoutExercises.map((workoutExercise, exerciseIndex) => (
            <Card key={exerciseIndex}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">{workoutExercise.exercise.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(exerciseIndex)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>

                {/* Exercise GIF */}
                {workoutExercise.exercise.gifUrl && (
                  <img
                    src={workoutExercise.exercise.gifUrl}
                    alt={workoutExercise.exercise.name}
                    className="mb-4 w-full max-h-56 object-contain rounded-lg border border-gray-700"
                  />
                )}

                {/* Exercise Sets */}
                {workoutExercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-2 mb-2">
                    <div className="w-8 text-center text-sm text-muted-foreground">
                      #{setIndex + 1}
                    </div>
                    <Input
                      type="number"
                      min="0"
                      placeholder="lbs"
                      value={set.weight || ""}
                      onChange={(e) =>
                        updateSetWeight(exerciseIndex, setIndex, Number(e.target.value))
                      }
                      className="w-20"
                    />
                    <span className="text-muted-foreground">×</span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="reps"
                      value={set.reps || ""}
                      onChange={(e) =>
                        updateSetReps(exerciseIndex, setIndex, Number(e.target.value))
                      }
                      className="w-20"
                    />
                    <div className="text-sm ml-auto">
                      {set.xpEarned > 0 ? `${set.xpEarned} XP` : ""}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSet(exerciseIndex)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Set
                </Button>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button onClick={saveWorkout}>
              <Save className="h-4 w-4 mr-2" />
              Save Workout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutForm;
