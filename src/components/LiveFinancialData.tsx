import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Zap,
  Eye
} from 'lucide-react';

interface LiveDataPoint {
  id: string;
  type: 'income' | 'expense' | 'saving' | 'alert';
  amount: number;
  description: string;
  timestamp: Date;
  category: string;
}

export const LiveFinancialData = () => {
  const [liveData, setLiveData] = useState<LiveDataPoint[]>([]);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const mockTransactions = [
    { type: 'expense', amount: -15.99, description: 'Coffee Shop Purchase', category: 'Food & Dining' },
    { type: 'income', amount: 250.00, description: 'Freelance Payment', category: 'Income' },
    { type: 'expense', amount: -89.99, description: 'Grocery Shopping', category: 'Food & Dining' },
    { type: 'saving', amount: 50.00, description: 'Auto-Save Transfer', category: 'Savings' },
    { type: 'alert', amount: 0, description: 'Budget Alert: Dining category at 85%', category: 'Alert' },
    { type: 'expense', amount: -12.99, description: 'Netflix Subscription', category: 'Entertainment' },
    { type: 'income', amount: 1250.00, description: 'Salary Deposit', category: 'Income' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTransaction = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
      
      const newDataPoint: LiveDataPoint = {
        id: Date.now().toString(),
        type: randomTransaction.type as any,
        amount: randomTransaction.amount,
        description: randomTransaction.description,
        timestamp: new Date(),
        category: randomTransaction.category
      };

      setLiveData(prev => [newDataPoint, ...prev.slice(0, 9)]); // Keep last 10 items
      
      // Trigger AI analysis animation
      setAiAnalyzing(true);
      setTimeout(() => setAiAnalyzing(false), 2000);
    }, 8000); // New transaction every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'expense':
        return <TrendingDown className="w-4 h-4 text-danger" />;
      case 'saving':
        return <DollarSign className="w-4 h-4 text-primary" />;
      case 'alert':
        return <Activity className="w-4 h-4 text-warning" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-success/10 text-success border-success/20';
      case 'expense':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'saving':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'alert':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="financial-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Live Financial Activity
          </div>
          <div className="flex items-center gap-2">
            {aiAnalyzing && (
              <Badge variant="outline" className="bg-ai-primary/10 text-ai-primary border-ai-primary/20 ai-processing">
                <Zap className="w-3 h-3 mr-1" />
                AI Analyzing
              </Badge>
            )}
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <Eye className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {liveData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Waiting for financial activity...</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {liveData.map((item, index) => (
              <div
                key={item.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg border
                  ₹{getTypeColor(item.type)}
                  ₹{index === 0 ? 'live-update' : ''}
                  transition-all hover:scale-[1.02]
                `}
              >
                <div className="flex items-center gap-3">
                  {getTypeIcon(item.type)}
                  <div>
                    <p className="font-medium text-sm">{item.description}</p>
                    <p className="text-xs opacity-70">
                      {item.timestamp.toLocaleTimeString()} • {item.category}
                    </p>
                  </div>
                </div>
                
                {item.amount !== 0 && (
                  <div className="text-right">
                    <p className={`font-semibold ₹{
                      item.amount > 0 ? 'text-success' : 'text-danger'
                    }`}>
                      {item.amount > 0 ? '+' : ''}₹{Math.abs(item.amount).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {aiAnalyzing && (
          <div className="mt-4 p-3 bg-ai-primary/5 border border-ai-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ai-primary rounded-full animate-ping" />
              <p className="text-sm text-ai-primary">
                AI is analyzing this transaction for insights and optimization opportunities...
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
