import { 
  MicroSimulationInputs, 
  SimulationResult, 
  MonteCarloResult, 
  YearlySnapshot,
  AssetAssumptions,
  AssetAllocation
} from '../types';
import { 
  boxMuller,
  toMonthlyContribution,
  calculateRoundUps,
  futureValueAnnuity,
  futureValueLumpSum,
  calculatePercentiles
} from '../utils';

// Default asset assumptions (editable)
export const DEFAULT_ASSET_ASSUMPTIONS: AssetAssumptions = {
  equity: { mu: 0.08, sigma: 0.18 },
  bonds: { mu: 0.04, sigma: 0.06 },
  cash: { mu: 0.02, sigma: 0.01 },
  gold: { mu: 0.03, sigma: 0.25 }
};

export const DEFAULT_ALLOCATIONS = {
  conservative: { equity: 0.3, bonds: 0.6, cash: 0.1, gold: 0.0 },
  balanced: { equity: 0.6, bonds: 0.3, cash: 0.05, gold: 0.05 },
  growth: { equity: 0.8, bonds: 0.15, cash: 0.05, gold: 0.0 }
};

// Calculate total monthly contribution
export function calculateTotalMonthlyContribution(inputs: MicroSimulationInputs): number {
  const periodicMonthly = toMonthlyContribution(inputs.periodicAmount, inputs.frequency);
  const roundUpMonthly = calculateRoundUps(
    inputs.roundUpAvgTxPerMonth,
    inputs.avgTxAmount,
    inputs.roundUpTo,
    inputs.roundUpMultiplier
  );
  
  return periodicMonthly + roundUpMonthly;
}

// Calculate portfolio-weighted expected return and volatility
export function calculatePortfolioMetrics(
  allocation: AssetAllocation,
  assumptions: AssetAssumptions = DEFAULT_ASSET_ASSUMPTIONS
): { expectedReturn: number; volatility: number } {
  const assets = Object.keys(allocation) as Array<keyof AssetAllocation>;
  
  let expectedReturn = 0;
  let variance = 0;
  
  assets.forEach(asset => {
    const weight = allocation[asset];
    const assetReturn = assumptions[asset].mu;
    const assetVol = assumptions[asset].sigma;
    
    expectedReturn += weight * assetReturn;
    variance += weight * weight * assetVol * assetVol;
  });
  
  return {
    expectedReturn,
    volatility: Math.sqrt(variance)
  };
}

// Deterministic simulation
export function simulateDeterministic(inputs: MicroSimulationInputs): SimulationResult {
  const monthlyContribution = calculateTotalMonthlyContribution(inputs);
  const { expectedReturn } = calculatePortfolioMetrics(inputs.assetAllocation);
  
  // Apply fees
  const netAnnualReturn = expectedReturn - inputs.feeEstimate;
  const monthlyRate = netAnnualReturn / 12;
  const numMonths = inputs.durationYears * 12;
  
  // Calculate future values
  const lumpSumFV = inputs.lumpSum > 0 ? 
    futureValueLumpSum(inputs.lumpSum, netAnnualReturn, inputs.durationYears) : 0;
  
  const annuityFV = monthlyContribution > 0 ? 
    futureValueAnnuity(monthlyContribution, monthlyRate, numMonths) : 0;
  
  const finalValue = lumpSumFV + annuityFV;
  const totalContributions = inputs.lumpSum + (monthlyContribution * numMonths);
  
  // Generate yearly snapshots
  const yearlySnapshots: YearlySnapshot[] = [];
  
  for (let year = 0; year <= inputs.durationYears; year++) {
    const monthsElapsed = year * 12;
    const contributionsToDate = inputs.lumpSum + (monthlyContribution * monthsElapsed);
    
    const lumpSumValueAtYear = inputs.lumpSum > 0 ? 
      futureValueLumpSum(inputs.lumpSum, netAnnualReturn, year) : 0;
    
    const annuityValueAtYear = monthlyContribution > 0 && monthsElapsed > 0 ? 
      futureValueAnnuity(monthlyContribution, monthlyRate, monthsElapsed) : 0;
    
    const portfolioValue = lumpSumValueAtYear + annuityValueAtYear;
    const returns = portfolioValue - contributionsToDate;
    
    yearlySnapshots.push({
      year,
      contributions: contributionsToDate,
      portfolioValue,
      returns
    });
  }
  
  return {
    inputs,
    yearlySnapshots,
    finalValue,
    totalContributions,
    totalReturns: finalValue - totalContributions,
    monthlyContribution
  };
}

// Monte Carlo simulation
export function simulateMonteCarlo(inputs: MicroSimulationInputs): MonteCarloResult {
  const monthlyContribution = calculateTotalMonthlyContribution(inputs);
  const { expectedReturn, volatility } = calculatePortfolioMetrics(inputs.assetAllocation);
  
  // Apply fees
  const netAnnualReturn = expectedReturn - inputs.feeEstimate;
  const monthlyReturn = netAnnualReturn / 12;
  const monthlyVol = volatility / Math.sqrt(12);
  
  const numMonths = inputs.durationYears * 12;
  const numSims = inputs.numSimulations;
  
  // Store all simulation paths
  const allPaths: number[][] = [];
  const finalValues: number[] = [];
  
  for (let sim = 0; sim < numSims; sim++) {
    const path: number[] = [inputs.lumpSum];
    let balance = inputs.lumpSum;
    
    for (let month = 1; month <= numMonths; month++) {
      // Add monthly contribution at beginning of period
      balance += monthlyContribution;
      
      // Apply stochastic return
      const [z] = boxMuller();
      const monthlyFactor = Math.exp(monthlyReturn - 0.5 * monthlyVol * monthlyVol + monthlyVol * z);
      balance *= monthlyFactor;
      
      // Store value at end of each month
      if (month % 12 === 0) {
        path.push(balance);
      }
    }
    
    allPaths.push(path);
    finalValues.push(balance);
  }
  
  // Calculate percentiles for each year
  const percentiles: { year: number; p10: number; p50: number; p90: number }[] = [];
  
  for (let year = 0; year <= inputs.durationYears; year++) {
    const valuesAtYear = allPaths.map(path => path[year] || 0);
    const [p10, p50, p90] = calculatePercentiles(valuesAtYear, [10, 50, 90]);
    
    percentiles.push({ year, p10, p50, p90 });
  }
  
  // Calculate final statistics
  const [finalP10, finalMedian, finalP90] = calculatePercentiles(finalValues, [10, 50, 90]);
  const finalMean = finalValues.reduce((sum, val) => sum + val, 0) / finalValues.length;
  const finalVariance = finalValues.reduce((sum, val) => sum + Math.pow(val - finalMean, 2), 0) / finalValues.length;
  const finalStddev = Math.sqrt(finalVariance);
  
  // Generate yearly snapshots using median path
  const yearlySnapshots: YearlySnapshot[] = [];
  const totalContributions = inputs.lumpSum + (monthlyContribution * numMonths);
  
  for (let year = 0; year <= inputs.durationYears; year++) {
    const contributionsToDate = inputs.lumpSum + (monthlyContribution * year * 12);
    const portfolioValue = percentiles[year].p50;
    const returns = portfolioValue - contributionsToDate;
    
    yearlySnapshots.push({
      year,
      contributions: contributionsToDate,
      portfolioValue,
      returns
    });
  }
  
  return {
    inputs,
    yearlySnapshots,
    finalValue: finalMedian,
    totalContributions,
    totalReturns: finalMedian - totalContributions,
    monthlyContribution,
    percentiles,
    finalStats: {
      mean: finalMean,
      median: finalMedian,
      stddev: finalStddev,
      p10: finalP10,
      p90: finalP90
    }
  };
}

// Generate round-up transactions (for demo purposes)
export function generateRoundUps(txCount: number, avgAmount: number, multiplier: number = 1): number[] {
  const transactions: number[] = [];
  
  for (let i = 0; i < txCount; i++) {
    // Generate transaction amount with some variation
    const variation = (Math.random() - 0.5) * avgAmount * 0.5;
    const amount = Math.max(0.01, avgAmount + variation);
    
    // Calculate round-up (assuming round up to nearest dollar)
    const roundUp = (1 - (amount % 1)) * multiplier;
    transactions.push(roundUp);
  }
  
  return transactions;
}