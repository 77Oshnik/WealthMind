import { FinancialMetricCard } from '@/components/FinancialMetricCard';
import { DollarSign, TrendingUp, PiggyBank, Shield } from 'lucide-react';

export const FinancialOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinancialMetricCard
        title="Total Income"
        value="₹3,25,000"
        change="+12% from last month"
        changeType="positive"
        icon={DollarSign}
        gradient="bg-gradient-to-br from-income to-primary-glow"
      />
      <FinancialMetricCard
        title="Total Expenses"
        value="₹2,15,000"
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
        value="₹6,50,000"
        change="Goal: ₹9,00,000"
        changeType="neutral"
        icon={Shield}
        gradient="bg-gradient-to-br from-success to-accent"
      />
    </div>
  );
};