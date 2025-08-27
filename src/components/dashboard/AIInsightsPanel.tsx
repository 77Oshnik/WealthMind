import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Activity } from 'lucide-react';

interface AIInsightsPanelProps {
  aiInsights: string[];
}

export const AIInsightsPanel = ({ aiInsights }: AIInsightsPanelProps) => {
  return (
    <Card className="ai-agent-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-ai-primary" />
            Real-time AI Insights
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-ai-primary/10 text-ai-primary border-ai-primary/20">
              <Activity className="w-3 h-3 mr-1" />
              Live Analysis
            </Badge>
            <div className="w-2 h-2 bg-ai-primary rounded-full animate-ping" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-success/10 rounded-lg border border-success/20 hover:scale-[1.02] transition-transform cursor-pointer">
            <h4 className="font-semibold text-success mb-2 flex items-center gap-2 text-sm">
              Great Job! 🎉
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                Just now
              </Badge>
            </h4>
            <p className="text-xs text-muted-foreground">
              You're 13% ahead of your savings goal this month. AI suggests increasing your emergency fund target.
            </p>
          </div>
          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20 hover:scale-[1.02] transition-transform cursor-pointer">
            <h4 className="font-semibold text-warning mb-2 flex items-center gap-2 text-sm">
              Opportunity 💡
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
                5m ago
              </Badge>
            </h4>
            <p className="text-xs text-muted-foreground">
              AI detected subscription spending up 23%. Auto-optimization available for $47/month savings.
            </p>
          </div>
          <div className="p-3 bg-ai-primary/10 rounded-lg border border-ai-primary/20 hover:scale-[1.02] transition-transform cursor-pointer">
            <h4 className="font-semibold text-ai-primary mb-2 flex items-center gap-2 text-sm">
              AI Prediction 🎯
              <Badge variant="outline" className="bg-ai-primary/10 text-ai-primary border-ai-primary/20 text-xs">
                Analyzing
              </Badge>
            </h4>
            <p className="text-xs text-muted-foreground">
              Based on current patterns, you'll reach vacation goal 2 months early. AI is calculating next optimal goal.
            </p>
          </div>
        </div>
        
        {aiInsights.length > 0 && (
          <div className="p-3 bg-ai-primary/5 rounded-lg border border-ai-primary/20">
            <h4 className="font-semibold text-ai-primary mb-2 flex items-center gap-2 text-sm">
              Latest AI Recommendation 🤖
              <Badge variant="outline" className="bg-ai-primary/10 text-ai-primary border-ai-primary/20 text-xs">
                New
              </Badge>
            </h4>
            <p className="text-xs text-muted-foreground">{aiInsights[0]}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};