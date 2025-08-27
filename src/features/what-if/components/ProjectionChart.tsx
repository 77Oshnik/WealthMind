import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatCurrency } from '../utils';
import type { SimulationResults, SimulationMode } from '../types';

interface ProjectionChartProps {
  results: SimulationResults | null;
  mode: SimulationMode;
  showContributionsOnly: boolean;
  onToggleContributionsOnly: () => void;
  showReal: boolean;
}

export default function ProjectionChart({ 
  results, 
  mode, 
  showContributionsOnly, 
  onToggleContributionsOnly,
  showReal 
}: ProjectionChartProps) {
  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Run a simulation to see projections
          </div>
        </CardContent>
      </Card>
    );
  }

  const inflationFactor = (year: number) => showReal ? Math.pow(1.06, year) : 1;

  const chartData = results.yearlySnapshots.map(snapshot => ({
    year: snapshot.year,
    contributions: snapshot.contributions / inflationFactor(snapshot.year),
    total: snapshot.total / inflationFactor(snapshot.year),
    growth: (snapshot.total - snapshot.contributions) / inflationFactor(snapshot.year),
    ...(results.percentiles && {
      p10: results.percentiles.p10[snapshot.year] / inflationFactor(snapshot.year),
      p50: results.percentiles.p50[snapshot.year] / inflationFactor(snapshot.year),
      p90: results.percentiles.p90[snapshot.year] / inflationFactor(snapshot.year)
    })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Year ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Projection</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{showReal ? 'Real' : 'Nominal'} Values</Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleContributionsOnly}
            >
              {showContributionsOnly ? 'Show Growth' : 'Contributions Only'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {mode === 'montecarlo' && results.percentiles ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('₹', '₹')} />
                <Tooltip content={<CustomTooltip />} />
                
                {/* 10th-90th percentile band */}
                <Area
                  type="monotone"
                  dataKey="p90"
                  stackId="1"
                  stroke="none"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="p10"
                  stackId="1"
                  stroke="none"
                  fill="hsl(var(--background))"
                  fillOpacity={1}
                />
                
                {/* Median line */}
                <Line
                  type="monotone"
                  dataKey="p50"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Median"
                  dot={false}
                />
                
                {showContributionsOnly && (
                  <Line
                    type="monotone"
                    dataKey="contributions"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Contributions"
                    dot={false}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('₹', '₹')} />
                <Tooltip content={<CustomTooltip />} />
                
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Portfolio Value"
                  dot={false}
                />
                
                <Line
                  type="monotone"
                  dataKey="contributions"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Contributions"
                  dot={false}
                />
                
                {!showContributionsOnly && (
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name="Growth"
                    dot={false}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>{mode === 'montecarlo' ? 'Median' : 'Portfolio Value'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-secondary"></div>
            <span>Contributions</span>
          </div>
          {mode === 'deterministic' && !showContributionsOnly && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded"></div>
              <span>Growth</span>
            </div>
          )}
          {mode === 'montecarlo' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/20 rounded"></div>
              <span>10th-90th percentile</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}