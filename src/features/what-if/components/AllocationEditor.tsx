import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import type { AssetAllocation } from '../types';

interface AllocationEditorProps {
  allocation: AssetAllocation;
  onAllocationChange: (allocation: AssetAllocation) => void;
  onImportFromPortfolio: () => void;
  canImportFromPortfolio: boolean;
}

export default function AllocationEditor({
  allocation,
  onAllocationChange,
  onImportFromPortfolio,
  canImportFromPortfolio
}: AllocationEditorProps) {
  const updateAllocation = (field: keyof AssetAllocation, value: number) => {
    onAllocationChange({ ...allocation, [field]: value });
  };

  const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
  const isValidTotal = Math.abs(total - 100) < 0.5;

  const assets = [
    { key: 'domesticEquity' as const, label: 'Domestic Equity', color: 'hsl(var(--primary))' },
    { key: 'internationalEquity' as const, label: 'International Equity', color: 'hsl(var(--secondary))' },
    { key: 'bonds' as const, label: 'Bonds', color: 'hsl(var(--accent))' },
    { key: 'reits' as const, label: 'REITs', color: 'hsl(var(--muted))' },
    { key: 'gold' as const, label: 'Gold/Alternatives', color: 'hsl(var(--warning))' },
    { key: 'cash' as const, label: 'Cash', color: 'hsl(var(--success))' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Asset Allocation</CardTitle>
          {canImportFromPortfolio && (
            <Button variant="outline" size="sm" onClick={onImportFromPortfolio}>
              Import from Portfolio
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Total: {total.toFixed(1)}%</span>
          {!isValidTotal && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Must sum to 100%
            </Badge>
          )}
        </div>

        {assets.map(({ key, label, color }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={key} className="text-sm flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: color }}
                />
                {label}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={key}
                  type="number"
                  value={allocation[key].toFixed(1)}
                  onChange={(e) => updateAllocation(key, Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                  min="0"
                  max="100"
                  step="0.5"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[allocation[key]]}
              onValueChange={([value]) => updateAllocation(key, value)}
              max={100}
              step={0.5}
              className="w-full"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}