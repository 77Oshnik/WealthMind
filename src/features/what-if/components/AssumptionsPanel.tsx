import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { SimulationAssumptions } from '../types';

interface AssumptionsPanelProps {
  assumptions: SimulationAssumptions;
  onAssumptionsChange: (assumptions: SimulationAssumptions) => void;
}

export default function AssumptionsPanel({ assumptions, onAssumptionsChange }: AssumptionsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateAssumption = (field: keyof SimulationAssumptions, value: any) => {
    onAssumptionsChange({ ...assumptions, [field]: value });
  };

  const updateCustomReturn = (asset: string, value: number) => {
    const customReturns = assumptions.customReturns || {
      domesticEquity: 8,
      internationalEquity: 7,
      bonds: 4,
      reits: 6,
      gold: 3,
      cash: 2
    };
    
    onAssumptionsChange({
      ...assumptions,
      customReturns: {
        ...customReturns,
        [asset]: value
      }
    });
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Market Assumptions</CardTitle>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">Return Scenario</Label>
              <Select value={assumptions.scenario} onValueChange={(value) => updateAssumption('scenario', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Returns</SelectItem>
                  <SelectItem value="medium">Medium Returns</SelectItem>
                  <SelectItem value="high">High Returns</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inflation">Inflation (%)</Label>
                <Input
                  id="inflation"
                  type="number"
                  value={assumptions.inflation}
                  onChange={(e) => updateAssumption('inflation', Number(e.target.value))}
                  min="0"
                  max="15"
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fees">Fees (%)</Label>
                <Input
                  id="fees"
                  type="number"
                  value={assumptions.fees}
                  onChange={(e) => updateAssumption('fees', Number(e.target.value))}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxDrag">Tax Drag (%)</Label>
              <Input
                id="taxDrag"
                type="number"
                value={assumptions.taxDrag}
                onChange={(e) => updateAssumption('taxDrag', Number(e.target.value))}
                min="0"
                max="30"
                step="0.5"
              />
            </div>

            {assumptions.scenario === 'custom' && (
              <div className="space-y-3 p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Custom Expected Returns (%)</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <Label>Domestic Equity</Label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      value={assumptions.customReturns?.domesticEquity || 8}
                      onChange={(e) => updateCustomReturn('domesticEquity', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>International Equity</Label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      value={assumptions.customReturns?.internationalEquity || 7}
                      onChange={(e) => updateCustomReturn('internationalEquity', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Bonds</Label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      value={assumptions.customReturns?.bonds || 4}
                      onChange={(e) => updateCustomReturn('bonds', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>REITs</Label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      value={assumptions.customReturns?.reits || 6}
                      onChange={(e) => updateCustomReturn('reits', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Gold/Alts</Label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      value={assumptions.customReturns?.gold || 3}
                      onChange={(e) => updateCustomReturn('gold', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Cash</Label>
                    <Input 
                      type="number" 
                      step="0.1" 
                      value={assumptions.customReturns?.cash || 2}
                      onChange={(e) => updateCustomReturn('cash', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
              <p><strong>Scenario Assumptions:</strong></p>
              <p>• Low: Conservative market outlook, lower expected returns</p>
              <p>• Medium: Balanced historical averages</p>
              <p>• High: Optimistic growth scenario</p>
              <p>• Custom: Define your own expected returns</p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}