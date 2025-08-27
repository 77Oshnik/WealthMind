import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import PortfolioForm from './components/PortfolioForm';
import RiskProfileSelector from './components/RiskProfileSelector';
import RecommendationCard from './components/RecommendationCard';
import AllocationPie from './components/AllocationPie';
import ProjectionChart from './components/ProjectionChart';
import RebalancePlan from './components/RebalancePlan';
import SavePlanModal from './components/SavePlanModal';
import ExportPlanBtn from './components/ExportPlanBtn';

import { recommendPortfolio, simulatePortfolio, recordFeedback } from './services/portfolio.service';
import { Goal, ContributionInputs, Preferences, PortfolioRecommendation, ProjectionResults } from './types';
import { RiskProfileResult, InvestorType } from '../risk-profile/types';

const PortfolioRecommendationPage = () => {
  const { toast } = useToast();
  const [riskProfile, setRiskProfile] = useState<RiskProfileResult | { investorType: InvestorType; manual: true } | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [contribution, setContribution] = useState<ContributionInputs | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({ ethicalFilter: false, liquidityRequirement: false });
  const [recommendation, setRecommendation] = useState<PortfolioRecommendation | null>(null);
  const [projections, setProjections] = useState<ProjectionResults | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleGenerateRecommendation = () => {
    if (!riskProfile || !goal || !contribution) {
      toast({
        title: "Missing Information",
        description: "Please complete all sections before generating recommendations.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate recommendation
      const rec = recommendPortfolio({
        riskProfile,
        goal,
        contribution,
        preferences
      });
      setRecommendation(rec);

      // Generate projections for all scenarios
      const projectionResults: ProjectionResults = {
        low: simulatePortfolio({
          allocation: rec.allocation,
          lump: contribution.currentLumpSum,
          monthly: contribution.monthlyContribution,
          years: goal.timeHorizonYears,
          scenario: 'low'
        }),
        medium: simulatePortfolio({
          allocation: rec.allocation,
          lump: contribution.currentLumpSum,
          monthly: contribution.monthlyContribution,
          years: goal.timeHorizonYears,
          scenario: 'medium'
        }),
        high: simulatePortfolio({
          allocation: rec.allocation,
          lump: contribution.currentLumpSum,
          monthly: contribution.monthlyContribution,
          years: goal.timeHorizonYears,
          scenario: 'high'
        })
      };
      setProjections(projectionResults);

      toast({
        title: "Recommendation Generated",
        description: "Your personalized portfolio recommendation is ready!"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate recommendation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAcceptRecommendation = () => {
    if (recommendation) {
      recordFeedback('accept', `rec_${Date.now()}`);
      setShowSaveModal(true);
    }
  };

  const handleRejectRecommendation = () => {
    if (recommendation) {
      recordFeedback('reject', `rec_${Date.now()}`);
      toast({
        title: "Feedback Recorded",
        description: "We'll improve future recommendations based on your feedback."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-ai-primary/5">
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/investment-features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Investment Features
              </Link>
            </Button>
            
            <div className="text-center">
              <Badge className="mb-4 bg-ai-primary/10 text-ai-primary border-ai-primary/20">
                <Target className="w-3 h-3 mr-1" />
                Portfolio Recommendation
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-ai-primary via-primary to-accent bg-clip-text text-transparent">
                  Portfolio Recommendation
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Personalized portfolio suggestions based on your investor profile and goals
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <RiskProfileSelector
              selectedProfile={riskProfile}
              onProfileSelect={setRiskProfile}
            />
            <PortfolioForm
              onSubmit={(goalData, contributionData, preferencesData) => {
                setGoal(goalData);
                setContribution(contributionData);
                setPreferences(preferencesData);
              }}
              goal={goal}
              contribution={contribution}
              preferences={preferences}
            />
          </div>

          {/* Generate Button */}
          <div className="text-center mb-12">
            <Button 
              onClick={handleGenerateRecommendation}
              size="lg"
              className="px-8 py-3 text-lg"
              disabled={!riskProfile || !goal || !contribution}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Recommendation
            </Button>
          </div>

          {/* Results Section */}
          {recommendation && (
            <div className="space-y-8">
              {/* Recommendation and Allocation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <RecommendationCard
                    recommendation={recommendation}
                    onAccept={handleAcceptRecommendation}
                    onReject={handleRejectRecommendation}
                    onModify={() => {
                      toast({
                        title: "Modify Feature",
                        description: "Portfolio modification coming soon!"
                      });
                    }}
                  />
                </div>
                <div>
                  <AllocationPie allocation={recommendation.allocation} />
                </div>
              </div>

              {/* Projections */}
              {projections && goal && contribution && (
                <Card className="financial-card">
                  <CardHeader>
                    <CardTitle>Growth Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectionChart
                      projections={projections}
                      years={goal.timeHorizonYears}
                      currentLump={contribution.currentLumpSum}
                      monthlyContribution={contribution.monthlyContribution}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Rebalancing and Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RebalancePlan />
                <Card className="financial-card">
                  <CardHeader>
                    <CardTitle>Plan Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={handleAcceptRecommendation}
                      className="w-full"
                      variant="default"
                    >
                      Accept & Save Plan
                    </Button>
                    <ExportPlanBtn
                      recommendation={recommendation}
                      projections={projections}
                      goal={goal}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-16 text-center">
            <Card className="financial-card max-w-2xl mx-auto bg-muted/50">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> This is an educational illustration and not financial advice. 
                  Projections are based on assumptions and past performance does not guarantee future results. 
                  Please consult with a qualified financial advisor before making investment decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Save Plan Modal */}
      {showSaveModal && recommendation && projections && goal && (
        <SavePlanModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          recommendation={recommendation}
          projections={projections}
          goal={goal}
        />
      )}
    </div>
  );
};

export default PortfolioRecommendationPage;