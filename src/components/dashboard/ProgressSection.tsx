import { SafeToSpendGauge } from '@/components/SafeToSpendGauge';
import { ProgressMeter } from '@/components/ProgressMeter';
import { LiveFinancialData } from '@/components/LiveFinancialData';

export const ProgressSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Safe to Spend Gauge */}
      <SafeToSpendGauge
        amount={1410}
        percentage={68}
        trend="up"
        monthlyBudget={2500}
      />

      {/* Emergency Fund Progress */}
      <ProgressMeter
        title="Emergency Fund"
        current={8500}
        target={12000}
        color="hsl(var(--success))"
      />

      {/* Vacation Savings */}
      <ProgressMeter
        title="Dream Vacation"
        current={2350}
        target={5000}
        color="hsl(var(--accent))"
      />

      {/* Live Financial Data */}
      <LiveFinancialData />
    </div>
  );
};