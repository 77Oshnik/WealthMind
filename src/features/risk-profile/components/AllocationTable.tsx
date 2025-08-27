import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Info } from 'lucide-react';
import { InvestorType } from '../types';
import { getAllocationBands } from '../services/riskProfile.service';

interface AllocationTableProps {
  investorType: InvestorType;
}

export const AllocationTable = ({ investorType }: AllocationTableProps) => {
  const allocation = getAllocationBands(investorType);

  const allocations = [
    { 
      category: 'Equity', 
      range: allocation.equity, 
      description: 'Stocks, equity mutual funds, ETFs',
      color: 'bg-primary/10 text-primary border-primary/20'
    },
    { 
      category: 'Debt (Bonds)', 
      range: allocation.debt, 
      description: 'Government bonds, corporate bonds, debt funds',
      color: 'bg-success/10 text-success border-success/20'
    },
    { 
      category: 'Gold/Alternatives', 
      range: allocation.gold, 
      description: 'Precious metals, REITs, commodities',
      color: 'bg-warning/10 text-warning border-warning/20'
    },
    { 
      category: 'Cash Buffer', 
      range: allocation.cash, 
      description: 'Savings account, liquid funds, emergency fund',
      color: 'bg-muted text-muted-foreground border-border'
    },
  ];

  return (
    <Card className="financial-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary" />
          <CardTitle>Suggested Allocation Bands</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Strategic asset allocation for <strong>{investorType}</strong> investor profile
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {allocations.map((item) => (
            <div 
              key={item.category}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{item.category}</span>
                  <Badge className={item.color} variant="outline">
                    {item.range}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-muted">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This is an educational illustration and not financial advice. 
                Consult with a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};