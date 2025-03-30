
import { Workout } from "@/models/types";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface WorkoutHistoryProps {
  workouts: Workout[];
}

const WorkoutHistory = ({ workouts }: WorkoutHistoryProps) => {
  if (workouts.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/30">
        <p className="text-muted-foreground">No workout history yet. Complete your first workout to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id} className="overflow-hidden border-l-4 border-l-violet-500 hover:shadow-md transition-all">
          <CardHeader className="pb-2 bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-950/20 dark:to-transparent">
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
            <div className="text-sm mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800">
                {workout.totalXP} XP
              </Badge>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:text-emerald-400">
                {workout.totalVolume} lbs
              </Badge>
            </div>
            <div className="space-y-2">
              {workout.exercises.map((ex, idx) => (
                <div key={idx} className="bg-muted rounded-md p-2 border-l-2 border-l-purple-300 dark:border-l-purple-700">
                  <div className="font-medium">{ex.exercise.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1">
                    {ex.sets.map((set, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
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
