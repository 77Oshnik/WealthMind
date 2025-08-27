export interface AssetAllocation {
  domesticEquity: number;
  internationalEquity: number;
  bonds: number;
  reits: number;
  gold: number;
  cash: number;
}

export interface SimulationAssumptions {
  scenario: 'low' | 'medium' | 'high' | 'custom';
  inflation: number;
  fees: number;
  taxDrag: number;
  customReturns?: {
    domesticEquity: number;
    internationalEquity: number;
    bonds: number;
    reits: number;
    gold: number;
    cash: number;
  };
}

export interface GlidePath {
  enabled: boolean;
  reduceEquityPercent: number;
  everyYears: number;
  floorPercent: number;
}

export interface MarketShock {
  enabled: boolean;
  year: number;
  magnitude: number;
  recovery?: number;
}

export interface WhatIfInputs {
  goalName: string;
  goalType: 'retirement' | 'education' | 'purchase' | 'wealth';
  targetAmount?: number;
  timeHorizonYears: number;
  startDelayMonths: number;
  lumpSum: number;
  recurringAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  annualEscalation: number;
  skipMonthsPerYear: number;
}

export interface ScenarioDeltas {
  contributionChange?: number; // percentage change
  startDelayChange?: number; // months change
  allocationChange?: Partial<AssetAllocation>;
  glidePath?: GlidePath;
  shock?: MarketShock;
  assumptions?: Partial<SimulationAssumptions>;
}

export interface Scenario {
  id: string;
  name: string;
  isBaseline: boolean;
  deltas: ScenarioDeltas;
}

export interface YearlySnapshot {
  year: number;
  contributions: number;
  total: number;
  growth: number;
}

export interface SimulationResults {
  yearlySnapshots: YearlySnapshot[];
  finalValueNominal: number;
  finalValueReal: number;
  totalContributions: number;
  totalGrowth: number;
  successProbability?: number;
  requiredMonthly?: number;
  worstCase?: number;
  bestCase?: number;
  percentiles?: {
    p10: number[];
    p50: number[];
    p90: number[];
  };
}

export type SimulationMode = 'deterministic' | 'montecarlo';

export interface SavedPlan {
  id: string;
  name: string;
  timestamp: string;
  inputs: WhatIfInputs;
  assumptions: SimulationAssumptions;
  scenarios: Scenario[];
  results?: SimulationResults;
}