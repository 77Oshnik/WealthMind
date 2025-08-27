import { Badge } from '@/components/ui/badge';
import { Brain, Activity } from 'lucide-react';

interface WelcomeSectionProps {
  financialScore: number;
  aiInsightsCount: number;
}

export const WelcomeSection = ({ financialScore, aiInsightsCount }: WelcomeSectionProps) => {
  return (
    <div className="relative">
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-ai-primary bg-clip-text text-transparent">
                Good morning, Alex! 👋
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Your financial health score is{' '}
              <span className="font-semibold text-ai-primary animate-counter">
                {financialScore}/100
              </span>{' '}
              - Your AI coach has been working overnight!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="bg-ai-primary/10 text-ai-primary border-ai-primary/20">
                <Brain className="w-3 h-3 mr-1" />
                {aiInsightsCount} AI insights generated today
              </Badge>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Activity className="w-3 h-3 mr-1" />
                Real-time monitoring active
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};