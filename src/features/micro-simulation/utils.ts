// Box-Muller transform for generating normal random variables
export function boxMuller(): [number, number] {
  const u1 = Math.random();
  const u2 = Math.random();
  
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
  
  return [z0, z1];
}

// Convert periodic contribution to monthly equivalent
export function toMonthlyContribution(amount: number, frequency: 'daily' | 'weekly' | 'monthly'): number {
  switch (frequency) {
    case 'daily':
      return amount * 30.44; // Average days per month
    case 'weekly':
      return amount * 4.345; // Average weeks per month
    case 'monthly':
      return amount;
    default:
      return amount;
  }
}

// Calculate round-up contributions
export function calculateRoundUps(
  avgTxPerMonth: number,
  avgTxAmount: number,
  roundUpTo: number,
  multiplier: number
): number {
  if (avgTxPerMonth <= 0 || avgTxAmount <= 0) return 0;
  
  // Calculate average round-up per transaction
  const avgRoundUp = roundUpTo - (avgTxAmount % roundUpTo);
  
  // Total monthly round-ups
  return avgTxPerMonth * avgRoundUp * multiplier;
}

// Future value of annuity formula
export function futureValueAnnuity(monthlyPayment: number, monthlyRate: number, numMonths: number): number {
  if (monthlyRate === 0) {
    return monthlyPayment * numMonths;
  }
  
  return monthlyPayment * (Math.pow(1 + monthlyRate, numMonths) - 1) / monthlyRate;
}

// Future value of lump sum
export function futureValueLumpSum(presentValue: number, annualRate: number, years: number): number {
  return presentValue * Math.pow(1 + annualRate, years);
}

// Format currency
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// Calculate percentiles from array
export function calculatePercentiles(values: number[], percentiles: number[]): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  
  return percentiles.map(p => {
    const index = (p / 100) * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    if (upper >= n) return sorted[n - 1];
    if (lower < 0) return sorted[0];
    
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  });
}

// Generate milestone estimates
export function estimateMilestones(
  monthlyContribution: number,
  expectedAnnualReturn: number,
  lumpSum: number = 0
): { amount: number; months: number }[] {
  const milestones = [1000, 5000, 10000, 25000, 50000, 100000];
  const monthlyRate = expectedAnnualReturn / 12;
  
  return milestones.map(target => {
    if (lumpSum >= target) {
      return { amount: target, months: 0 };
    }
    
    const targetNet = target - lumpSum;
    
    if (monthlyContribution <= 0) {
      return { amount: target, months: Infinity };
    }
    
    if (monthlyRate === 0) {
      return { amount: target, months: Math.ceil(targetNet / monthlyContribution) };
    }
    
    // Solve for n in: FV = PMT * ((1+r)^n - 1) / r + PV * (1+r)^n = target
    // Using approximation for reasonable values
    let months = 1;
    let currentValue = lumpSum;
    
    while (currentValue < target && months < 600) { // Cap at 50 years
      currentValue = lumpSum * Math.pow(1 + monthlyRate, months) + 
                    futureValueAnnuity(monthlyContribution, monthlyRate, months);
      months++;
    }
    
    return { amount: target, months: months - 1 };
  }).filter(m => m.months < 600);
}