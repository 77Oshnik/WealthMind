import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils';
import type { SimulationResults, WhatIfInputs } from '../types';

interface ResultsDashboardProps {
  results: SimulationResults | null;
  inputs: WhatIfInputs;
  showReal: boolean;
  onToggleReal: () => void;
}

export default function ResultsDashboard({ results, inputs, showReal, onToggleReal }: ResultsDashboardProps) {
  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Run a simulation to see results</p>
        </CardContent>
      </Card>
    );
  }

  const finalValue = showReal ? results.finalValueReal : results.finalValueNominal;
  const successRate = results.successProbability;
  const hasTarget = inputs.targetAmount && inputs.targetAmount > 0;

  const kpis = [
    {
      title: `Final Value (${showReal ? 'Real' : 'Nominal'})`,
      value: formatCurrency(finalValue),
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'Total Contributions',
      value: formatCurrency(results.totalContributions),
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Total Growth',
      value: formatCurrency(results.totalGrowth),
      icon: TrendingUp,
      color: results.totalGrowth > 0 ? 'text-green-600' : 'text-red-600'
    }
  ];

  if (hasTarget && successRate !== undefined) {
    kpis.push({
      title: 'Success Probability',
      value: formatPercent(successRate, 0),
      icon: Target,
      color: successRate > 0.7 ? 'text-green-600' : successRate > 0.4 ? 'text-yellow-600' : 'text-red-600'
    });
  }

  if (results.requiredMonthly) {
    kpis.push({
      title: 'Required Monthly',
      value: formatCurrency(results.requiredMonthly),
      icon: DollarSign,
      color: 'text-orange-600'
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Results</CardTitle>
          <button 
            onClick={onToggleReal}
            className="text-sm text-primary hover:underline"
          >
            Show {showReal ? 'Nominal' : 'Real'} Values
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kpis.map((kpi, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className={`${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="font-semibold">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        {results.worstCase && results.bestCase && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Monte Carlo Range (10th-90th percentile)</h4>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span>Worst: {formatCurrency(showReal ? results.worstCase / Math.pow(1.06, inputs.timeHorizonYears) : results.worstCase)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Best: {formatCurrency(showReal ? results.bestCase / Math.pow(1.06, inputs.timeHorizonYears) : results.bestCase)}</span>
              </span>
            </div>
          </div>
        )}

        {hasTarget && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">Target: {formatCurrency(inputs.targetAmount!)}</span>
              <span className="text-sm">
                {finalValue >= inputs.targetAmount! ? (
                  <Badge className="bg-green-100 text-green-800">Target Met</Badge>
                ) : (
                  <Badge variant="destructive">
                    Shortfall: {formatCurrency(inputs.targetAmount! - finalValue)}
                  </Badge>
                )}
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Disclaimer:</strong> These projections are illustrative only and not financial advice. 
          Actual returns may vary significantly from assumptions.</p>
        </div>
      </CardContent>
    </Card>
  );
}