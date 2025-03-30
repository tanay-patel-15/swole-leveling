
import { Workout } from "@/models/types";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface WorkoutHistoryProps {
  workouts: Workout[];
}

const WorkoutHistory = ({ workouts }: WorkoutHistoryProps) => {
  if (workouts.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No workout history yet. Complete your first workout to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {new Date(workout.date).toLocaleDateString()} 
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm mb-2">
              <span className="font-medium">Total XP:</span> {workout.totalXP} | 
              <span className="font-medium ml-2">Volume:</span> {workout.totalVolume} lbs
            </div>
            <div className="space-y-2">
              {workout.exercises.map((ex, idx) => (
                <div key={idx} className="bg-muted rounded-md p-2">
                  <div className="font-medium">{ex.exercise.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {ex.sets.map((set, i) => (
                      <span key={i} className="mr-2">
                        {set.weight}lb × {set.reps}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutHistory;
