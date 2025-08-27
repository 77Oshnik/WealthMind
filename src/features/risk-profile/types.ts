// Risk Profile Types
export interface RiskQuestion {
  id: string;
  dimension: RiskDimension;
  text: string;
  reverse?: boolean;
}

export type RiskDimension = 'tolerance' | 'capacity' | 'horizon' | 'liquidity' | 'knowledge' | 'lossAversion';

export interface DimensionScore {
  dimension: RiskDimension;
  label: string;
  score: number; // 0-100
}

export interface RiskProfileResult {
  answers: Record<string, number>;
  dimensions: DimensionScore[];
  overall: number; // 0-100
  investorType: InvestorType;
  timestamp: string;
  version: string;
}

export type InvestorType = 'Very Conservative' | 'Conservative' | 'Balanced' | 'Growth' | 'Aggressive';

export interface AllocationBand {
  equity: string;
  debt: string;
  gold: string;
  cash: string;
}

export interface SavedProfile {
  id: string;
  name: string;
  result: RiskProfileResult;
  createdAt: string;
}