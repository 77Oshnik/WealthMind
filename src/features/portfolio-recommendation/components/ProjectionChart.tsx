import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

import { ProjectionResults } from '../types';
import { formatCurrency } from '../utils';

interface ProjectionChartProps {
  projections: ProjectionResults;
  years: number;
  currentLump: number;
  monthlyContribution: number;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({
  projections,
  years,
  currentLump,
  monthlyContribution
}) => {
  const [activeScenarios, setActiveScenarios] = useState({
    low: true,
    medium: true,
    high: true
  });
  const [showContributions, setShowContributions] = useState(true);

  // Prepare chart data
  const chartData = Array.from({ length: years + 1 }, (_, index) => {
    const year = index;
    const contributionTotal = currentLump + (monthlyContribution * 12 * year);
    
    return {
      year,
      low: projections.low[year]?.value || 0,
      medium: projections.medium[year]?.value || 0,
      high: projections.high[year]?.value || 0,
      contributions: showContributions ? contributionTotal : 0
    };
  });

  const toggleScenario = (scenario: keyof typeof activeScenarios) => {
    setActiveScenarios(prev => ({
      ...prev,
      [scenario]: !prev[scenario]
    }));
  };

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-4 space-y-2">
          <p className="font-medium">Year {label}</p>
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm capitalize">{entry.dataKey}</span>
              </div>
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const finalValues = {
    low: projections.low[years]?.value || 0,
    medium: projections.medium[years]?.value || 0,
    high: projections.high[years]?.value || 0
  };

  const totalContributions = currentLump + (monthlyContribution * 12 * years);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Growth Projections</h3>
          <Badge variant="outline" className="text-xs">
            {years} Year Horizon
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="contributions"
              checked={showContributions}
              onCheckedChange={setShowContributions}
            />
            <Label htmlFor="contributions" className="text-sm">Show Total Contributions</Label>
          </div>
        </div>
      </div>

      {/* Scenario Toggles */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeScenarios.low ? "default" : "outline"}
          onClick={() => toggleScenario('low')}
          className="text-xs"
        >
          <TrendingDown className="w-3 h-3 mr-1" />
          Conservative
        </Button>
        <Button
          size="sm"
          variant={activeScenarios.medium ? "default" : "outline"}
          onClick={() => toggleScenario('medium')}
          className="text-xs"
        >
          <Minus className="w-3 h-3 mr-1" />
          Expected
        </Button>
        <Button
          size="sm"
          variant={activeScenarios.high ? "default" : "outline"}
          onClick={() => toggleScenario('high')}
          className="text-xs"
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          Optimistic
        </Button>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
              label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={renderCustomTooltip} />
            
            {activeScenarios.low && (
              <Line
                type="monotone"
                dataKey="low"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            )}
            
            {activeScenarios.medium && (
              <Line
                type="monotone"
                dataKey="medium"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={false}
              />
            )}
            
            {activeScenarios.high && (
              <Line
                type="monotone"
                dataKey="high"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={false}
                strokeDasharray="10 5"
              />
            )}
            
            {showContributions && (
              <Line
                type="monotone"
                dataKey="contributions"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                dot={false}
                strokeDasharray="2 2"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted/30">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium">Conservative Scenario</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(finalValues.low)}</p>
            <p className="text-xs text-muted-foreground">
              {finalValues.low > totalContributions 
                ? `+${formatCurrency(finalValues.low - totalContributions)} gain` 
                : `${formatCurrency(totalContributions - finalValues.low)} loss`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Expected Scenario</span>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(finalValues.medium)}</p>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(finalValues.medium - totalContributions)} gain
            </p>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Optimistic Scenario</span>
            </div>
            <p className="text-lg font-bold text-accent">{formatCurrency(finalValues.high)}</p>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(finalValues.high - totalContributions)} gain
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <div className="bg-muted/20 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-sm">Key Insights</h4>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div>• Total contributions over {years} years: {formatCurrency(totalContributions)}</div>
          <div>• Expected annual return: {((Math.pow(finalValues.medium / totalContributions, 1/years) - 1) * 100).toFixed(1)}%</div>
          <div>• Potential return range: {formatCurrency(finalValues.low)} - {formatCurrency(finalValues.high)}</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-3">
        <strong>Important:</strong> These projections are illustrative and based on historical assumptions. 
        Actual returns may vary significantly and past performance does not guarantee future results.
      </div>
    </div>
  );
};

export default ProjectionChart;