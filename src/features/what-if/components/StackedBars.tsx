import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils';
import type { SimulationResults } from '../types';

interface StackedBarsProps {
  results: SimulationResults | null;
  showReal: boolean;
}

export default function StackedBars({ results, showReal }: StackedBarsProps) {
  if (!results) return null;

  const inflationFactor = (year: number) => showReal ? Math.pow(1.06, year) : 1;
  
  const chartData = results.yearlySnapshots.map(snapshot => ({
    year: snapshot.year,
    contributions: snapshot.contributions / inflationFactor(snapshot.year),
    growth: (snapshot.total - snapshot.contributions) / inflationFactor(snapshot.year)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributions vs Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value).replace('₹', '₹')} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="contributions" stackId="a" fill="hsl(var(--secondary))" name="Contributions" />
              <Bar dataKey="growth" stackId="a" fill="hsl(var(--primary))" name="Growth" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}