// Box-Muller transform for generating normal random variables
export function boxMuller(): [number, number] {
  const u1 = Math.random();
  const u2 = Math.random();
  
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
  
  return [z0, z1];
}

// Convert periodic contribution to monthly equivalent
export function toMonthlyContribution(amount: number, frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'): number {
  switch (frequency) {
    case 'daily':
      return amount * 30.44; // Average days per month
    case 'weekly':
      return amount * 4.345; // Average weeks per month
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    default:
      return amount;
  }
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
export function formatPercent(value: number, decimals = 1): string {
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