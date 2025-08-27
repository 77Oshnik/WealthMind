import { FinancialMetricCard } from '@/components/FinancialMetricCard';
import { DollarSign, TrendingUp, PiggyBank, Shield } from 'lucide-react';

export const FinancialOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinancialMetricCard
        title="Total Income"
        value="$4,250"
        change="+12% from last month"
        changeType="positive"
        icon={DollarSign}
        gradient="bg-gradient-to-br from-income to-primary-glow"
      />
      <FinancialMetricCard
        title="Total Expenses"
        value="$2,840"
        change="-5% from last month"
        changeType="positive"
        icon={TrendingUp}
        gradient="bg-gradient-to-br from-spending to-warning"
      />
      <FinancialMetricCard
        title="Savings Rate"
        value="33%"
        change="+8% improvement"
        changeType="positive"
        icon={PiggyBank}
        gradient="bg-gradient-to-br from-savings to-accent-glow"
      />
      <FinancialMetricCard
        title="Emergency Fund"
        value="$8,500"
        change="Goal: $12,000"
        changeType="neutral"
        icon={Shield}
        gradient="bg-gradient-to-br from-success to-accent"
      />
    </div>
  );
};