import { AssetAllocation } from './types';

/**
 * Format currency values
 */
export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate total allocation percentage
 */
export const getTotalAllocation = (allocation: AssetAllocation): number => {
  return Object.values(allocation).reduce((sum, val) => sum + val, 0);
};

/**
 * Validate allocation adds up to 100%
 */
export const isValidAllocation = (allocation: AssetAllocation): boolean => {
  const total = getTotalAllocation(allocation);
  return Math.abs(total - 100) < 0.1; // Allow small rounding errors
};

/**
 * Generate allocation color mapping for charts
 */
export const getAllocationColors = (): Record<keyof AssetAllocation, string> => {
  return {
    domesticEquity: 'hsl(var(--primary))',
    internationalEquity: 'hsl(var(--accent))',
    bonds: 'hsl(var(--secondary))',
    reits: 'hsl(var(--ai-primary))',
    gold: 'hsl(var(--warning))',
    cash: 'hsl(var(--muted))'
  };
};

/**
 * Get asset class display names
 */
export const getAssetClassNames = (): Record<keyof AssetAllocation, string> => {
  return {
    domesticEquity: 'Domestic Equity',
    internationalEquity: 'International Equity',
    bonds: 'Bonds',
    reits: 'REITs',
    gold: 'Gold/Alternatives',
    cash: 'Cash'
  };
};

/**
 * Calculate required monthly contribution to reach target
 */
export const calculateRequiredContribution = (
  targetAmount: number,
  currentAmount: number,
  years: number,
  annualReturn: number
): number => {
  if (years <= 0) return 0;
  
  const monthlyRate = annualReturn / 12;
  const months = years * 12;
  const futureValueOfCurrent = currentAmount * Math.pow(1 + annualReturn, years);
  const remainingTarget = Math.max(0, targetAmount - futureValueOfCurrent);
  
  if (remainingTarget <= 0) return 0;
  
  // PMT calculation for remaining target
  if (monthlyRate === 0) {
    return remainingTarget / months;
  }
  
  return (remainingTarget * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
};

/**
 * Validate goal inputs
 */
export const validateGoal = (goal: Partial<{
  goalName: string;
  targetAmount?: number;
  timeHorizonYears: number;
}>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!goal.goalName || goal.goalName.trim().length < 2) {
    errors.push('Goal name must be at least 2 characters');
  }
  
  if (!goal.timeHorizonYears || goal.timeHorizonYears < 1) {
    errors.push('Time horizon must be at least 1 year');
  }
  
  if (goal.targetAmount !== undefined && goal.targetAmount <= 0) {
    errors.push('Target amount must be positive');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate realistic target amount suggestions
 */
export const getTargetSuggestions = (goalType: string): number[] => {
  const suggestions = {
    'Retirement': [5000000, 10000000, 20000000, 50000000],
    'Education': [500000, 1000000, 2000000, 5000000],
    'Large Purchase': [1000000, 2500000, 5000000, 10000000],
    'Wealth Building': [1000000, 5000000, 10000000, 25000000]
  };
  
  return suggestions[goalType as keyof typeof suggestions] || [1000000, 2500000, 5000000, 10000000];
};

/**
 * Export plan as JSON
 */
export const exportPlanAsJSON = (plan: any, filename?: string) => {
  const dataStr = JSON.stringify(plan, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename || `portfolio-plan-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

/**
 * Get next rebalance date
 */
export const getNextRebalanceDate = (frequency: 'annually' | 'semi-annually' | 'quarterly', lastRebalance?: string): string => {
  const last = lastRebalance ? new Date(lastRebalance) : new Date();
  const next = new Date(last);
  
  switch (frequency) {
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'semi-annually':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'annually':
    default:
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  
  return next.toISOString().split('T')[0];
};