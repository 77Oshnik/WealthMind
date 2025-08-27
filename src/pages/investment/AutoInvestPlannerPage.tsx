import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const AutoInvestPlannerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-success/5">
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/investment-features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Investment Features
            </Link>
          </Button>
          
          <Card className="financial-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Auto Invest Planner</h1>
              <p className="text-muted-foreground text-lg">
                This feature is coming soon. Stay tuned for automated investment planning tools.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutoInvestPlannerPage;