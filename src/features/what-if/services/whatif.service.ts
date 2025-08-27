import { 
  WhatIfInputs, 
  AssetAllocation, 
  SimulationAssumptions, 
  SimulationResults, 
  YearlySnapshot,
  GlidePath,
  MarketShock,
  ScenarioDeltas
} from '../types';
import { toMonthlyContribution, futureValueAnnuity, futureValueLumpSum, boxMuller, calculatePercentiles } from '../utils';

// Asset return assumptions
export const RETURN_SCENARIOS = {
  low: {
    domesticEquity: { mu: 0.06, sigma: 0.18 },
    internationalEquity: { mu: 0.05, sigma: 0.20 },
    bonds: { mu: 0.03, sigma: 0.08 },
    reits: { mu: 0.04, sigma: 0.22 },
    gold: { mu: 0.02, sigma: 0.15 },
    cash: { mu: 0.015, sigma: 0.01 }
  },
  medium: {
    domesticEquity: { mu: 0.08, sigma: 0.18 },
    internationalEquity: { mu: 0.07, sigma: 0.20 },
    bonds: { mu: 0.04, sigma: 0.08 },
    reits: { mu: 0.06, sigma: 0.22 },
    gold: { mu: 0.03, sigma: 0.15 },
    cash: { mu: 0.02, sigma: 0.01 }
  },
  high: {
    domesticEquity: { mu: 0.10, sigma: 0.18 },
    internationalEquity: { mu: 0.09, sigma: 0.20 },
    bonds: { mu: 0.05, sigma: 0.08 },
    reits: { mu: 0.08, sigma: 0.22 },
    gold: { mu: 0.04, sigma: 0.15 },
    cash: { mu: 0.025, sigma: 0.01 }
  }
};

export function applyScenarioDeltas(
  baseInputs: WhatIfInputs,
  baseAllocation: AssetAllocation,
  baseAssumptions: SimulationAssumptions,
  deltas: ScenarioDeltas
): { inputs: WhatIfInputs; allocation: AssetAllocation; assumptions: SimulationAssumptions } {
  const inputs = { ...baseInputs };
  const allocation = { ...baseAllocation };
  const assumptions = { ...baseAssumptions };

  // Apply deltas
  if (deltas.contributionChange) {
    inputs.recurringAmount = inputs.recurringAmount * (1 + deltas.contributionChange / 100);
  }

  if (deltas.startDelayChange) {
    inputs.startDelayMonths = Math.max(0, inputs.startDelayMonths + deltas.startDelayChange);
  }

  if (deltas.allocationChange) {
    Object.assign(allocation, deltas.allocationChange);
  }

  if (deltas.assumptions) {
    Object.assign(assumptions, deltas.assumptions);
  }

  return { inputs, allocation, assumptions };
}

export function calculatePortfolioReturn(
  allocation: AssetAllocation,
  assumptions: SimulationAssumptions
): { expectedReturn: number; volatility: number } {
  let returns: any;
  
  if (assumptions.scenario === 'custom' && assumptions.customReturns) {
    // Convert custom returns to the expected format
    returns = {
      domesticEquity: { mu: assumptions.customReturns.domesticEquity / 100, sigma: 0.18 },
      internationalEquity: { mu: assumptions.customReturns.internationalEquity / 100, sigma: 0.20 },
      bonds: { mu: assumptions.customReturns.bonds / 100, sigma: 0.08 },
      reits: { mu: assumptions.customReturns.reits / 100, sigma: 0.22 },
      gold: { mu: assumptions.customReturns.gold / 100, sigma: 0.15 },
      cash: { mu: assumptions.customReturns.cash / 100, sigma: 0.01 }
    };
  } else {
    returns = RETURN_SCENARIOS[assumptions.scenario === 'custom' ? 'medium' : assumptions.scenario];
  }

  const weights = [
    allocation.domesticEquity / 100,
    allocation.internationalEquity / 100,
    allocation.bonds / 100,
    allocation.reits / 100,
    allocation.gold / 100,
    allocation.cash / 100
  ];

  const assetReturns = [
    returns.domesticEquity.mu,
    returns.internationalEquity.mu,
    returns.bonds.mu,
    returns.reits.mu,
    returns.gold.mu,
    returns.cash.mu
  ];

  const assetVolatilities = [
    returns.domesticEquity.sigma,
    returns.internationalEquity.sigma,
    returns.bonds.sigma,
    returns.reits.sigma,
    returns.gold.sigma,
    returns.cash.sigma
  ];

  const expectedReturn = weights.reduce((sum, weight, i) => sum + weight * assetReturns[i], 0);
  
  // Simple portfolio volatility (assuming no correlation for simplicity)
  const portfolioVariance = weights.reduce((sum, weight, i) => sum + Math.pow(weight * assetVolatilities[i], 2), 0);
  const volatility = Math.sqrt(portfolioVariance);

  // Apply fees and tax drag
  const netReturn = expectedReturn - (assumptions.fees / 100) - (assumptions.taxDrag / 100);

  return { expectedReturn: netReturn, volatility };
}

export function applyGlidePathAllocation(
  baseAllocation: AssetAllocation,
  glidePath: GlidePath,
  currentYear: number
): AssetAllocation {
  if (!glidePath.enabled) return baseAllocation;

  const reductionPeriods = Math.floor(currentYear / glidePath.everyYears);
  const totalReduction = reductionPeriods * glidePath.reduceEquityPercent;
  
  const currentEquityPercent = Math.max(
    glidePath.floorPercent,
    baseAllocation.domesticEquity + baseAllocation.internationalEquity - totalReduction
  );

  const actualReduction = (baseAllocation.domesticEquity + baseAllocation.internationalEquity) - currentEquityPercent;
  
  // Redistribute reduction to bonds and cash proportionally
  const bondsShare = baseAllocation.bonds / (baseAllocation.bonds + baseAllocation.cash + baseAllocation.reits + baseAllocation.gold);
  const cashShare = baseAllocation.cash / (baseAllocation.bonds + baseAllocation.cash + baseAllocation.reits + baseAllocation.gold);
  const reitsShare = baseAllocation.reits / (baseAllocation.bonds + baseAllocation.cash + baseAllocation.reits + baseAllocation.gold);
  const goldShare = baseAllocation.gold / (baseAllocation.bonds + baseAllocation.cash + baseAllocation.reits + baseAllocation.gold);

  return {
    domesticEquity: Math.max(0, baseAllocation.domesticEquity - (actualReduction * baseAllocation.domesticEquity / (baseAllocation.domesticEquity + baseAllocation.internationalEquity))),
    internationalEquity: Math.max(0, baseAllocation.internationalEquity - (actualReduction * baseAllocation.internationalEquity / (baseAllocation.domesticEquity + baseAllocation.internationalEquity))),
    bonds: baseAllocation.bonds + (actualReduction * bondsShare),
    reits: baseAllocation.reits + (actualReduction * reitsShare),
    gold: baseAllocation.gold + (actualReduction * goldShare),
    cash: baseAllocation.cash + (actualReduction * cashShare)
  };
}

export function simulateDeterministic(
  inputs: WhatIfInputs,
  allocation: AssetAllocation,
  assumptions: SimulationAssumptions,
  glidePath?: GlidePath,
  shock?: MarketShock
): SimulationResults {
  const monthlyContribution = toMonthlyContribution(inputs.recurringAmount, inputs.frequency);
  const { expectedReturn } = calculatePortfolioReturn(allocation, assumptions);
  const monthlyRate = expectedReturn / 12;
  
  const yearlySnapshots: YearlySnapshot[] = [];
  let portfolioValue = inputs.lumpSum;
  let totalContributions = inputs.lumpSum;

  for (let year = 0; year <= inputs.timeHorizonYears; year++) {
    // Apply glide path if enabled
    const currentAllocation = glidePath ? applyGlidePathAllocation(allocation, glidePath, year) : allocation;
    const { expectedReturn: yearlyReturn } = calculatePortfolioReturn(currentAllocation, assumptions);
    const yearlyRate = yearlyReturn;

    // Calculate contributions for this year
    let yearlyContributions = 0;
    if (year > 0 && year * 12 > inputs.startDelayMonths) {
      const effectiveMonths = Math.min(12, Math.max(0, 12 - Math.max(0, inputs.startDelayMonths - (year - 1) * 12)));
      const escalatedContribution = monthlyContribution * Math.pow(1 + inputs.annualEscalation / 100, year - 1);
      const monthsContributing = effectiveMonths - inputs.skipMonthsPerYear;
      yearlyContributions = escalatedContribution * monthsContributing;
    }

    // Apply market shock if configured
    if (shock?.enabled && year === shock.year) {
      portfolioValue *= (1 + shock.magnitude / 100);
    }

    // Apply recovery if configured
    if (shock?.enabled && shock.recovery && year === shock.year + 1) {
      portfolioValue *= (1 + shock.recovery / 100);
    }

    // Apply growth
    if (year > 0) {
      portfolioValue *= (1 + yearlyRate);
      portfolioValue += yearlyContributions;
      totalContributions += yearlyContributions;
    }

    yearlySnapshots.push({
      year,
      contributions: totalContributions,
      total: portfolioValue,
      growth: portfolioValue - totalContributions
    });
  }

  const finalValueNominal = portfolioValue;
  const inflationFactor = Math.pow(1 + assumptions.inflation / 100, inputs.timeHorizonYears);
  const finalValueReal = finalValueNominal / inflationFactor;

  // Calculate required monthly if target is set
  let requiredMonthly: number | undefined;
  if (inputs.targetAmount) {
    const targetReal = inputs.targetAmount / inflationFactor;
    const presentValueNeeded = targetReal - (inputs.lumpSum / inflationFactor);
    if (presentValueNeeded > 0) {
      const effectiveMonths = inputs.timeHorizonYears * 12 - inputs.startDelayMonths - (inputs.skipMonthsPerYear * inputs.timeHorizonYears);
      requiredMonthly = presentValueNeeded / futureValueAnnuity(1, monthlyRate, effectiveMonths);
    }
  }

  const successProbability = inputs.targetAmount ? (finalValueReal >= inputs.targetAmount ? 1 : 0) : undefined;

  return {
    yearlySnapshots,
    finalValueNominal,
    finalValueReal,
    totalContributions,
    totalGrowth: finalValueNominal - totalContributions,
    successProbability,
    requiredMonthly
  };
}

export function simulateMonteCarlo(
  inputs: WhatIfInputs,
  allocation: AssetAllocation,
  assumptions: SimulationAssumptions,
  numSimulations: number = 500,
  glidePath?: GlidePath,
  shock?: MarketShock
): SimulationResults {
  const simulations: number[][] = [];
  const finalValues: number[] = [];
  
  for (let sim = 0; sim < numSimulations; sim++) {
    const yearlyValues: number[] = [];
    let portfolioValue = inputs.lumpSum;
    let totalContributions = inputs.lumpSum;
    
    for (let year = 0; year <= inputs.timeHorizonYears; year++) {
      // Apply glide path if enabled
      const currentAllocation = glidePath ? applyGlidePathAllocation(allocation, glidePath, year) : allocation;
      const { expectedReturn, volatility } = calculatePortfolioReturn(currentAllocation, assumptions);

      // Generate random return using Box-Muller
      const [z1] = boxMuller();
      const randomReturn = expectedReturn + volatility * z1;

      // Calculate contributions for this year
      let yearlyContributions = 0;
      if (year > 0 && year * 12 > inputs.startDelayMonths) {
        const effectiveMonths = Math.min(12, Math.max(0, 12 - Math.max(0, inputs.startDelayMonths - (year - 1) * 12)));
        const escalatedContribution = toMonthlyContribution(inputs.recurringAmount, inputs.frequency) * Math.pow(1 + inputs.annualEscalation / 100, year - 1);
        const monthsContributing = effectiveMonths - inputs.skipMonthsPerYear;
        yearlyContributions = escalatedContribution * monthsContributing;
      }

      // Apply market shock if configured
      if (shock?.enabled && year === shock.year) {
        portfolioValue *= (1 + shock.magnitude / 100);
      }

      // Apply recovery if configured
      if (shock?.enabled && shock.recovery && year === shock.year + 1) {
        portfolioValue *= (1 + shock.recovery / 100);
      }

      // Apply growth and contributions
      if (year > 0) {
        portfolioValue *= (1 + randomReturn);
        portfolioValue += yearlyContributions;
        totalContributions += yearlyContributions;
      }

      yearlyValues.push(portfolioValue);
    }
    
    simulations.push(yearlyValues);
    finalValues.push(yearlyValues[yearlyValues.length - 1]);
  }

  // Calculate percentiles for each year
  const percentiles = {
    p10: [] as number[],
    p50: [] as number[],
    p90: [] as number[]
  };

  for (let year = 0; year <= inputs.timeHorizonYears; year++) {
    const yearValues = simulations.map(sim => sim[year]);
    const [p10, p50, p90] = calculatePercentiles(yearValues, [10, 50, 90]);
    percentiles.p10.push(p10);
    percentiles.p50.push(p50);
    percentiles.p90.push(p90);
  }

  // Calculate median path for snapshots
  const yearlySnapshots: YearlySnapshot[] = [];
  let medianContributions = inputs.lumpSum;
  const monthlyContribution = toMonthlyContribution(inputs.recurringAmount, inputs.frequency);

  for (let year = 0; year <= inputs.timeHorizonYears; year++) {
    if (year > 0 && year * 12 > inputs.startDelayMonths) {
      const effectiveMonths = Math.min(12, Math.max(0, 12 - Math.max(0, inputs.startDelayMonths - (year - 1) * 12)));
      const escalatedContribution = monthlyContribution * Math.pow(1 + inputs.annualEscalation / 100, year - 1);
      const monthsContributing = effectiveMonths - inputs.skipMonthsPerYear;
      medianContributions += escalatedContribution * monthsContributing;
    }

    yearlySnapshots.push({
      year,
      contributions: medianContributions,
      total: percentiles.p50[year],
      growth: percentiles.p50[year] - medianContributions
    });
  }

  const finalValueNominal = percentiles.p50[inputs.timeHorizonYears];
  const inflationFactor = Math.pow(1 + assumptions.inflation / 100, inputs.timeHorizonYears);
  const finalValueReal = finalValueNominal / inflationFactor;

  // Calculate success probability
  const successProbability = inputs.targetAmount 
    ? finalValues.filter(value => value / inflationFactor >= inputs.targetAmount!).length / numSimulations
    : undefined;

  return {
    yearlySnapshots,
    finalValueNominal,
    finalValueReal,
    totalContributions: medianContributions,
    totalGrowth: finalValueNominal - medianContributions,
    successProbability,
    worstCase: percentiles.p10[inputs.timeHorizonYears],
    bestCase: percentiles.p90[inputs.timeHorizonYears],
    percentiles
  };
}