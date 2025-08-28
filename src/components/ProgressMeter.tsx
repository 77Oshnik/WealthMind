import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressMeterProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressMeter = ({ 
  title, 
  current, 
  target, 
  unit = '₹',
  color = 'hsl(var(--primary))',
  showPercentage = true
}: ProgressMeterProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = percentage >= 100;

  return (
    <Card className="financial-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          {title}
          {isComplete && (
            <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full animate-bounce">
              Goal Achieved! 🎉
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold animate-counter">
              {unit}{current.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              of {unit}{target.toLocaleString()} target
            </p>
          </div>
          {showPercentage && (
            <div className="text-right">
              <p className="text-lg font-semibold" style={{ color }}>
                {percentage.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-3 animate-progress"
            style={{
              '--progress-foreground': color
            } as React.CSSProperties}
          />
          <div 
            className="absolute top-0 left-0 h-full rounded-full animate-glow"
            style={{
              width: `₹{percentage}%`,
              background: `linear-gradient(90deg, ₹{color}, ₹{color}80)`,
              filter: 'blur(1px)'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
