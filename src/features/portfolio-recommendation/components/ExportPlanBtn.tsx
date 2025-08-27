import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { PortfolioRecommendation, ProjectionResults, Goal } from '../types';
import { exportPlanAsJSON, formatCurrency } from '../utils';

interface ExportPlanBtnProps {
  recommendation: PortfolioRecommendation;
  projections: ProjectionResults | null;
  goal: Goal;
}

const ExportPlanBtn: React.FC<ExportPlanBtnProps> = ({
  recommendation,
  projections,
  goal
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const exportData = {
        id: `export_${Date.now()}`,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        
        // Goal Information
        goal: {
          name: goal.goalName,
          type: goal.goalType,
          targetAmount: goal.targetAmount,
          timeHorizonYears: goal.timeHorizonYears,
          priority: goal.priority,
          riskOverride: goal.riskOverride
        },
        
        // Recommendation
        recommendation: {
          investorType: recommendation.investorType,
          allocation: recommendation.allocation,
          rationale: recommendation.rationale,
          adjustments: recommendation.adjustments,
          confidence: recommendation.confidence,
          suggestedInstruments: recommendation.suggestedInstruments
        },
        
        // Projections (if available)
        projections: projections ? {
          timeHorizon: goal.timeHorizonYears,
          scenarios: {
            conservative: {
              finalValue: projections.low[goal.timeHorizonYears]?.value || 0,
              yearlyValues: projections.low
            },
            expected: {
              finalValue: projections.medium[goal.timeHorizonYears]?.value || 0,
              yearlyValues: projections.medium
            },
            optimistic: {
              finalValue: projections.high[goal.timeHorizonYears]?.value || 0,
              yearlyValues: projections.high
            }
          }
        } : null,
        
        // Summary Statistics
        summary: projections ? {
          expectedFinalValue: formatCurrency(projections.medium[goal.timeHorizonYears]?.value || 0),
          conservativeRange: formatCurrency(projections.low[goal.timeHorizonYears]?.value || 0),
          optimisticRange: formatCurrency(projections.high[goal.timeHorizonYears]?.value || 0),
          primaryAllocation: `${recommendation.allocation.domesticEquity + recommendation.allocation.internationalEquity}% Equity, ${recommendation.allocation.bonds}% Bonds`,
          riskProfile: recommendation.investorType
        } : null,
        
        // Metadata
        metadata: {
          generatedBy: 'Portfolio Recommendation Tool',
          disclaimer: 'This is an educational illustration and not financial advice. Please consult with a qualified financial advisor before making investment decisions.',
          dataVersion: '1.0.0',
          exportedAt: new Date().toISOString()
        }
      };

      const filename = `portfolio-plan-${goal.goalName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      
      exportPlanAsJSON(exportData, filename);
      
      toast({
        title: "Plan Exported Successfully!",
        description: `Your investment plan has been downloaded as ${filename}`
      });
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export your plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-3">
      <Button onClick={handleExport} variant="outline" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Export Plan as JSON
      </Button>
      
      <div className="text-xs text-muted-foreground bg-muted/30 rounded p-3">
        <div className="flex items-start gap-2">
          <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Export Details</p>
            <p>Downloads a complete JSON file containing your goal, allocation, projections, and recommendations. 
               This file can be imported into other financial planning tools or kept as a backup.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPlanBtn;