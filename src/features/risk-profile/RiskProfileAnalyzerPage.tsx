import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { RiskProfileQuiz } from './components/RiskProfileQuiz';
import { RiskResultCard } from './components/RiskResultCard';
import { RiskRadar } from './components/RiskRadar';
import { AllocationTable } from './components/AllocationTable';
import { SaveProfileModal } from './components/SaveProfileModal';

import { 
  saveRiskProfile, 
  exportRiskProfile, 
  loadRiskProfile,
  getSpecialNotes,
  getTopDrivers 
} from './services/riskProfile.service';
import { RiskProfileResult, DimensionScore, InvestorType } from './types';

const RiskProfileAnalyzerPage = () => {
  const [currentProfile, setCurrentProfile] = useState<RiskProfileResult | null>(null);
  const [showQuiz, setShowQuiz] = useState(true);

  // Load existing profile on mount
  useEffect(() => {
    const existing = loadRiskProfile();
    if (existing) {
      setCurrentProfile(existing);
      setShowQuiz(false);
    }
  }, []);

  const handleQuizComplete = (payload: {
    answers: Record<string, number>;
    dimensions: DimensionScore[];
    overall: number;
    investorType: InvestorType;
  }) => {
    const profile: RiskProfileResult = {
      answers: payload.answers,
      dimensions: payload.dimensions,
      overall: payload.overall,
      investorType: payload.investorType,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    setCurrentProfile(profile);
    setShowQuiz(false);
    
    toast.success(`Risk profile calculated: ${profile.investorType}`);
  };

  const handleSave = async (name: string = 'My Risk Profile') => {
    if (!currentProfile) return;
    
    try {
      await saveRiskProfile(currentProfile, name);
      toast.success('Risk profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  const handleSaveProfile = () => {
    // This will be handled by the SaveProfileModal
  };

  const handleExport = () => {
    if (!currentProfile) return;
    
    exportRiskProfile(currentProfile);
    toast.success('Profile exported as JSON');
  };

  const handleRecalculate = () => {
    setCurrentProfile(null);
    setShowQuiz(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prepare data for components
  const specialNotes = currentProfile ? getSpecialNotes(currentProfile.dimensions) : [];
  const topDrivers = currentProfile ? getTopDrivers(currentProfile.dimensions) : [];
  const radarData = currentProfile?.dimensions.map(d => ({
    label: d.label,
    value: d.score
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/investment-features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Investment Features
            </Link>
          </Button>
          
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Risk Assessment
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-ai-primary bg-clip-text text-transparent">
                Risk Profile Analyzer
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find your investor profile to tailor recommendations and make informed investment decisions.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Quiz or Results Summary */}
            <div className="space-y-6">
              {showQuiz ? (
                <RiskProfileQuiz onComplete={handleQuizComplete} />
              ) : currentProfile ? (
                <RiskResultCard
                  profile={currentProfile}
                  topDrivers={topDrivers}
                  notes={specialNotes}
                  onSave={handleSave}
                  onExport={handleExport}
                  onRecalculate={handleRecalculate}
                />) : null}
            </div>

            {/* Right Column - Visualizations */}
            {currentProfile && !showQuiz && (
              <div className="space-y-6">
                <RiskRadar dimensions={radarData} />
                <AllocationTable investorType={currentProfile.investorType} />
              </div>
            )}
          </div>

          {/* Call to Actions */}
          {currentProfile && !showQuiz && (
            <div className="mt-16 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-semibold">Ready to invest?</h3>
                <p className="text-muted-foreground">
                  Use your risk profile to get personalized portfolio recommendations and investment strategies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/investment/portfolio-recommendation" className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Use this profile in Portfolio Recommendations
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/investment-features" className="flex items-center gap-2">
                      <ArrowLeft className="w-5 h-5" />
                      Go back to Features Hub
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskProfileAnalyzerPage;