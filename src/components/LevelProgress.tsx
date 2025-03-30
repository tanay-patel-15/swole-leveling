
import { Progress } from "@/components/ui/progress";
import { UserData } from "@/models/types";

interface LevelProgressProps {
  userData: UserData;
}

const LevelProgress = ({ userData }: LevelProgressProps) => {
  const progressPercent = (userData.currentXP / userData.xpToNextLevel) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progressPercent} className="h-3 bg-slate-800/60 overflow-hidden progress-shine">
        <div 
          className="h-full level-gradient transition-all"
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
