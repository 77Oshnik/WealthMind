import { useState, useEffect } from 'react';
import { AINotifications } from '@/components/AINotifications';
import { FloatingAICoach } from '@/components/FloatingAICoach';
import { FinancialCharts } from '@/components/FinancialCharts';
import { LiveFinancialData } from '@/components/LiveFinancialData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { FinancialOverview } from '@/components/dashboard/FinancialOverview';
import { ProgressSection } from '@/components/dashboard/ProgressSection';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { BehaviorScoreCard } from '@/components/dashboard/BehaviorScoreCard';
import { AchievementSection } from '@/components/dashboard/AchievementSection';

const Dashboard = () => {
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [financialScore, setFinancialScore] = useState(87);
  const [isAiActive, setIsAiActive] = useState(true);

  // Simulate dynamic financial score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFinancialScore(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newScore = prev + change;
        return Math.max(75, Math.min(95, newScore));
      });
    }, 10000); // Update score every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAIInsight = (insight: string) => {
    setAiInsights(prev => [insight, ...prev.slice(0, 4)]);
  };

  return (
    <>
      <AINotifications />
      <FloatingAICoach onInsightGenerated={handleAIInsight} />
      
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-ai-primary/5">
        {/* Navigation Header */}
        <DashboardHeader isAiActive={isAiActive} />
        
        {/* Welcome Section */}
        <WelcomeSection 
          financialScore={financialScore} 
          aiInsightsCount={aiInsights.length} 
        />

        <div className="max-w-screen-2xl mx-auto px-6 pb-10 space-y-10">
          {/* Financial Overview Cards */}
          <FinancialOverview />

          {/* Progress + Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <ProgressSection />
              <LiveFinancialData />
            </div>
            <div className="lg:col-span-8">
              <FinancialCharts />
            </div>
          </div>

          {/* AI Insights & Behavior Section - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <BehaviorScoreCard financialScore={financialScore} />
            <AIInsightsPanel aiInsights={aiInsights} />
          </div>

          {/* Achievement Badges - Full Width */}
          <AchievementSection />
        </div>
      </div>
    </>
  );
};

export default Dashboard;