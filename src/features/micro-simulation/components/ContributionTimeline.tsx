import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { SimulationResult, MonteCarloResult } from '../types';
import { formatCurrency, formatPercentage } from '../utils';

interface ContributionTimelineProps {
  result: SimulationResult | MonteCarloResult | null;
}

export function ContributionTimeline({ result }: ContributionTimelineProps) {
  if (!result) {
    return (
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Year-by-Year Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
          Run a simulation to see the year-by-year breakdown
        </CardContent>
      </Card>
    );
  }
  
  // Filter out year 0 for cleaner display and only show every few years for long timeframes
  const displayData = result.yearlySnapshots.filter((_, index) => {
    if (result.inputs.durationYears <= 10) return index > 0; // Show all years for short timeframes
    if (result.inputs.durationYears <= 20) return index > 0 && index % 2 === 0; // Show every 2 years
    return index > 0 && index % 5 === 0; // Show every 5 years for long timeframes
  });
  
  // Always include the final year if it wasn't included
  const finalYear = result.yearlySnapshots[result.yearlySnapshots.length - 1];
  if (displayData.length > 0 && displayData[displayData.length - 1].year !== finalYear.year) {
    displayData.push(finalYear);
  }
  
  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Year-by-Year Breakdown
          <Badge variant="secondary" className="ml-auto">
            {displayData.length} milestones shown
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Total Contributed</TableHead>
                <TableHead className="text-right">Portfolio Value</TableHead>
                <TableHead className="text-right">Investment Returns</TableHead>
                <TableHead className="text-right">Return %</TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((snapshot, index) => {
                const returnPercentage = snapshot.contributions > 0 ? 
                  (snapshot.returns / snapshot.contributions) : 0;
                
                const previousSnapshot = index > 0 ? displayData[index - 1] : null;
                const yearOverYearGrowth = previousSnapshot ? 
                  snapshot.portfolioValue - previousSnapshot.portfolioValue : 0;
                
                const isPositiveReturns = snapshot.returns > 0;
                const isPositiveGrowth = yearOverYearGrowth > 0;
                
                return (
                  <TableRow key={snapshot.year} className="hover:bg-accent/5">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        Year {snapshot.year}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right font-medium">
                      {formatCurrency(snapshot.contributions)}
                    </TableCell>
                    
                    <TableCell className="text-right font-semibold">
                      <div className="flex items-center justify-end gap-1">
                        {formatCurrency(snapshot.portfolioValue)}
                        {snapshot.year === finalYear.year && (
                          <Badge className="bg-primary/10 text-primary text-xs">Final</Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 ${
                        isPositiveReturns ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isPositiveReturns ? 
                          <TrendingUp className="w-3 h-3" /> : 
                          <TrendingDown className="w-3 h-3" />
                        }
                        {formatCurrency(Math.abs(snapshot.returns))}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <Badge 
                        variant={isPositiveReturns ? "default" : "destructive"}
                        className={isPositiveReturns ? "bg-green-100 text-green-800" : ""}
                      >
                        {isPositiveReturns ? '+' : ''}{formatPercentage(returnPercentage)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      {previousSnapshot ? (
                        <div className={`text-sm ${
                          isPositiveGrowth ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositiveGrowth ? '+' : ''}{formatCurrency(yearOverYearGrowth)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="text-sm text-muted-foreground">Average Annual Contribution</div>
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(result.totalContributions / result.inputs.durationYears)}
            </div>
          </div>
          
          <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10">
            <div className="text-sm text-muted-foreground">Total Return on Investment</div>
            <div className="text-lg font-semibold text-secondary">
              {formatPercentage(result.totalReturns / result.totalContributions)}
            </div>
          </div>
          
          <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
            <div className="text-sm text-muted-foreground">Compound Annual Growth Rate</div>
            <div className="text-lg font-semibold text-accent">
              {formatPercentage(
                Math.pow(result.finalValue / (result.inputs.lumpSum || result.monthlyContribution * 12), 
                         1 / result.inputs.durationYears) - 1
              )}
            </div>
          </div>
        </div>
        
        {/* Note about filtered data */}
        {result.inputs.durationYears > 10 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              * Showing key milestones for clarity. All years are included in calculations.
              {result.inputs.durationYears > 20 && " (Every 5th year displayed)"}
              {result.inputs.durationYears > 10 && result.inputs.durationYears <= 20 && " (Every 2nd year displayed)"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}