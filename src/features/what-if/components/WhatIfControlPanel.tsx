import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { WhatIfInputs, SimulationMode } from '../types';

interface WhatIfControlPanelProps {
  inputs: WhatIfInputs;
  mode: SimulationMode;
  onInputsChange: (inputs: WhatIfInputs) => void;
  onModeChange: (mode: SimulationMode) => void;
  onRunSimulation: () => void;
  onAddScenario: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export default function WhatIfControlPanel({
  inputs,
  mode,
  onInputsChange,
  onModeChange,
  onRunSimulation,
  onAddScenario,
  onReset,
  isRunning
}: WhatIfControlPanelProps) {
  const updateInput = (field: keyof WhatIfInputs, value: any) => {
    onInputsChange({ ...inputs, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="goalName">Goal Name</Label>
            <Input
              id="goalName"
              value={inputs.goalName}
              onChange={(e) => updateInput('goalName', e.target.value)}
              placeholder="e.g., Retirement"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goalType">Goal Type</Label>
            <Select value={inputs.goalType} onValueChange={(value) => updateInput('goalType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retirement">Retirement</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="wealth">Wealth Building</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (₹)</Label>
            <Input
              id="targetAmount"
              type="number"
              value={inputs.targetAmount || ''}
              onChange={(e) => updateInput('targetAmount', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Optional"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeHorizonYears">Time Horizon (Years)</Label>
            <Input
              id="timeHorizonYears"
              type="number"
              value={inputs.timeHorizonYears}
              onChange={(e) => updateInput('timeHorizonYears', Number(e.target.value))}
              min="1"
              max="50"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lumpSum">Lump Sum (₹)</Label>
            <Input
              id="lumpSum"
              type="number"
              value={inputs.lumpSum}
              onChange={(e) => updateInput('lumpSum', Number(e.target.value))}
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDelayMonths">Start Delay (Months)</Label>
            <Input
              id="startDelayMonths"
              type="number"
              value={inputs.startDelayMonths}
              onChange={(e) => updateInput('startDelayMonths', Number(e.target.value))}
              min="0"
              max="60"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recurringAmount">Recurring Amount (₹)</Label>
            <Input
              id="recurringAmount"
              type="number"
              value={inputs.recurringAmount}
              onChange={(e) => updateInput('recurringAmount', Number(e.target.value))}
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={inputs.frequency} onValueChange={(value) => updateInput('frequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualEscalation">Annual Escalation (%)</Label>
            <Input
              id="annualEscalation"
              type="number"
              value={inputs.annualEscalation}
              onChange={(e) => updateInput('annualEscalation', Number(e.target.value))}
              min="0"
              max="20"
              step="0.5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skipMonthsPerYear">Skip Months/Year</Label>
            <Input
              id="skipMonthsPerYear"
              type="number"
              value={inputs.skipMonthsPerYear}
              onChange={(e) => updateInput('skipMonthsPerYear', Number(e.target.value))}
              min="0"
              max="12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Simulation Mode</Label>
          <Select value={mode} onValueChange={(value) => onModeChange(value as SimulationMode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deterministic">Deterministic</SelectItem>
              <SelectItem value="montecarlo">Monte Carlo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={onRunSimulation} 
            className="flex-1"
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Simulation'}
          </Button>
          <Button variant="outline" onClick={onAddScenario}>
            Add Scenario
          </Button>
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}