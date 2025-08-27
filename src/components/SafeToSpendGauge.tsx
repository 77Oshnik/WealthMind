import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SafeToSpendGaugeProps {
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  monthlyBudget: number;
}

export const SafeToSpendGauge = ({ 
  amount, 
  percentage, 
  trend,
  monthlyBudget 
}: SafeToSpendGaugeProps) => {
  const getGaugeColor = () => {
    if (percentage >= 70) return 'hsl(var(--success))';
    if (percentage >= 40) return 'hsl(var(--warning))';
    return 'hsl(var(--danger))';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-danger" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusMessage = () => {
    if (percentage >= 70) return "Great! You're in a healthy spending zone.";
    if (percentage >= 40) return "Be mindful of your spending this month.";
    return "Consider reducing expenses to stay on track.";
  };

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Safe to Spend
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                opacity="0.3"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={getGaugeColor()}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                className="progress-ring animate-progress"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold animate-counter">${amount}</p>
                <p className="text-xs text-muted-foreground">{percentage}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Of ${monthlyBudget} monthly budget
          </p>
          <p className="text-sm font-medium" style={{ color: getGaugeColor() }}>
            {getStatusMessage()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};