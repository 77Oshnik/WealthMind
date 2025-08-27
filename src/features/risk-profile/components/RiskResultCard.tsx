import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Save, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { InvestorType, RiskProfileResult } from '../types';
import { SaveProfileModal } from './SaveProfileModal';

interface RiskResultCardProps {
  profile: RiskProfileResult;
  topDrivers: Array<{ dimension: string; score: number }>;
  notes?: string[];
  onSave: (name: string) => Promise<void>;
  onExport: () => void;
  onRecalculate: () => void;
}

const INVESTOR_TYPE_COLORS = {
  'Very Conservative': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Conservative': 'bg-green-500/10 text-green-600 border-green-500/20',
  'Balanced': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  'Growth': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'Aggressive': 'bg-red-500/10 text-red-600 border-red-500/20',
};

const INVESTOR_TYPE_DESCRIPTIONS = {
  'Very Conservative': 'You prefer stability and capital preservation over growth. Low volatility investments suit you best.',
  'Conservative': 'You lean towards safer investments but can accept some market fluctuations for modest growth.',
  'Balanced': 'You seek a middle ground between growth and stability, comfortable with moderate risk.',
  'Growth': 'You prioritize long-term growth and can handle significant market volatility for higher returns.',
  'Aggressive': 'You pursue maximum growth potential and are comfortable with high volatility and risk.',
};

export const RiskResultCard = ({
  profile,
  topDrivers,
  notes = [],
  onSave,
  onExport,
  onRecalculate
}: RiskResultCardProps) => {
  const { investorType, overall } = profile;

  return (
    <Card className="financial-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Risk Profile</CardTitle>
          <Badge className={INVESTOR_TYPE_COLORS[investorType]}>
            {investorType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">Overall Risk Score</span>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">
            {overall}/100
          </div>
          <p className="text-sm text-muted-foreground">
            {INVESTOR_TYPE_DESCRIPTIONS[investorType]}
          </p>
        </div>

        {/* Top Drivers */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Why this result?
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Top factors influencing your profile:
          </p>
          <div className="space-y-2">
            {topDrivers.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">{driver.dimension}</span>
                <Badge variant="outline">{Math.round(driver.score)}/100</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Special Notes */}
        {notes.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {notes.map((note, index) => (
                <div key={index}>{note}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <SaveProfileModal profile={profile} onSave={onSave}>
            <Button variant="outline" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </SaveProfileModal>
          <Button variant="outline" onClick={onExport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={onRecalculate} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recalculate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};