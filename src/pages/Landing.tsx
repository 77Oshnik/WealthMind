import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Brain, 
  Shield, 
  Target, 
  Zap, 
  TrendingUp,
  Bot,
  Sparkles,
  Star,
  CheckCircle,
  PiggyBank,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-finance.jpg';

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: Brain,
      title: "AI Financial Coach",
      description: "24/7 personalized guidance that learns from your spending patterns"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live tracking and instant alerts for smarter financial decisions"
    },
    {
      icon: Target,
      title: "Smart Goal Setting",
      description: "AI-powered recommendations for achievable savings targets"
    },
    {
      icon: Shield,
      title: "Financial Security",
      description: "Emergency fund planning and risk assessment tools"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-ai-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* AI Status Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-ai-primary/10 border border-ai-primary/20">
              <Bot className="w-4 h-4 text-ai-primary" />
              <span className="text-sm font-medium text-ai-primary">Powered by Advanced AI</span>
              <div className="w-2 h-2 bg-ai-primary rounded-full animate-pulse" />
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-ai-primary to-accent bg-clip-text text-transparent">
                Your AI Financial
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-ai-secondary bg-clip-text text-transparent">
                Coach Awaits
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of personal finance with an autonomous AI agent that adapts to your unique spending patterns, 
              predicts your financial needs, and guides you toward prosperity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary via-ai-primary to-accent text-white border-none shadow-2xl hover:shadow-ai-primary/30 transition-all duration-500 hover:scale-105 transform">
                <Link to="/dashboard" className="flex items-center gap-3 px-8 py-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-ai-primary/80 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Sparkles className="w-6 h-6 animate-pulse relative z-10" />
                  <span className="text-lg font-semibold relative z-10">Start Your Financial Journey</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="group relative overflow-hidden border-2 border-accent/30 text-accent hover:bg-accent/10 shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:scale-105 transform px-6 py-4">
                <Link to="/investment-features" className="flex items-center gap-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <TrendingUp className="w-5 h-5 animate-pulse relative z-10" />
                  <span className="text-lg font-medium relative z-10">Build Your Wealth Portfolio</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <CheckCircle className="w-5 h-5 text-success animate-pulse" />
                  <div className="absolute inset-0 w-5 h-5 rounded-full bg-success/20 animate-ping" />
                </div>
                <span className="font-medium text-foreground group-hover:text-success transition-colors duration-300">100% Secure & Private</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <CheckCircle className="w-5 h-5 text-ai-primary animate-pulse" />
                  <div className="absolute inset-0 w-5 h-5 rounded-full bg-ai-primary/20 animate-ping" />
                </div>
                <span className="font-medium text-foreground group-hover:text-ai-primary transition-colors duration-300">AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <CheckCircle className="w-5 h-5 text-accent animate-pulse" />
                  <div className="absolute inset-0 w-5 h-5 rounded-full bg-accent/20 animate-ping" />
                </div>
                <span className="font-medium text-foreground group-hover:text-accent transition-colors duration-300">Real-time Monitoring</span>
              </div>
            </div>

            {/* Additional Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/50">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/50">
                <Brain className="w-4 h-4 text-ai-primary" />
                <span className="text-sm font-medium">Smart Predictions</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/50">
                <Target className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Goal Achievement</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/50">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Instant Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-ai-primary/10 text-ai-primary border-ai-primary/20">
              <Brain className="w-3 h-3 mr-1" />
              Autonomous Intelligence
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Your Personal <span className="text-ai-primary">AI Agent</span> Works 24/7
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlike traditional finance apps, our AI agent continuously learns, adapts, and proactively helps you make better financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`financial-card cursor-pointer transition-all duration-300 ${
                    activeFeature === index 
                      ? 'ring-2 ring-ai-primary/20 bg-ai-primary/5 scale-[1.02]' 
                      : 'hover:scale-[1.01]'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        activeFeature === index 
                          ? 'bg-ai-primary text-white' 
                          : 'bg-ai-primary/10 text-ai-primary'
                      } transition-colors duration-300`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Demo Visualization */}
            <div className="relative">
              <Card className="financial-card bg-gradient-to-br from-ai-primary/5 to-ai-secondary/5 border-ai-primary/20">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-ai-primary/10 rounded-full">
                      <Bot className="w-4 h-4 text-ai-primary" />
                      <span className="text-sm font-medium text-ai-primary">AI Agent Active</span>
                      <div className="w-2 h-2 bg-ai-primary rounded-full animate-ping" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Live Financial Analysis</h3>
                    <p className="text-muted-foreground">Your AI coach is working right now</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                      <TrendingUp className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm font-medium">Savings optimized</p>
                        <p className="text-xs text-muted-foreground">Found $127 in potential savings</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-ai-primary/10 rounded-lg border border-ai-primary/20">
                      <Brain className="w-5 h-5 text-ai-primary" />
                      <div>
                        <p className="text-sm font-medium">Pattern analyzed</p>
                        <p className="text-xs text-muted-foreground">Spending behavior updated</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <Zap className="w-5 h-5 text-warning" />
                      <div>
                        <p className="text-sm font-medium">Alert generated</p>
                        <p className="text-xs text-muted-foreground">Budget threshold reached</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-ai-primary/10 to-ai-secondary/10 rounded-lg border border-ai-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-ai-primary" />
                      <span className="text-sm font-medium text-ai-primary">AI Recommendation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Based on your spending patterns, I recommend increasing your vacation fund by $50/month. 
                      You'll reach your goal 2 months earlier!"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="px-6 py-20 bg-gradient-to-r from-ai-primary/5 via-primary/5 to-accent/5">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose Our <span className="text-ai-primary">AI Financial Coach</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Experience financial coaching that adapts to your unique situation and goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="financial-card hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-ai-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Learns Your Habits</h3>
                <p className="text-muted-foreground">
                  Our AI studies your spending patterns and adapts recommendations to your lifestyle and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="financial-card hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <PiggyBank className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Proactive Savings</h3>
                <p className="text-muted-foreground">
                  Get personalized savings strategies that automatically adjust based on your income and expenses.
                </p>
              </CardContent>
            </Card>

            <Card className="financial-card hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-ai-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Achievable Goals</h3>
                <p className="text-muted-foreground">
                  Set realistic financial goals with AI-powered insights that keep you motivated and on track.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your <span className="text-ai-primary">Financial Future</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands who've already discovered the power of AI-driven financial coaching.
          </p>
          
          <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary via-ai-primary to-accent text-white border-none shadow-2xl hover:shadow-ai-primary/30 transition-all duration-500 hover:scale-110 transform px-10 py-5">
            <Link to="/dashboard" className="flex items-center gap-4">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-ai-primary/80 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Bot className="w-6 h-6 animate-bounce relative z-10" />
              <span className="text-xl font-bold relative z-10">Launch Your AI Financial Coach</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;