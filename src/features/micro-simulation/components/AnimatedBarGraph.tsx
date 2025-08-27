import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp } from 'lucide-react';
import { SimulationResult, YearlySnapshot } from '../types';
import { formatCurrency } from '../utils';

interface AnimatedBarGraphProps {
  result: SimulationResult | null;
  isAnimating: boolean;
}

export function AnimatedBarGraph({ result, isAnimating }: AnimatedBarGraphProps) {
  const [animatedData, setAnimatedData] = useState<YearlySnapshot[]>([]);
  const [currentYear, setCurrentYear] = useState(0);
  
  useEffect(() => {
    if (!result || !isAnimating) {
      setAnimatedData(result?.yearlySnapshots || []);
      setCurrentYear(result?.inputs.durationYears || 0);
      return;
    }
    
    // Animate bars appearing year by year
    setAnimatedData([]);
    setCurrentYear(0);
    
    const animateStep = (year: number) => {
      if (year > result.inputs.durationYears) return;
      
      setAnimatedData(result.yearlySnapshots.slice(0, year + 1));
      setCurrentYear(year);
      
      setTimeout(() => animateStep(year + 1), 300);
    };
    
    setTimeout(() => animateStep(0), 100);
  }, [result, isAnimating]);
  
  if (!result) {
    return (
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Investment Growth
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Run a simulation to see your investment growth
        </CardContent>
      </Card>
    );
  }
  
  const maxValue = Math.max(...animatedData.map(d => d.portfolioValue));
  const finalSnapshot = animatedData[animatedData.length - 1];
  
  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Investment Growth Over Time
          {isAnimating && (
            <Badge variant="secondary" className="ml-auto">
              Year {currentYear}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        {finalSnapshot && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-lg font-semibold text-primary">
                {formatCurrency(finalSnapshot.portfolioValue)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-secondary/5 rounded-lg">
              <div className="text-sm text-muted-foreground">Contributions</div>
              <div className="text-lg font-semibold text-secondary">
                {formatCurrency(finalSnapshot.contributions)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-accent/5 rounded-lg">
              <div className="text-sm text-muted-foreground">Returns</div>
              <div className="text-lg font-semibold text-accent">
                {formatCurrency(finalSnapshot.returns)}
              </div>
            </div>
          </div>
        )}
        
        {/* Bar Chart */}
        <div className="relative h-64 bg-background/50 rounded-lg p-4">
          <div className="flex items-end justify-between h-full gap-1">
            {animatedData.map((snapshot, index) => {
              const contributionHeight = (snapshot.contributions / maxValue) * 100;
              const returnsHeight = (snapshot.returns / maxValue) * 100;
              const isLastBar = index === animatedData.length - 1 && isAnimating;
              
              return (
                <div
                  key={snapshot.year}
                  className="relative flex-1 group cursor-pointer"
                  style={{ maxWidth: '40px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border p-2 whitespace-nowrap">
                      <div className="font-medium">Year {snapshot.year}</div>
                      <div className="space-y-1 mt-1">
                        <div className="flex justify-between gap-4">
                          <span>Value:</span>
                          <span className="font-medium">{formatCurrency(snapshot.portfolioValue)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Contributed:</span>
                          <span className="text-secondary">{formatCurrency(snapshot.contributions)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Returns:</span>
                          <span className="text-accent">{formatCurrency(snapshot.returns)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bar Stack */}
                  <div className="relative h-full flex flex-col justify-end">
                    {/* Returns (top) */}
                    {snapshot.returns > 0 && (
                      <div
                        className={`bg-accent rounded-t transition-all duration-500 ${
                          isLastBar ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          height: `${returnsHeight}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    )}
                    
                    {/* Contributions (bottom) */}
                    <div
                      className={`bg-secondary transition-all duration-500 ${
                        snapshot.returns <= 0 ? 'rounded-t' : ''
                      } ${isLastBar ? 'animate-pulse' : ''}`}
                      style={{ 
                        height: `${contributionHeight}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                  
                  {/* Year label */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                    {snapshot.year}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground -ml-2">
            <div>{formatCurrency(maxValue)}</div>
            <div>{formatCurrency(maxValue * 0.75)}</div>
            <div>{formatCurrency(maxValue * 0.5)}</div>
            <div>{formatCurrency(maxValue * 0.25)}</div>
            <div>$0</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded"></div>
            <span>Contributions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded"></div>
            <span>Investment Returns</span>
          </div>
        </div>
        
        {/* Growth Insight */}
        {finalSnapshot && finalSnapshot.returns > finalSnapshot.contributions * 0.1 && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800 dark:text-green-200">
              Your investments generated {formatCurrency(finalSnapshot.returns)} in returns - 
              that's {((finalSnapshot.returns / finalSnapshot.contributions) * 100).toFixed(0)}% growth on your contributions!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}