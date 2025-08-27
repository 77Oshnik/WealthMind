import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Sparkles, Brain } from 'lucide-react';

interface BehaviorScoreCardProps {
  financialScore: number;
}

export const BehaviorScoreCard = ({ financialScore }: BehaviorScoreCardProps) => {
  return (
    <Card className="ai-agent-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-ai-primary" />
          Financial Behavior Score
          <Badge className="bg-ai-primary/10 text-ai-primary border-ai-primary/20 ml-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                opacity="0.3"
              />
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="hsl(var(--ai-primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - financialScore / 100)}`}
                className="progress-ring animate-progress"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-ai-primary animate-counter">
                {financialScore}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Excellent financial habits! AI recommends maintaining this momentum.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs">Budgeting</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full">
                <div className="w-[90%] h-full bg-ai-primary rounded-full animate-progress"></div>
              </div>
              <span className="text-xs font-medium">90%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs">Saving</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full">
                <div className="w-[85%] h-full bg-accent rounded-full animate-progress"></div>
              </div>
              <span className="text-xs font-medium">85%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs">Spending Control</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full">
                <div className="w-[78%] h-full bg-primary rounded-full animate-progress"></div>
              </div>
              <span className="text-xs font-medium">78%</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full bg-ai-primary/5 hover:bg-ai-primary/10 border-ai-primary/20 text-xs"
        >
          <Brain className="w-3 h-3 mr-2" />
          Get AI Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};