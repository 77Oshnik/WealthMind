// Portfolio Recommendation Types
export interface Goal {
  id: string;
  goalName: string;
  targetAmount?: number;
  timeHorizonYears: number;
  priority: 'Maximize Returns' | 'Balance Risk & Returns' | 'Preserve Capital';
  goalType: 'Retirement' | 'Education' | 'Large Purchase' | 'Wealth Building';
  riskOverride?: number;
}

export interface ContributionInputs {
  currentLumpSum: number;
  monthlyContribution: number;
  contributionFrequency: 'monthly' | 'weekly' | 'quarterly';
  autoInvestPreference: boolean;
}

export interface Preferences {
  ethicalFilter: boolean;
  liquidityRequirement: boolean;
}

export interface AssetAllocation {
  domesticEquity: number;
  internationalEquity: number;
  bonds: number;
  reits: number;
  gold: number;
  cash: number;
}

export interface PortfolioRecommendation {
  allocation: AssetAllocation;
  rationale: string;
  investorType: string;
  adjustments: string[];
  confidence: 'low' | 'medium' | 'high';
  suggestedInstruments: Record<keyof AssetAllocation, string>;
}

export interface ScenarioProjection {
  year: number;
  value: number;
  breakdown: AssetAllocation;
}

export interface ProjectionResults {
  low: ScenarioProjection[];
  medium: ScenarioProjection[];
  high: ScenarioProjection[];
}

export interface SavedPlan {
  id: string;
  name: string;
  notes?: string;
  goal: Goal;
  allocation: AssetAllocation;
  rationale: string;
  projection: ProjectionResults;
  timestamp: string;
  version: string;
}

export interface UserFeedback {
  action: 'accept' | 'reject' | 'modify';
  planId: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export type Scenario = 'low' | 'medium' | 'high';

export interface RebalancePlan {
  frequency: 'annually' | 'semi-annually' | 'quarterly';
  autoReminders: boolean;
  lastRebalance?: string;
  nextRebalance?: string;
}