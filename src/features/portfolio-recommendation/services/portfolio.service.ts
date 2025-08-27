import {
  Goal,
  ContributionInputs,
  Preferences,
  AssetAllocation,
  PortfolioRecommendation,
  ProjectionResults,
  ScenarioProjection,
  SavedPlan,
  UserFeedback,
  Scenario
} from '../types';
import { RiskProfileResult, InvestorType } from '../../risk-profile/types';

// Asset class return assumptions by scenario (annual %)
const RETURN_ASSUMPTIONS = {
  medium: {
    domesticEquity: 8,
    internationalEquity: 7,
    bonds: 4,
    reits: 6,
    gold: 3,
    cash: 2
  },
  low: {
    domesticEquity: 4,
    internationalEquity: 3,
    bonds: 1,
    reits: 3,
    gold: -1,
    cash: 0.5
  },
  high: {
    domesticEquity: 12,
    internationalEquity: 10,
    bonds: 6,
    reits: 9,
    gold: 6,
    cash: 3
  }
};

// Base allocation bands by investor type
const BASE_ALLOCATIONS: Record<InvestorType, AssetAllocation> = {
  'Very Conservative': { domesticEquity: 7, internationalEquity: 3, bonds: 60, reits: 3, gold: 7, cash: 20 },
  'Conservative': { domesticEquity: 25, internationalEquity: 8, bonds: 47, reits: 4, gold: 6, cash: 10 },
  'Balanced': { domesticEquity: 35, internationalEquity: 15, bonds: 30, reits: 8, gold: 7, cash: 5 },
  'Growth': { domesticEquity: 45, internationalEquity: 25, bonds: 12, reits: 8, gold: 5, cash: 5 },
  'Aggressive': { domesticEquity: 55, internationalEquity: 32, bonds: 5, reits: 8, gold: 0, cash: 0 }
};

// Suggested instruments (placeholders)
const INSTRUMENT_SUGGESTIONS = {
  domesticEquity: 'Domestic Large-Cap ETF (placeholder)',
  internationalEquity: 'International Developed Markets ETF (placeholder)',
  bonds: 'Government & Corporate Bond Fund (placeholder)',
  reits: 'Real Estate Investment Trust ETF (placeholder)',
  gold: 'Gold ETF/Commodity Fund (placeholder)',
  cash: 'High-Yield Savings/Money Market (placeholder)'
};

/**
 * Main recommendation engine
 */
export const recommendPortfolio = ({
  riskProfile,
  goal,
  contribution,
  preferences
}: {
  riskProfile: RiskProfileResult | { investorType: InvestorType; manual: true };
  goal: Goal;
  contribution: ContributionInputs;
  preferences: Preferences;
}): PortfolioRecommendation => {
  const investorType = riskProfile.investorType;
  let allocation = { ...BASE_ALLOCATIONS[investorType] };
  const adjustments: string[] = [];
  
  // Time horizon adjustments
  if (goal.timeHorizonYears > 10) {
    // Long horizon - tilt to equities
    const equityBoost = 7;
    allocation.domesticEquity += equityBoost * 0.6;
    allocation.internationalEquity += equityBoost * 0.4;
    allocation.bonds -= equityBoost;
    adjustments.push(`+${equityBoost}% equities for long ${goal.timeHorizonYears}-year horizon`);
  } else if (goal.timeHorizonYears <= 3) {
    // Short horizon - preserve capital
    const safetyBoost = 15;
    allocation.bonds += safetyBoost * 0.7;
    allocation.cash += safetyBoost * 0.3;
    allocation.domesticEquity -= safetyBoost * 0.6;
    allocation.internationalEquity -= safetyBoost * 0.4;
    adjustments.push(`+${safetyBoost}% bonds/cash for short ${goal.timeHorizonYears}-year horizon`);
  }

  // Risk profile capacity adjustments
  if ('dimensions' in riskProfile) {
    const capacity = riskProfile.dimensions.find(d => d.dimension === 'capacity')?.score || 50;
    const liquidity = riskProfile.dimensions.find(d => d.dimension === 'liquidity')?.score || 50;
    
    if (capacity < 50 || liquidity < 50) {
      const safetyBuffer = 8;
      allocation.cash += safetyBuffer;
      allocation.domesticEquity -= safetyBuffer * 0.6;
      allocation.internationalEquity -= safetyBuffer * 0.4;
      adjustments.push(`+${safetyBuffer}% cash buffer for income stability`);
    }
  }

  // Liquidity requirement adjustment
  if (preferences.liquidityRequirement) {
    const liquidityBuffer = 7;
    allocation.cash += liquidityBuffer;
    allocation.bonds += liquidityBuffer * 0.5;
    allocation.domesticEquity -= liquidityBuffer * 0.9;
    allocation.internationalEquity -= liquidityBuffer * 0.6;
    adjustments.push(`+${liquidityBuffer + liquidityBuffer * 0.5}% liquid assets for withdrawal needs`);
  }

  // Risk override from goal
  if (goal.riskOverride !== undefined) {
    const riskDiff = goal.riskOverride - (['Very Conservative', 'Conservative', 'Balanced', 'Growth', 'Aggressive'].indexOf(investorType) + 1) * 20;
    if (Math.abs(riskDiff) > 10) {
      const equityAdjust = riskDiff * 0.3;
      allocation.domesticEquity += equityAdjust * 0.6;
      allocation.internationalEquity += equityAdjust * 0.4;
      allocation.bonds -= equityAdjust;
      adjustments.push(`Manual risk override: ${riskDiff > 0 ? 'increased' : 'decreased'} equity exposure`);
    }
  }

  // Normalize to 100%
  const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
  Object.keys(allocation).forEach(key => {
    allocation[key as keyof AssetAllocation] = Math.round((allocation[key as keyof AssetAllocation] / total) * 100);
  });

  // Generate rationale
  const rationale = generateRationale(investorType, goal, adjustments);
  
  // Determine confidence
  const confidence = determineConfidence(goal, contribution, investorType);

  // Get suggested instruments (add SRI suffix if ethical filter is on)
  const suggestedInstruments = { ...INSTRUMENT_SUGGESTIONS };
  if (preferences.ethicalFilter) {
    Object.keys(suggestedInstruments).forEach(key => {
      suggestedInstruments[key as keyof AssetAllocation] += ' - SRI/ESG variant';
    });
  }

  return {
    allocation,
    rationale,
    investorType,
    adjustments,
    confidence,
    suggestedInstruments
  };
};

/**
 * Simulate portfolio growth over time
 */
export const simulatePortfolio = ({
  allocation,
  lump,
  monthly,
  years,
  scenario
}: {
  allocation: AssetAllocation;
  lump: number;
  monthly: number;
  years: number;
  scenario: Scenario;
}): ScenarioProjection[] => {
  const returns = RETURN_ASSUMPTIONS[scenario];
  const results: ScenarioProjection[] = [];
  
  // Calculate weighted portfolio return
  const portfolioReturn = (
    (allocation.domesticEquity / 100) * returns.domesticEquity +
    (allocation.internationalEquity / 100) * returns.internationalEquity +
    (allocation.bonds / 100) * returns.bonds +
    (allocation.reits / 100) * returns.reits +
    (allocation.gold / 100) * returns.gold +
    (allocation.cash / 100) * returns.cash
  ) / 100;

  for (let year = 0; year <= years; year++) {
    // Compound lump sum
    const lumpValue = lump * Math.pow(1 + portfolioReturn, year);
    
    // Future value of monthly contributions (end of period)
    let contributionValue = 0;
    if (monthly > 0 && year > 0) {
      const monthlyRate = portfolioReturn / 12;
      const months = year * 12;
      contributionValue = monthly * 12 * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }
    
    const totalValue = lumpValue + contributionValue;
    
    // Calculate breakdown by asset class
    const breakdown: AssetAllocation = {
      domesticEquity: (totalValue * allocation.domesticEquity) / 100,
      internationalEquity: (totalValue * allocation.internationalEquity) / 100,
      bonds: (totalValue * allocation.bonds) / 100,
      reits: (totalValue * allocation.reits) / 100,
      gold: (totalValue * allocation.gold) / 100,
      cash: (totalValue * allocation.cash) / 100
    };
    
    results.push({
      year,
      value: Math.round(totalValue),
      breakdown
    });
  }
  
  return results;
};

/**
 * Save portfolio plan to localStorage
 */
export const savePlan = (plan: Omit<SavedPlan, 'id' | 'timestamp' | 'version'>): { id: string } => {
  const id = `plan_${Date.now()}`;
  const savedPlan: SavedPlan = {
    ...plan,
    id,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
  
  // Save individual plan
  localStorage.setItem(`portfolioPlan.${id}`, JSON.stringify(savedPlan));
  
  // Update index
  const existingPlans = listPlans();
  const updatedIndex = [...existingPlans, { id, name: plan.name, timestamp: savedPlan.timestamp }];
  localStorage.setItem('portfolioPlans.index', JSON.stringify(updatedIndex));
  
  return { id };
};

/**
 * Load portfolio plan from localStorage
 */
export const loadPlan = (id: string): SavedPlan | null => {
  try {
    const stored = localStorage.getItem(`portfolioPlan.${id}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * List all saved portfolio plans
 */
export const listPlans = (): Array<{ id: string; name: string; timestamp: string }> => {
  try {
    const stored = localStorage.getItem('portfolioPlans.index');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Record user feedback for adaptive learning
 */
export const recordFeedback = (action: UserFeedback['action'], planId: string, metadata?: Record<string, any>) => {
  const feedback: UserFeedback = {
    action,
    planId,
    metadata,
    timestamp: new Date().toISOString()
  };
  
  try {
    const existing = localStorage.getItem('portfolioReco.history');
    const history: UserFeedback[] = existing ? JSON.parse(existing) : [];
    history.push(feedback);
    
    // Keep only last 50 entries
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
    
    localStorage.setItem('portfolioReco.history', JSON.stringify(history));
  } catch {
    // Ignore storage errors
  }
};

/**
 * Get adaptive adjustments based on user feedback history
 */
export const getAdaptiveAdjustments = (): { equityTiltAdjustment: number } => {
  try {
    const history = localStorage.getItem('portfolioReco.history');
    if (!history) return { equityTiltAdjustment: 0 };
    
    const feedback: UserFeedback[] = JSON.parse(history);
    const recentRejects = feedback.filter(f => 
      f.action === 'reject' && 
      new Date(f.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    );
    
    // If user rejected 3+ recommendations recently, reduce equity tilt
    if (recentRejects.length >= 3) {
      return { equityTiltAdjustment: -5 };
    }
    
    return { equityTiltAdjustment: 0 };
  } catch {
    return { equityTiltAdjustment: 0 };
  }
};

// Helper functions
const generateRationale = (investorType: InvestorType, goal: Goal, adjustments: string[]): string => {
  let rationale = `Based on your ${investorType} risk profile and ${goal.timeHorizonYears}-year horizon for ${goal.goalName}`;
  
  if (goal.priority === 'Maximize Returns') {
    rationale += ', the allocation favors growth assets for maximum return potential';
  } else if (goal.priority === 'Preserve Capital') {
    rationale += ', the allocation emphasizes capital preservation with defensive assets';
  } else {
    rationale += ', the allocation balances growth potential with risk management';
  }
  
  if (adjustments.length > 0) {
    rationale += '. Adjustments: ' + adjustments.join('; ');
  }
  
  return rationale + '.';
};

const determineConfidence = (goal: Goal, contribution: ContributionInputs, investorType: InvestorType): 'low' | 'medium' | 'high' => {
  let score = 0;
  
  // Time horizon confidence
  if (goal.timeHorizonYears >= 5) score += 2;
  else if (goal.timeHorizonYears >= 3) score += 1;
  
  // Contribution confidence
  if (contribution.currentLumpSum > 0 || contribution.monthlyContribution > 0) score += 2;
  
  // Risk profile alignment
  if (['Conservative', 'Balanced', 'Growth'].includes(investorType)) score += 1;
  
  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
};
