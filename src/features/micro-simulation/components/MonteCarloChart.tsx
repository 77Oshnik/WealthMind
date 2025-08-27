import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Eye, EyeOff, TrendingUp, AlertTriangle } from 'lucide-react';
import { MonteCarloResult, SimulationResult } from '../types';
import { formatCurrency, formatPercentage } from '../utils';

interface MonteCarloChartProps {
  result: SimulationResult | MonteCarloResult | null;
}

function isMonteCarloResult(result: SimulationResult | MonteCarloResult): result is MonteCarloResult {
  return 'percentiles' in result;
}

export function MonteCarloChart({ result }: MonteCarloChartProps) {
  const [showContributionsLine, setShowContributionsLine] = useState(true);
  
  if (!result) {
    return (
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Projection Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Run a simulation to see projection analysis
        </CardContent>
      </Card>
    );
  }
  
  const isMonteCarloData = isMonteCarloResult(result);
  const chartData = isMonteCarloData ? result.percentiles : 
    result.yearlySnapshots.map(s => ({ 
      year: s.year, 
      p50: s.portfolioValue,
      p10: s.portfolioValue * 0.8, // Rough approximation for deterministic
      p90: s.portfolioValue * 1.2 
    }));
  
  const maxValue = Math.max(...chartData.map(d => d.p90));
  const contributionsData = result.yearlySnapshots;
  
  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {isMonteCarloData ? 'Monte Carlo Analysis' : 'Deterministic Projection'}
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContributionsLine(!showContributionsLine)}
            >
              {showContributionsLine ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              Contributions
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics for Monte Carlo */}
        {isMonteCarloData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">90th Percentile</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(result.finalStats.p90)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-sm text-muted-foreground">Median</div>
              <div className="text-lg font-semibold text-primary">
                {formatCurrency(result.finalStats.median)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">10th Percentile</div>
              <div className="text-lg font-semibold text-amber-600">
                {formatCurrency(result.finalStats.p10)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-secondary/5 rounded-lg">
              <div className="text-sm text-muted-foreground">Std. Deviation</div>
              <div className="text-lg font-semibold text-secondary">
                {formatCurrency(result.finalStats.stddev)}
              </div>
            </div>
          </div>
        )}
        
        {/* Chart */}
        <div className="relative h-64 bg-background/50 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Confidence band for Monte Carlo */}
            {isMonteCarloData && (
              <path
                d={`M ${chartData.map((d, i) => 
                  `${(i / (chartData.length - 1)) * 400},${200 - (d.p10 / maxValue) * 200}`
                ).join(' L ')} L ${chartData.map((d, i) => 
                  `${((chartData.length - 1 - i) / (chartData.length - 1)) * 400},${200 - (d.p90 / maxValue) * 200}`
                ).reverse().join(' L ')} Z`}
                fill="hsl(var(--primary))"
                fillOpacity="0.1"
                stroke="none"
              />
            )}
            
            {/* Median/deterministic line */}
            <path
              d={`M ${chartData.map((d, i) => 
                `${(i / (chartData.length - 1)) * 400},${200 - (d.p50 / maxValue) * 200}`
              ).join(' L ')}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            
            {/* Contributions line */}
            {showContributionsLine && (
              <path
                d={`M ${contributionsData.map((d, i) => 
                  `${(i / (contributionsData.length - 1)) * 400},${200 - (d.contributions / maxValue) * 200}`
                ).join(' L ')}`}
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            )}
            
            {/* Upper bound line for Monte Carlo */}
            {isMonteCarloData && (
              <path
                d={`M ${chartData.map((d, i) => 
                  `${(i / (chartData.length - 1)) * 400},${200 - (d.p90 / maxValue) * 200}`
                ).join(' L ')}`}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="1"
                opacity="0.7"
              />
            )}
            
            {/* Lower bound line for Monte Carlo */}
            {isMonteCarloData && (
              <path
                d={`M ${chartData.map((d, i) => 
                  `${(i / (chartData.length - 1)) * 400},${200 - (d.p10 / maxValue) * 200}`
                ).join(' L ')}`}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="1"
                opacity="0.7"
              />
            )}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground -ml-2">
            <div>{formatCurrency(maxValue)}</div>
            <div>{formatCurrency(maxValue * 0.75)}</div>
            <div>{formatCurrency(maxValue * 0.5)}</div>
            <div>{formatCurrency(maxValue * 0.25)}</div>
            <div>$0</div>
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground -mb-6">
            <div>0</div>
            <div>{Math.floor(result.inputs.durationYears / 2)}</div>
            <div>{result.inputs.durationYears} years</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span>{isMonteCarloData ? 'Median' : 'Projected Value'}</span>
          </div>
          
          {isMonteCarloData && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/20 border border-accent"></div>
                <span>10th-90th Percentile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-accent opacity-70"></div>
                <span>Confidence Bounds</span>
              </div>
            </>
          )}
          
          {showContributionsLine && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-secondary border-dashed border-t"></div>
              <span>Contributions Only</span>
            </div>
          )}
        </div>
        
        {/* Insights */}
        <div className="space-y-2">
          {isMonteCarloData && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <div className="font-medium">Confidence Range</div>
                  <div>
                    There's an 80% probability your final value will be between{' '}
                    <strong>{formatCurrency(result.finalStats.p10)}</strong> and{' '}
                    <strong>{formatCurrency(result.finalStats.p90)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {result.finalValue < result.totalContributions && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <div className="font-medium">Note</div>
                  <div>
                    The projection shows potential for negative returns. Consider adjusting your 
                    investment timeline or allocation for better risk-adjusted returns.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}