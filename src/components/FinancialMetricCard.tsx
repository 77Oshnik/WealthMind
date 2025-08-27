import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FinancialMetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient?: string;
}

export const FinancialMetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  gradient = 'bg-gradient-to-br from-primary to-primary-glow'
}: FinancialMetricCardProps) => {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-danger',
    neutral: 'text-muted-foreground'
  }[changeType];

  return (
    <Card className="metric-card group overflow-hidden relative">
      <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <CardContent className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={`p-2 rounded-lg ${gradient} bg-opacity-10`}>
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold animate-counter">{value}</p>
          <p className={`text-sm ${changeColor} flex items-center gap-1`}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};