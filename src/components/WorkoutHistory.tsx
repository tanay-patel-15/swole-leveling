
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
      <div className="text-center p-8 glass-card rounded-lg">
        <p className="text-muted-foreground">No workout history yet. Complete your first workout to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id} className="overflow-hidden glass-card border-l-4 border-l-violet-500 hover:shadow-violet-900/20 hover:shadow-lg transition-all">
          <CardHeader className="pb-2 bg-gradient-to-r from-violet-950/30 to-transparent">
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
              <Badge variant="secondary" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700">
                {workout.totalXP} XP
              </Badge>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                {workout.totalVolume} lbs
              </Badge>
            </div>
            <div className="space-y-2">
              {workout.exercises.map((ex, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-md p-2 border-l-2 border-l-fuchsia-500/70">
                  <div className="font-medium">{ex.exercise.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1">
                    {ex.sets.map((set, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-full bg-slate-700/70 text-pink-300">
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
