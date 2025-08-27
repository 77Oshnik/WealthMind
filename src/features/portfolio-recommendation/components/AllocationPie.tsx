import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { AssetAllocation } from '../types';
import { formatPercentage, getAllocationColors, getAssetClassNames } from '../utils';

interface AllocationPieProps {
  allocation: AssetAllocation;
}

const AllocationPie: React.FC<AllocationPieProps> = ({ allocation }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const colors = getAllocationColors();
  const assetNames = getAssetClassNames();
  
  // Prepare data for chart
  const chartData = Object.entries(allocation)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: assetNames[key as keyof AssetAllocation],
      value: value,
      key: key,
      color: colors[key as keyof AssetAllocation]
    }))
    .sort((a, b) => b.value - a.value);

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-semibold">
            {formatPercentage(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={activeIndex === index ? "hsl(var(--border))" : "none"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Breakdown</h4>
          <div className="grid gap-2">
            {chartData.map((item, index) => (
              <div 
                key={item.key}
                className={`flex items-center justify-between p-2 rounded transition-colors ${
                  activeIndex === index ? 'bg-muted/50' : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatPercentage(item.value)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Equity Exposure:</span>
            <span className="font-medium">
              {formatPercentage(allocation.domesticEquity + allocation.internationalEquity)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fixed Income:</span>
            <span className="font-medium">{formatPercentage(allocation.bonds)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Alternative Assets:</span>
            <span className="font-medium">
              {formatPercentage(allocation.reits + allocation.gold)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cash/Liquidity:</span>
            <span className="font-medium">{formatPercentage(allocation.cash)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationPie;