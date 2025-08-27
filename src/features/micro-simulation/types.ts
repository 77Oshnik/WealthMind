export interface AssetAllocation {
  equity: number;
  bonds: number;
  cash: number;
  gold: number;
}

export interface AssetAssumptions {
  equity: { mu: number; sigma: number };
  bonds: { mu: number; sigma: number };
  cash: { mu: number; sigma: number };
  gold: { mu: number; sigma: number };
}

export interface MicroSimulationInputs {
  currency: string;
  lumpSum: number;
  periodicAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  roundUpAvgTxPerMonth: number;
  avgTxAmount: number;
  roundUpTo: number;
  roundUpMultiplier: number;
  durationYears: number;
  scenarioType: 'deterministic' | 'monteCarlo';
  numSimulations: number;
  assetAllocation: AssetAllocation;
  feeEstimate: number;
  selectedStrategy: string;
}

export interface YearlySnapshot {
  year: number;
  contributions: number;
  portfolioValue: number;
  returns: number;
}

export interface SimulationResult {
  inputs: MicroSimulationInputs;
  yearlySnapshots: YearlySnapshot[];
  finalValue: number;
  totalContributions: number;
  totalReturns: number;
  monthlyContribution: number;
}

export interface MonteCarloResult extends SimulationResult {
  percentiles: {
    year: number;
    p10: number;
    p50: number;
    p90: number;
  }[];
  finalStats: {
    mean: number;
    median: number;
    stddev: number;
    p10: number;
    p90: number;
  };
}

export interface StrategyPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultInputs: Partial<MicroSimulationInputs>;
}

export interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  inputs: MicroSimulationInputs;
  result: SimulationResult | MonteCarloResult;
}