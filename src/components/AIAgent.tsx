import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bot, 
  Send, 
  Zap, 
  TrendingUp, 
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  status?: 'processing' | 'complete';
  action?: string;
}

interface AIAgentProps {
  onInsightGenerated?: (insight: string) => void;
}

export const AIAgent = ({ onInsightGenerated }: AIAgentProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi Arjun! I'm your AI Financial Coach. I've been analyzing your spending patterns and I have some insights ready for you! 🤖✨",
      timestamp: new Date(),
      status: 'complete'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const aiSuggestions = [
    "Analyze my spending patterns",
    "Review my emergency fund progress", 
    "Optimize my monthly budget",
    "Find savings opportunities",
    "Check my financial health score"
  ];

  const aiResponses = {
    "analyze": "I've analyzed your spending! 📊 You're spending 23% more on subscriptions than last month. I found 3 unused subscriptions costing ₹3,500/month. Want me to help you cancel them?",
    "emergency": "Great news! 🎉 Your emergency fund is at 71% of your target. Based on your current savings rate, you'll reach your ₹9,00,000 goal in 4.2 months. I recommend increasing your automatic transfer by ₹15,000/month to reach it faster.",
    "budget": "I've optimized your budget! 💡 By reallocating ₹11,000 from dining out to savings, you could increase your savings rate to 38%. This would help you reach financial goals 15% faster!",
    "savings": "Found 5 saving opportunities! 💰 Cancel unused subscriptions (₹3,500/month), switch to generic brands (₹6,300/month), reduce delivery fees (₹2,400/month). Total potential savings: ₹12,200/month!",
    "health": "Your financial health score improved to 89! 🌟 You're excelling at budgeting (95%) and saving (87%). Focus on reducing impulse purchases to reach 95+ overall score."
  };

  const simulateAIWork = async (query: string) => {
    setIsProcessing(true);
    setIsTyping(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsTyping(false);
    
    const responseKey = Object.keys(aiResponses).find(key => 
      query.toLowerCase().includes(key)
    ) || 'analyze';
    
    const response = aiResponses[responseKey as keyof typeof aiResponses];
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      status: 'complete',
      action: 'analysis_complete'
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsProcessing(false);
    
    if (onInsightGenerated) {
      onInsightGenerated(response);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'complete'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    await simulateAIWork(inputValue);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date(),
      status: 'complete'
    };

    setMessages(prev => [...prev, userMessage]);
    await simulateAIWork(suggestion);
  };

  // Auto-generate insights
  useEffect(() => {
    const interval = setInterval(() => {
      const insights = [
        "I noticed your coffee spending is up 12% this week. Want me to find cheaper alternatives nearby?",
        "Your savings rate is trending upward! You're on track to exceed your monthly goal by ₹11,000.",
        "I found a better interest rate for your emergency fund. Switching could earn you ₹3,300 more per year.",
        "Your utility bills seem higher than usual. I can help you optimize your energy usage."
      ];
      
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `💡 Smart Insight: ${randomInsight}`,
        timestamp: new Date(),
        status: 'complete',
        action: 'auto_insight'
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isClosed) {
    return null;
  }

  return (
    <Card className="ai-agent-card h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="w-5 h-5 text-ai-primary" />
              {isProcessing && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-ai-primary rounded-full animate-ping" />
              )}
            </div>
            AI Financial Coach
            {isProcessing && (
              <span className="text-xs bg-ai-primary/10 text-ai-primary px-2 py-1 rounded-full ai-processing">
                Analyzing...
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setIsClosed(true)}
          >
            <X className="w-3 h-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <Avatar className="w-8 h-8 border-2 border-ai-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-ai-primary to-ai-secondary text-white text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-primary to-ai-primary text-white ml-auto'
                      : 'bg-ai-primary/10 border border-ai-primary/20 text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.action && (
                      <div className="flex items-center gap-1">
                        {message.action === 'analysis_complete' && (
                          <CheckCircle className="w-3 h-3 text-success" />
                        )}
                        {message.action === 'auto_insight' && (
                          <Zap className="w-3 h-3 text-ai-primary" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 border-2 border-ai-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-ai-primary to-ai-secondary text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-ai-primary/10 border border-ai-primary/20 p-3 rounded-lg">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-ai-primary rounded-full ai-thinking-dots" />
                    <div className="w-2 h-2 bg-ai-primary rounded-full ai-thinking-dots" style={{animationDelay: '0.2s'}} />
                    <div className="w-2 h-2 bg-ai-primary rounded-full ai-thinking-dots" style={{animationDelay: '0.4s'}} />
                    <span className="text-xs text-ai-primary ml-2">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs border-ai-primary/30 text-ai-primary hover:bg-ai-primary/10"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isProcessing}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your AI coach anything..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};