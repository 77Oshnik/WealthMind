import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  TrendingUp,
  Target,
  BarChart3,
  Calculator,
  Calendar,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InvestmentFeaturesPage = () => {
  const investmentFeatures = [
    {
      id: 'risk-profile',
      title: 'Risk Profile Analyzer',
      description: 'Assess your investment risk tolerance with AI-powered analysis',
      icon: BarChart3,
      path: '/features/risk-profile',
      color: 'accent'
    },
    {
      id: 'micro-investment',
      title: 'Micro Investment Simulation',
      description: 'Simulate small-scale investment strategies and outcomes',
      icon: Calculator,
      path: '/investment/micro-simulation',
      color: 'primary'
    },
    {
      id: 'portfolio-recommendation',
      title: 'Portfolio Recommendation',
      description: 'Get personalized portfolio suggestions based on your goals',
      icon: Target,
      path: '/investment/portfolio-recommendation',
      color: 'ai-primary'
    },
    {
      id: 'what-if-simulation',
      title: 'What-If Simulation',
      description: 'Explore different investment scenarios and their potential outcomes',
      icon: Brain,
      path: '/investment/what-if-simulation',
      color: 'ai-secondary'
    },
    {
      id: 'auto-invest-planner',
      title: 'Auto Invest Planner',
      description: 'Plan and automate your investment strategy with AI guidance',
      icon: Calendar,
      path: '/investment/auto-invest-planner',
      color: 'success'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            
            <div className="text-center">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                Investment & Wealth Management
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-accent via-primary to-ai-primary bg-clip-text text-transparent">
                  Investment Features
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore advanced investment tools and wealth management features powered by AI
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentFeatures.map((feature) => (
              <Card 
                key={feature.id}
                className="financial-card hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${feature.color}/10 text-${feature.color} group-hover:bg-${feature.color}/20 transition-colors duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button asChild className="w-full">
                    <Link to={feature.path}>
                      Explore Feature
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-16 text-center">
            <Card className="financial-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">More Features Coming Soon</h3>
                <p className="text-muted-foreground">
                  We're continuously developing new investment and wealth management tools 
                  to help you make smarter financial decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentFeaturesPage;