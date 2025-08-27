import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  isAiActive: boolean;
}

export const DashboardHeader = ({ isAiActive }: DashboardHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Landing
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-semibold">Wealthmind Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-ai-primary to-ai-secondary text-white border-none">
              <Bot className="w-3 h-3 mr-1" />
              AI Coach Active
            </Badge>
            {isAiActive && (
              <div className="w-2 h-2 bg-ai-primary rounded-full animate-ping" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};