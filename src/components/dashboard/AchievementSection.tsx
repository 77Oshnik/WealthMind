import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialBadge } from '@/components/FinancialBadge';
import { Award, Star, Shield, Zap, Calendar } from 'lucide-react';

export const AchievementSection = () => {
  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Achievement Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FinancialBadge
            icon={Star}
            title="Budget Master"
            description="Stay within budget for 3 months"
            earned={true}
          />
          <FinancialBadge
            icon={Shield}
            title="Emergency Ready"
            description="Build 3-month emergency fund"
            earned={false}
            progress={71}
          />
          <FinancialBadge
            icon={Zap}
            title="Savings Streak"
            description="Save money for 30 days straight"
            earned={true}
          />
          <FinancialBadge
            icon={Calendar}
            title="Goal Crusher"
            description="Achieve a savings goal"
            earned={false}
            progress={47}
          />
        </div>
      </CardContent>
    </Card>
  );
};