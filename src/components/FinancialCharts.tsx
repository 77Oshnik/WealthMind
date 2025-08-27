import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Calendar
} from 'lucide-react';

// Sample data generators with realistic financial patterns
const generateSpendingData = () => {
  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare'];
  const colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--ai-primary))', 'hsl(var(--spending))'];
  
  return categories.map((category, index) => ({
    category,
    amount: Math.floor(Math.random() * 800) + 200,
    color: colors[index],
    percentage: Math.floor(Math.random() * 30) + 10,
  }));
};

const generateIncomeExpenseData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(month => ({
    month,
    income: Math.floor(Math.random() * 1000) + 3500,
    expenses: Math.floor(Math.random() * 800) + 2200,
    savings: Math.floor(Math.random() * 600) + 800,
  }));
};

const generateCashFlowData = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  
  return days.map(day => ({
    day: `${day}`,
    balance: Math.floor(Math.random() * 2000) + 8000 + (day * 50),
    inflow: Math.floor(Math.random() * 300) + 100,
    outflow: Math.floor(Math.random() * 250) + 50,
  }));
};

interface FinancialChartsProps {
  className?: string;
}

export function FinancialCharts({ className }: FinancialChartsProps) {
  const [spendingData, setSpendingData] = useState(generateSpendingData());
  const [incomeExpenseData, setIncomeExpenseData] = useState(generateIncomeExpenseData());
  const [cashFlowData, setCashFlowData] = useState(generateCashFlowData());
  const [activeChart, setActiveChart] = useState('overview');

  // Update data periodically to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpendingData(generateSpendingData());
      setIncomeExpenseData(generateIncomeExpenseData());
      setCashFlowData(generateCashFlowData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.dataKey}:</span>
              <span className="font-medium">${entry.value?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="overview" className="text-xs">
            <BarChart3 className="w-3 h-3 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="spending" className="text-xs">
            <PieChartIcon className="w-3 h-3 mr-1" />
            Spending
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="text-xs">
            <Activity className="w-3 h-3 mr-1" />
            Cash Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="financial-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Income vs Expenses
                </span>
                <Badge variant="outline" className="bg-ai-primary/10 text-ai-primary border-ai-primary/20 text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeExpenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="income" 
                      fill="hsl(var(--success))" 
                      radius={[4, 4, 0, 0]}
                      name="Income"
                    />
                    <Bar 
                      dataKey="expenses" 
                      fill="hsl(var(--warning))" 
                      radius={[4, 4, 0, 0]}
                      name="Expenses"
                    />
                    <Bar 
                      dataKey="savings" 
                      fill="hsl(var(--accent))" 
                      radius={[4, 4, 0, 0]}
                      name="Savings"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <Card className="financial-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base">
                  <PieChartIcon className="w-4 h-4 text-primary" />
                  Spending by Category
                </span>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                  This Month
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="amount"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                      labelFormatter={(label) => `Category: ${label}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="financial-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Financial Trends
                </span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  6 Months
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeExpenseData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="hsl(var(--success))"
                      fill="url(#incomeGradient)"
                      strokeWidth={2}
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="hsl(var(--warning))"
                      fill="url(#expenseGradient)"
                      strokeWidth={2}
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card className="financial-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-base">
                  <Activity className="w-4 h-4 text-primary" />
                  Daily Cash Flow
                </span>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
                  Last 30 Days
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--primary-glow))' }}
                      name="Balance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}