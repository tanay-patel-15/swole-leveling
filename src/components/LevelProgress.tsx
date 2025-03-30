
import { Progress } from "@/components/ui/progress";
import { UserData } from "@/models/types";

interface LevelProgressProps {
  userData: UserData;
}

const LevelProgress = ({ userData }: LevelProgressProps) => {
  const progressPercent = (userData.currentXP / userData.xpToNextLevel) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progressPercent} className="h-2 bg-muted overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all" 
          style={{ width: `${progressPercent}%` }}
        />
      </Progress>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{userData.currentXP} XP</span>
        <span>{userData.xpToNextLevel} XP</span>
      </div>
    </div>
  );
};

export default LevelProgress;
