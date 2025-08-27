import { RiskProfileResult, DimensionScore, InvestorType, AllocationBand, SavedProfile } from '../types';

// Risk scoring weights (sum = 1.0)
const DIMENSION_WEIGHTS = {
  tolerance: 0.35,
  capacity: 0.25,
  horizon: 0.15,
  liquidity: 0.10,
  knowledge: 0.10,
  lossAversion: 0.05
};

// Investor type thresholds (inclusive upper bounds)
const INVESTOR_TYPE_THRESHOLDS = [
  { min: 0, max: 20, type: 'Very Conservative' as InvestorType },
  { min: 21, max: 40, type: 'Conservative' as InvestorType },
  { min: 41, max: 60, type: 'Balanced' as InvestorType },
  { min: 61, max: 80, type: 'Growth' as InvestorType },
  { min: 81, max: 100, type: 'Aggressive' as InvestorType }
];

// Allocation bands by investor type
const ALLOCATION_BANDS: Record<InvestorType, AllocationBand> = {
  'Very Conservative': { equity: '10-20%', debt: '55-70%', gold: '5-10%', cash: '10-20%' },
  'Conservative': { equity: '20-35%', debt: '45-60%', gold: '5-10%', cash: '10-15%' },
  'Balanced': { equity: '40-60%', debt: '30-45%', gold: '5-10%', cash: '5-10%' },
  'Growth': { equity: '65-80%', debt: '15-30%', gold: '5-10%', cash: '0-5%' },
  'Aggressive': { equity: '80-95%', debt: '0-15%', gold: '5-10%', cash: '0-5%' }
};

/**
 * Score risk profile from quiz answers
 */
export const scoreRiskProfile = (answers: Record<string, number>): RiskProfileResult => {
  // Calculate dimension scores
  const dimensions: DimensionScore[] = [
    {
      dimension: 'tolerance',
      label: 'Risk Tolerance',
      score: ((answers.Q1 + answers.Q2) / 2 / 5) * 100
    },
    {
      dimension: 'capacity',
      label: 'Risk Capacity',
      score: ((answers.Q3 + answers.Q4) / 2 / 5) * 100
    },
    {
      dimension: 'horizon',
      label: 'Time Horizon',
      score: ((answers.Q5 + answers.Q6) / 2 / 5) * 100
    },
    {
      dimension: 'liquidity',
      label: 'Liquidity Needs',
      score: (((6 - answers.Q7) + (6 - answers.Q8)) / 2 / 5) * 100 // Reverse scored
    },
    {
      dimension: 'knowledge',
      label: 'Investment Knowledge',
      score: ((answers.Q9 + answers.Q10) / 2 / 5) * 100
    },
    {
      dimension: 'lossAversion',
      label: 'Loss Tolerance',
      score: (((6 - answers.Q11) + (6 - answers.Q12)) / 2 / 5) * 100 // Reverse scored
    }
  ];

  // Calculate overall weighted score
  const overall = dimensions.reduce((sum, dim) => {
    const weight = DIMENSION_WEIGHTS[dim.dimension];
    return sum + (dim.score * weight);
  }, 0);

  // Determine investor type
  const investorType = INVESTOR_TYPE_THRESHOLDS.find(
    threshold => overall >= threshold.min && overall <= threshold.max
  )?.type || 'Balanced';

  return {
    answers,
    dimensions,
    overall: Math.round(overall),
    investorType,
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
};

/**
 * Get allocation bands for investor type
 */
export const getAllocationBands = (investorType: InvestorType): AllocationBand => {
  return ALLOCATION_BANDS[investorType];
};

/**
 * Check if user needs special notes based on capacity/liquidity
 */
export const getSpecialNotes = (dimensions: DimensionScore[]): string[] => {
  const notes: string[] = [];
  
  const capacity = dimensions.find(d => d.dimension === 'capacity')?.score || 0;
  const liquidity = dimensions.find(d => d.dimension === 'liquidity')?.score || 0;
  
  if (capacity < 50 || liquidity < 50) {
    notes.push("Consider a larger cash buffer until income stabilizes or emergency fund is adequate.");
  }
  
  return notes;
};

/**
 * Get top contributing dimensions
 */
export const getTopDrivers = (dimensions: DimensionScore[]): Array<{dimension: string, score: number}> => {
  return dimensions
    .map(d => ({ dimension: d.label, score: d.score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

/**
 * Save risk profile to localStorage
 */
export const saveRiskProfile = async (profile: RiskProfileResult, name: string = 'My Risk Profile'): Promise<{ id: string }> => {
  const id = `profile_${Date.now()}`;
  const savedProfile: SavedProfile = {
    id,
    name,
    result: profile,
    createdAt: new Date().toISOString()
  };
  
  // Save to localStorage
  const existingProfiles = loadAllRiskProfiles();
  const updatedProfiles = [...existingProfiles, savedProfile];
  localStorage.setItem('riskProfiles', JSON.stringify(updatedProfiles));
  localStorage.setItem('riskProfile.latest', JSON.stringify(profile));
  
  return { id };
};

/**
 * Load latest risk profile from localStorage
 */
export const loadRiskProfile = (): RiskProfileResult | null => {
  try {
    const stored = localStorage.getItem('riskProfile.latest');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Load all saved risk profiles
 */
export const loadAllRiskProfiles = (): SavedProfile[] => {
  try {
    const stored = localStorage.getItem('riskProfiles');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Export profile as JSON blob
 */
export const exportRiskProfile = (profile: RiskProfileResult, filename?: string) => {
  const dataStr = JSON.stringify(profile, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename || `risk-profile-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};