import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { RiskProfileResult, InvestorType } from '../../risk-profile/types';
import { loadRiskProfile } from '../../risk-profile/services/riskProfile.service';

interface RiskProfileSelectorProps {
  selectedProfile: RiskProfileResult | { investorType: InvestorType; manual: true } | null;
  onProfileSelect: (profile: RiskProfileResult | { investorType: InvestorType; manual: true }) => void;
}

const RiskProfileSelector: React.FC<RiskProfileSelectorProps> = ({
  selectedProfile,
  onProfileSelect
}) => {
  const [savedProfile, setSavedProfile] = useState<RiskProfileResult | null>(null);
  const [useManual, setUseManual] = useState(false);
  const [manualType, setManualType] = useState<InvestorType>('Balanced');
  const [manualScore, setManualScore] = useState([50]);

  useEffect(() => {
    // Try to load saved risk profile
    const profile = loadRiskProfile();
    if (profile) {
      setSavedProfile(profile);
    }
  }, []);

  const handleUseSavedProfile = () => {
    if (savedProfile) {
      onProfileSelect(savedProfile);
      setUseManual(false);
    }
  };

  const handleUseManualProfile = () => {
    const manualProfile = {
      investorType: manualType,
      manual: true as const
    };
    onProfileSelect(manualProfile);
    setUseManual(true);
  };

  const handleManualScoreChange = (value: number[]) => {
    setManualScore(value);
    const score = value[0];
    let type: InvestorType = 'Balanced';
    
    if (score <= 20) type = 'Very Conservative';
    else if (score <= 40) type = 'Conservative';
    else if (score <= 60) type = 'Balanced';
    else if (score <= 80) type = 'Growth';
    else type = 'Aggressive';
    
    setManualType(type);
    
    const manualProfile = {
      investorType: type,
      manual: true as const
    };
    onProfileSelect(manualProfile);
  };

  const getProfileColor = (type: InvestorType) => {
    const colors = {
      'Very Conservative': 'text-blue-600',
      'Conservative': 'text-green-600',
      'Balanced': 'text-yellow-600',
      'Growth': 'text-orange-600',
      'Aggressive': 'text-red-600'
    };
    return colors[type];
  };

  const getProfileDescription = (type: InvestorType) => {
    const descriptions = {
      'Very Conservative': 'Prioritizes capital preservation, minimal risk tolerance',
      'Conservative': 'Prefers stable returns, low to moderate risk tolerance',
      'Balanced': 'Seeks balance between growth and stability',
      'Growth': 'Focuses on long-term growth, comfortable with volatility',
      'Aggressive': 'Maximizes growth potential, high risk tolerance'
    };
    return descriptions[type];
  };

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Risk Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Saved Profile Section */}
        {savedProfile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <h4 className="font-medium">Saved Risk Profile Found</h4>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Investor Type:</span>
                <Badge className={getProfileColor(savedProfile.investorType)}>
                  {savedProfile.investorType}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Score:</span>
                <span className="text-sm">{savedProfile.overall}/100</span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Completed: {new Date(savedProfile.timestamp).toLocaleDateString()}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {getProfileDescription(savedProfile.investorType)}
              </p>
            </div>

            <Button 
              onClick={handleUseSavedProfile}
              variant={selectedProfile === savedProfile ? "default" : "outline"}
              className="w-full"
            >
              {selectedProfile === savedProfile ? "Selected" : "Use This Profile"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <h4 className="font-medium">No Saved Risk Profile</h4>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Complete the Risk Profile Analyzer to get personalized recommendations based on your detailed risk assessment.
            </p>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/features/risk-profile">
                <BarChart3 className="w-4 h-4 mr-2" />
                Take Risk Profile Quiz
              </Link>
            </Button>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Manual Selection */}
        <div className="space-y-4">
          <h4 className="font-medium">Manual Risk Selection</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Investor Type</Label>
              <Select 
                value={manualType} 
                onValueChange={(value: InvestorType) => {
                  setManualType(value);
                  handleUseManualProfile();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very Conservative">Very Conservative</SelectItem>
                  <SelectItem value="Conservative">Conservative</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Risk Level: {manualScore[0]}% aggressive</Label>
              <Slider
                value={manualScore}
                onValueChange={handleManualScoreChange}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                {getProfileDescription(manualType)}
              </p>
            </div>
          </div>
        </div>

        {/* Current Selection Status */}
        {selectedProfile && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Selection:</span>
              <Badge className="bg-primary/20 text-primary">
                {selectedProfile.investorType}
              </Badge>
            </div>
            {'manual' in selectedProfile && selectedProfile.manual && (
              <p className="text-xs text-muted-foreground mt-1">Manual selection</p>
            )}
          </div>
        )}

        {/* Hint */}
        <div className="text-xs text-muted-foreground bg-muted/30 rounded p-3">
          <strong>Tip:</strong> If you've completed the Risk Profile Analyzer, loading it will provide more accurate recommendations based on your detailed assessment of risk tolerance, capacity, and investment knowledge.
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskProfileSelector;