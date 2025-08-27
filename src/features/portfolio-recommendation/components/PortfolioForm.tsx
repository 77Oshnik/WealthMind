import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Goal, ContributionInputs, Preferences } from '../types';
import { validateGoal, formatCurrency, getTargetSuggestions } from '../utils';

interface PortfolioFormProps {
  onSubmit: (goal: Goal, contribution: ContributionInputs, preferences: Preferences) => void;
  goal: Goal | null;
  contribution: ContributionInputs | null;
  preferences: Preferences;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({
  onSubmit,
  goal: initialGoal,
  contribution: initialContribution,
  preferences: initialPreferences
}) => {
  const [goalName, setGoalName] = useState(initialGoal?.goalName || '');
  const [targetAmount, setTargetAmount] = useState<string>(initialGoal?.targetAmount?.toString() || '');
  const [timeHorizonYears, setTimeHorizonYears] = useState(initialGoal?.timeHorizonYears || 5);
  const [priority, setPriority] = useState<Goal['priority']>(initialGoal?.priority || 'Balance Risk & Returns');
  const [goalType, setGoalType] = useState<Goal['goalType']>(initialGoal?.goalType || 'Wealth Building');
  const [riskOverride, setRiskOverride] = useState<number[]>(initialGoal?.riskOverride ? [initialGoal.riskOverride] : [50]);
  
  const [currentLumpSum, setCurrentLumpSum] = useState<string>(initialContribution?.currentLumpSum?.toString() || '0');
  const [monthlyContribution, setMonthlyContribution] = useState<string>(initialContribution?.monthlyContribution?.toString() || '');
  const [contributionFrequency, setContributionFrequency] = useState<ContributionInputs['contributionFrequency']>(
    initialContribution?.contributionFrequency || 'monthly'
  );
  const [autoInvestPreference, setAutoInvestPreference] = useState(initialContribution?.autoInvestPreference || false);
  
  const [ethicalFilter, setEthicalFilter] = useState(initialPreferences.ethicalFilter);
  const [liquidityRequirement, setLiquidityRequirement] = useState(initialPreferences.liquidityRequirement);
  
  const [errors, setErrors] = useState<string[]>([]);
  const [useRiskOverride, setUseRiskOverride] = useState(false);

  const handleSubmit = () => {
    const goalData = {
      id: `goal_${Date.now()}`,
      goalName: goalName.trim(),
      targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
      timeHorizonYears,
      priority,
      goalType,
      riskOverride: useRiskOverride ? riskOverride[0] : undefined
    };

    const validation = validateGoal(goalData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!monthlyContribution && !currentLumpSum) {
      setErrors(['Please provide either a lump sum or monthly contribution amount']);
      return;
    }

    setErrors([]);

    const contributionData: ContributionInputs = {
      currentLumpSum: parseFloat(currentLumpSum) || 0,
      monthlyContribution: parseFloat(monthlyContribution) || 0,
      contributionFrequency,
      autoInvestPreference
    };

    const preferencesData: Preferences = {
      ethicalFilter,
      liquidityRequirement
    };

    onSubmit(goalData as Goal, contributionData, preferencesData);
  };

  const targetSuggestions = getTargetSuggestions(goalType);

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle>Investment Goal & Contributions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Goal Details</h4>
          
          <div className="space-y-2">
            <Label htmlFor="goalName">Goal Name *</Label>
            <Input
              id="goalName"
              placeholder="e.g. Retirement, House Down Payment"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Goal Type</Label>
              <Select value={goalType} onValueChange={(value: Goal['goalType']) => setGoalType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retirement">Retirement</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Large Purchase">Large Purchase</SelectItem>
                  <SelectItem value="Wealth Building">Wealth Building</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value: Goal['priority']) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maximize Returns">Maximize Returns</SelectItem>
                  <SelectItem value="Balance Risk & Returns">Balance Risk & Returns</SelectItem>
                  <SelectItem value="Preserve Capital">Preserve Capital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (Optional)</Label>
            <Input
              id="targetAmount"
              type="number"
              placeholder="Enter target amount in ₹"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {targetSuggestions.map((amount) => (
                <Badge
                  key={amount}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setTargetAmount(amount.toString())}
                >
                  {formatCurrency(amount)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time Horizon: {timeHorizonYears} years</Label>
            <Slider
              value={[timeHorizonYears]}
              onValueChange={(value) => setTimeHorizonYears(value[0])}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 year</span>
              <span>30 years</span>
            </div>
          </div>
        </div>

        {/* Risk Override */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="riskOverride"
              checked={useRiskOverride}
              onCheckedChange={setUseRiskOverride}
            />
            <Label htmlFor="riskOverride">Override Risk Profile</Label>
          </div>
          
          {useRiskOverride && (
            <div className="space-y-2">
              <Label>Risk Level: {riskOverride[0]}% aggressive</Label>
              <Slider
                value={riskOverride}
                onValueChange={setRiskOverride}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
          )}
        </div>

        {/* Contributions */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contributions</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lumpSum">Current Lump Sum (₹)</Label>
              <Input
                id="lumpSum"
                type="number"
                placeholder="0"
                value={currentLumpSum}
                onChange={(e) => setCurrentLumpSum(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Contribution (₹)</Label>
              <Input
                id="monthly"
                type="number"
                placeholder="e.g. 10000"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contribution Frequency</Label>
            <Select 
              value={contributionFrequency} 
              onValueChange={(value: ContributionInputs['contributionFrequency']) => setContributionFrequency(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Preferences</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sustainable/Ethical Investments</Label>
                <p className="text-sm text-muted-foreground">Prefer ESG and socially responsible funds</p>
              </div>
              <Switch
                checked={ethicalFilter}
                onCheckedChange={setEthicalFilter}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Liquidity Requirement</Label>
                <p className="text-sm text-muted-foreground">May need partial withdrawal in next few years</p>
              </div>
              <Switch
                checked={liquidityRequirement}
                onCheckedChange={setLiquidityRequirement}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Invest Interest</Label>
                <p className="text-sm text-muted-foreground">Interested in automated investment plans</p>
              </div>
              <Switch
                checked={autoInvestPreference}
                onCheckedChange={setAutoInvestPreference}
              />
            </div>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-destructive">{error}</p>
            ))}
          </div>
        )}

        {/* Submit */}
        <Button onClick={handleSubmit} className="w-full">
          Update Goal & Contributions
        </Button>
      </CardContent>
    </Card>
  );
};

export default PortfolioForm;