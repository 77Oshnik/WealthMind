import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Edit3, TrendingUp, AlertCircle } from 'lucide-react';

import { PortfolioRecommendation } from '../types';
import { formatPercentage, getAssetClassNames } from '../utils';

interface RecommendationCardProps {
  recommendation: PortfolioRecommendation;
  onAccept: () => void;
  onReject: () => void;
  onModify: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAccept,
  onReject,
  onModify
}) => {
  const assetNames = getAssetClassNames();
  const confidenceColors = {
    low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    high: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Portfolio Recommendation
          </span>
          <Badge className={confidenceColors[recommendation.confidence]}>
            {recommendation.confidence} confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Investor Type */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Recommended for:</span>
            <Badge variant="outline" className="text-sm">
              {recommendation.investorType} Investor
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{recommendation.rationale}</p>
        </div>

        {/* Allocation Table */}
        <div className="space-y-3">
          <h4 className="font-medium">Recommended Allocation</h4>
          <div className="grid gap-3">
            {Object.entries(recommendation.allocation).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded">
                <span className="text-sm font-medium">
                  {assetNames[key as keyof typeof assetNames]}
                </span>
                <span className="text-sm font-semibold">
                  {formatPercentage(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Instruments */}
        <div className="space-y-3">
          <h4 className="font-medium">Suggested Instruments</h4>
          <div className="space-y-2">
            {Object.entries(recommendation.suggestedInstruments)
              .filter(([key, _]) => recommendation.allocation[key as keyof typeof recommendation.allocation] > 0)
              .map(([key, instrument]) => (
                <div key={key} className="text-sm text-muted-foreground bg-muted/20 rounded p-2">
                  <span className="font-medium">
                    {assetNames[key as keyof typeof assetNames]}:
                  </span>{' '}
                  {instrument}
                </div>
              ))}
          </div>
        </div>

        {/* Adjustments */}
        {recommendation.adjustments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Applied Adjustments
            </h4>
            <div className="space-y-1">
              {recommendation.adjustments.map((adjustment, index) => (
                <div key={index} className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded p-2">
                  • {adjustment}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t">
          <Button onClick={onAccept} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Accept & Save
          </Button>
          <Button onClick={onModify} variant="outline" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Modify
          </Button>
          <Button onClick={onReject} variant="outline" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
        </div>

        {/* Confidence Explanation */}
        <div className="text-xs text-muted-foreground bg-muted/20 rounded p-3">
          <strong>Confidence Level:</strong> {recommendation.confidence === 'high' 
            ? 'High confidence based on clear time horizon, adequate contributions, and standard risk profile.'
            : recommendation.confidence === 'medium'
            ? 'Medium confidence - some factors may need adjustment for optimal outcomes.'
            : 'Lower confidence due to short time horizon, limited contributions, or extreme risk profile.'}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;