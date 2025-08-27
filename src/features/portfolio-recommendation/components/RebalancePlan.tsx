import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Bell, CheckCircle } from 'lucide-react';

import { RebalancePlan as RebalancePlanType } from '../types';
import { getNextRebalanceDate } from '../utils';

const RebalancePlan: React.FC = () => {
  const [frequency, setFrequency] = useState<RebalancePlanType['frequency']>('annually');
  const [autoReminders, setAutoReminders] = useState(false);
  const [lastRebalance, setLastRebalance] = useState<string>('');

  const nextRebalance = getNextRebalanceDate(frequency, lastRebalance || undefined);

  const frequencyDescriptions = {
    'quarterly': {
      description: 'Rebalance every 3 months',
      pros: ['Quick response to market changes', 'Maintains target allocation'],
      cons: ['More frequent monitoring required', 'Higher transaction costs']
    },
    'semi-annually': {
      description: 'Rebalance every 6 months',
      pros: ['Balanced approach', 'Moderate transaction costs'],
      cons: ['Some allocation drift between rebalances']
    },
    'annually': {
      description: 'Rebalance once per year',
      pros: ['Lower transaction costs', 'Tax-efficient approach'],
      cons: ['May allow larger allocation drift']
    }
  };

  const saveRebalancePreferences = () => {
    const preferences: RebalancePlanType = {
      frequency,
      autoReminders,
      lastRebalance: lastRebalance || new Date().toISOString().split('T')[0],
      nextRebalance
    };
    
    localStorage.setItem('rebalancePreferences', JSON.stringify(preferences));
  };

  React.useEffect(() => {
    // Load saved preferences
    try {
      const saved = localStorage.getItem('rebalancePreferences');
      if (saved) {
        const preferences: RebalancePlanType = JSON.parse(saved);
        setFrequency(preferences.frequency);
        setAutoReminders(preferences.autoReminders);
        setLastRebalance(preferences.lastRebalance || '');
      }
    } catch {
      // Ignore errors
    }
  }, []);

  React.useEffect(() => {
    saveRebalancePreferences();
  }, [frequency, autoReminders, lastRebalance]);

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Rebalancing Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Frequency Selection */}
        <div className="space-y-3">
          <Label>Rebalancing Frequency</Label>
          <Select 
            value={frequency} 
            onValueChange={(value: RebalancePlanType['frequency']) => setFrequency(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarterly">Quarterly (Every 3 months)</SelectItem>
              <SelectItem value="semi-annually">Semi-annually (Every 6 months)</SelectItem>
              <SelectItem value="annually">Annually (Once per year)</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium">{frequencyDescriptions[frequency].description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-green-600 font-medium mb-1">Pros:</p>
                <ul className="space-y-1">
                  {frequencyDescriptions[frequency].pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-orange-600 font-medium mb-1">Considerations:</p>
                <ul className="space-y-1">
                  {frequencyDescriptions[frequency].cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Reminders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Automatic Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when it's time to rebalance your portfolio
              </p>
            </div>
            <Switch
              checked={autoReminders}
              onCheckedChange={setAutoReminders}
            />
          </div>
          
          {autoReminders && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                Reminders will be stored locally. Consider setting calendar reminders or consulting 
                with your financial advisor for rebalancing assistance.
              </p>
            </div>
          )}
        </div>

        {/* Next Rebalance Date */}
        <div className="space-y-2">
          <Label>Next Rebalance Date</Label>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Scheduled Date:</span>
              <Badge className="bg-primary/20 text-primary">
                {new Date(nextRebalance).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Rebalancing Guidelines */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Rebalancing Guidelines</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="bg-muted/30 rounded p-3">
              <p className="font-medium text-foreground mb-2">When to Rebalance:</p>
              <ul className="space-y-1">
                <li>• Asset allocation drifts more than 5% from target</li>
                <li>• Scheduled rebalancing date arrives</li>
                <li>• Major life changes affect your risk profile</li>
                <li>• Market volatility significantly impacts allocation</li>
              </ul>
            </div>
            
            <div className="bg-muted/30 rounded p-3">
              <p className="font-medium text-foreground mb-2">Rebalancing Methods:</p>
              <ul className="space-y-1">
                <li>• <strong>Sell high, buy low:</strong> Trim overweight positions, add to underweight</li>
                <li>• <strong>New contributions:</strong> Direct new money to underweight assets</li>
                <li>• <strong>Tax considerations:</strong> Use tax-advantaged accounts when possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rebalancing Checklist */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Rebalancing Checklist</h4>
          <div className="space-y-2">
            {[
              'Review current portfolio allocation',
              'Compare with target allocation',
              'Identify assets that need rebalancing (>5% drift)',
              'Consider tax implications of selling',
              'Execute rebalancing trades',
              'Update records and set next rebalance date'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300" 
                  id={`rebalance-${index}`}
                />
                <label htmlFor={`rebalance-${index}`} className="text-muted-foreground">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-3">
          <strong>Note:</strong> This tool provides guidance only. Consider consulting with a financial 
          advisor for personalized rebalancing strategies, especially regarding tax implications and 
          optimal timing.
        </div>
      </CardContent>
    </Card>
  );
};

export default RebalancePlan;