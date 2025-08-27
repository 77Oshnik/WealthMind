import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, Calendar, TrendingUp, Settings } from 'lucide-react';
import { MicroSimulationInputs, AssetAllocation } from '../types';
import { DEFAULT_ALLOCATIONS, calculateTotalMonthlyContribution } from '../services/microSim.service';
import { formatCurrency, formatPercentage } from '../utils';

interface MicroFormProps {
  inputs: MicroSimulationInputs;
  onInputsChange: (inputs: MicroSimulationInputs) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export function MicroForm({ inputs, onInputsChange, onRunSimulation, isRunning }: MicroFormProps) {
  const [activeTab, setActiveTab] = useState('strategy');
  
  const monthlyContribution = calculateTotalMonthlyContribution(inputs);
  
  const updateInputs = (updates: Partial<MicroSimulationInputs>) => {
    onInputsChange({ ...inputs, ...updates });
  };
  
  const updateAllocation = (updates: Partial<AssetAllocation>) => {
    onInputsChange({
      ...inputs,
      assetAllocation: { ...inputs.assetAllocation, ...updates }
    });
  };
  
  // Ensure allocation percentages sum to 1
  const normalizeAllocation = (allocation: AssetAllocation): AssetAllocation => {
    const total = allocation.equity + allocation.bonds + allocation.cash + allocation.gold;
    if (total === 0) return allocation;
    
    return {
      equity: allocation.equity / total,
      bonds: allocation.bonds / total,
      cash: allocation.cash / total,
      gold: allocation.gold / total
    };
  };
  
  const canRunSimulation = inputs.lumpSum > 0 || monthlyContribution > 0;
  
  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Simulation Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="amounts">Amounts</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategy" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Investment Strategy</Label>
                <Select 
                  value={inputs.selectedStrategy} 
                  onValueChange={(value) => updateInputs({ selectedStrategy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roundup">Round-Up Investing</SelectItem>
                    <SelectItem value="daily">Fixed Daily Amount</SelectItem>
                    <SelectItem value="weekly">Weekly Sweep</SelectItem>
                    <SelectItem value="monthly">Recurring Monthly</SelectItem>
                    <SelectItem value="custom">Custom Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Time Horizon</Label>
                  <Select 
                    value={inputs.durationYears.toString()} 
                    onValueChange={(value) => updateInputs({ durationYears: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                      <SelectItem value="20">20 Years</SelectItem>
                      <SelectItem value="30">30 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Simulation Type</Label>
                  <Select 
                    value={inputs.scenarioType} 
                    onValueChange={(value: 'deterministic' | 'monteCarlo') => 
                      updateInputs({ scenarioType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deterministic">Deterministic</SelectItem>
                      <SelectItem value="monteCarlo">Monte Carlo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="amounts" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Initial Investment (Optional)</Label>
                <Input
                  type="number"
                  value={inputs.lumpSum}
                  onChange={(e) => updateInputs({ lumpSum: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Regular Amount</Label>
                  <Input
                    type="number"
                    value={inputs.periodicAmount}
                    onChange={(e) => updateInputs({ periodicAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label>Frequency</Label>
                  <Select 
                    value={inputs.frequency} 
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                      updateInputs({ frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {(inputs.selectedStrategy === 'roundup' || inputs.selectedStrategy === 'custom') && (
                <div className="space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/10">
                  <h4 className="font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Round-Up Settings
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Transactions per Month</Label>
                      <Input
                        type="number"
                        value={inputs.roundUpAvgTxPerMonth}
                        onChange={(e) => updateInputs({ roundUpAvgTxPerMonth: parseInt(e.target.value) || 0 })}
                        placeholder="20"
                      />
                    </div>
                    
                    <div>
                      <Label>Average Transaction Amount</Label>
                      <Input
                        type="number"
                        value={inputs.avgTxAmount}
                        onChange={(e) => updateInputs({ avgTxAmount: parseFloat(e.target.value) || 0 })}
                        placeholder="15.50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Round Up To</Label>
                      <Select 
                        value={inputs.roundUpTo.toString()} 
                        onValueChange={(value) => updateInputs({ roundUpTo: parseFloat(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Nearest $1</SelectItem>
                          <SelectItem value="5">Nearest $5</SelectItem>
                          <SelectItem value="10">Nearest $10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Multiplier</Label>
                      <Select 
                        value={inputs.roundUpMultiplier.toString()} 
                        onValueChange={(value) => updateInputs({ roundUpMultiplier: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                          <SelectItem value="5">5x</SelectItem>
                          <SelectItem value="10">10x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Monthly Investment:</span>
                  <Badge className="bg-primary/10 text-primary">
                    {formatCurrency(monthlyContribution)}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="allocation" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Asset Allocation</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateInputs({ assetAllocation: DEFAULT_ALLOCATIONS.conservative })}
                >
                  Conservative
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateInputs({ assetAllocation: DEFAULT_ALLOCATIONS.balanced })}
                >
                  Balanced
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateInputs({ assetAllocation: DEFAULT_ALLOCATIONS.growth })}
                >
                  Growth
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Equity ({formatPercentage(inputs.assetAllocation.equity)})</Label>
                  </div>
                  <Slider
                    value={[inputs.assetAllocation.equity * 100]}
                    onValueChange={([value]) => updateAllocation({ equity: value / 100 })}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Bonds ({formatPercentage(inputs.assetAllocation.bonds)})</Label>
                  </div>
                  <Slider
                    value={[inputs.assetAllocation.bonds * 100]}
                    onValueChange={([value]) => updateAllocation({ bonds: value / 100 })}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Cash ({formatPercentage(inputs.assetAllocation.cash)})</Label>
                  </div>
                  <Slider
                    value={[inputs.assetAllocation.cash * 100]}
                    onValueChange={([value]) => updateAllocation({ cash: value / 100 })}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Gold/Alt ({formatPercentage(inputs.assetAllocation.gold)})</Label>
                  </div>
                  <Slider
                    value={[inputs.assetAllocation.gold * 100]}
                    onValueChange={([value]) => updateAllocation({ gold: value / 100 })}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateInputs({ assetAllocation: normalizeAllocation(inputs.assetAllocation) })}
              >
                Normalize to 100%
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Annual Fee/Expense Ratio (%)</Label>
                <Input
                  type="number"
                  value={inputs.feeEstimate * 100}
                  onChange={(e) => updateInputs({ feeEstimate: (parseFloat(e.target.value) || 0) / 100 })}
                  placeholder="0.25"
                  step="0.01"
                />
              </div>
              
              {inputs.scenarioType === 'monteCarlo' && (
                <div>
                  <Label>Number of Simulations</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[inputs.numSimulations]}
                      onValueChange={([value]) => updateInputs({ numSimulations: value })}
                      min={100}
                      max={2000}
                      step={100}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>100</span>
                      <span>{inputs.numSimulations} simulations</span>
                      <span>2000</span>
                    </div>
                    {inputs.numSimulations > 1000 && (
                      <p className="text-xs text-amber-600">
                        High simulation counts may impact performance
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button 
            onClick={onRunSimulation}
            disabled={!canRunSimulation || isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                Running Simulation...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
          
          {!canRunSimulation && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Please enter an initial investment or recurring contribution amount
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}