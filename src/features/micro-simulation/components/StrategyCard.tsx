import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Calendar, 
  Target, 
  Repeat, 
  Settings,
  TrendingUp 
} from 'lucide-react';
import { MicroSimulationInputs } from '../types';
import { calculateTotalMonthlyContribution } from '../services/microSim.service';
import { formatCurrency, estimateMilestones, calculateRoundUps } from '../utils';

interface StrategyCardProps {
  inputs: MicroSimulationInputs;
}

const strategyIcons = {
  roundup: Coins,
  daily: Calendar,
  weekly: Target,
  monthly: Repeat,
  custom: Settings
};

const strategyDescriptions = {
  roundup: "Invest spare change from everyday purchases",
  daily: "Consistent daily investment amount",
  weekly: "Weekly investment sweep",
  monthly: "Traditional monthly recurring investment",
  custom: "Personalized investment strategy"
};

export function StrategyCard({ inputs }: StrategyCardProps) {
  const Icon = strategyIcons[inputs.selectedStrategy as keyof typeof strategyIcons] || Settings;
  const description = strategyDescriptions[inputs.selectedStrategy as keyof typeof strategyDescriptions] || "Custom strategy";
  
  const monthlyContribution = calculateTotalMonthlyContribution(inputs);
  const annualContribution = monthlyContribution * 12;
  
  // Calculate components
  const periodicMonthly = inputs.periodicAmount * (
    inputs.frequency === 'daily' ? 30.44 :
    inputs.frequency === 'weekly' ? 4.345 : 1
  );
  
  const roundUpMonthly = calculateRoundUps(
    inputs.roundUpAvgTxPerMonth,
    inputs.avgTxAmount,
    inputs.roundUpTo,
    inputs.roundUpMultiplier
  );
  
  // Estimate milestones (using conservative 6% return)
  const milestones = estimateMilestones(monthlyContribution, 0.06, inputs.lumpSum);
  const firstMilestone = milestones.find(m => m.months > 0);
  
  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="capitalize">{inputs.selectedStrategy.replace(/([A-Z])/g, ' $1').trim()}</div>
            <div className="text-sm text-muted-foreground font-normal">{description}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Monthly Breakdown */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Monthly Investment Breakdown</h4>
          
          {periodicMonthly > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Regular contributions:</span>
              <span>{formatCurrency(periodicMonthly)}</span>
            </div>
          )}
          
          {roundUpMonthly > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Round-up investments:</span>
              <span>{formatCurrency(roundUpMonthly)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-medium pt-2 border-t border-border">
            <span>Total Monthly:</span>
            <Badge className="bg-primary/10 text-primary">
              {formatCurrency(monthlyContribution)}
            </Badge>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-accent/5 rounded-lg">
            <div className="text-lg font-semibold">{formatCurrency(annualContribution)}</div>
            <div className="text-xs text-muted-foreground">Annual Investment</div>
          </div>
          
          <div className="text-center p-3 bg-accent/5 rounded-lg">
            <div className="text-lg font-semibold">{inputs.durationYears}y</div>
            <div className="text-xs text-muted-foreground">Time Horizon</div>
          </div>
        </div>
        
        {/* Total at Horizon */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Contributions:</span>
            <span className="font-semibold">
              {formatCurrency(inputs.lumpSum + (monthlyContribution * inputs.durationYears * 12))}
            </span>
          </div>
        </div>
        
        {/* Next Milestone */}
        {firstMilestone && firstMilestone.months < 120 && (
          <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Next Milestone</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(firstMilestone.amount)} in ~{Math.ceil(firstMilestone.months / 12)} years
            </div>
          </div>
        )}
        
        {/* Strategy-specific insights */}
        {inputs.selectedStrategy === 'roundup' && roundUpMonthly > 0 && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• ~{inputs.roundUpAvgTxPerMonth} transactions/month</div>
            <div>• Avg round-up: {formatCurrency((roundUpMonthly / inputs.roundUpAvgTxPerMonth) || 0)}</div>
            {inputs.roundUpMultiplier > 1 && (
              <div>• {inputs.roundUpMultiplier}x multiplier applied</div>
            )}
          </div>
        )}
        
        {inputs.selectedStrategy === 'daily' && (
          <div className="text-xs text-muted-foreground">
            • Daily investment of {formatCurrency(inputs.periodicAmount)}
            • Builds consistent saving habits
          </div>
        )}
        
        {monthlyContribution === 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="text-sm text-amber-800 dark:text-amber-200">
              Configure your strategy amounts to see projections
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}