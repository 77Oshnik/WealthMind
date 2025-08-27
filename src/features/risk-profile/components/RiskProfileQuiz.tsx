import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Calculator } from 'lucide-react';
import { RiskQuestion } from '../types';

interface RiskProfileQuizProps {
  onComplete: (payload: {
    answers: Record<string, number>;
    dimensions: Array<{dimension: string, label: string, score: number}>;
    overall: number;
    investorType: string;
  }) => void;
}

const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: 'Q1',
    dimension: 'tolerance',
    text: 'If my investments drop 10% in a month, I would stay invested.',
  },
  {
    id: 'Q2',
    dimension: 'tolerance', 
    text: "I'm comfortable with high short-term volatility for higher long-term gains.",
  },
  {
    id: 'Q3',
    dimension: 'capacity',
    text: 'My monthly income is stable and predictable.',
  },
  {
    id: 'Q4',
    dimension: 'capacity',
    text: 'I have an emergency fund covering at least 3-6 months of expenses.',
  },
  {
    id: 'Q5',
    dimension: 'horizon',
    text: "I won't need this money for at least 5 years.",
  },
  {
    id: 'Q6',
    dimension: 'horizon',
    text: "I'm investing primarily for long-term goals (e.g., retirement).",
  },
  {
    id: 'Q7',
    dimension: 'liquidity',
    text: 'I might need to withdraw part of this money within the next 12 months.',
    reverse: true,
  },
  {
    id: 'Q8',
    dimension: 'liquidity',
    text: 'Quick access to my invested funds is important to me.',
    reverse: true,
  },
  {
    id: 'Q9',
    dimension: 'knowledge',
    text: 'I understand diversification, ETFs, and risk vs return.',
  },
  {
    id: 'Q10',
    dimension: 'knowledge',
    text: "I've previously invested in equities, mutual funds, or ETFs.",
  },
  {
    id: 'Q11',
    dimension: 'lossAversion',
    text: 'I prefer a guaranteed small return over a risky higher return.',
    reverse: true,
  },
  {
    id: 'Q12',
    dimension: 'lossAversion',
    text: "A temporary 20% drop would make me sell to 'stop the loss'.",
    reverse: true,
  },
];

const SCALE_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export const RiskProfileQuiz = ({ onComplete }: RiskProfileQuizProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: false }));
  };

  const handleSubmit = () => {
    // Validate all questions answered
    const missingAnswers: Record<string, boolean> = {};
    let hasErrors = false;

    RISK_QUESTIONS.forEach(q => {
      if (!(q.id in answers)) {
        missingAnswers[q.id] = true;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(missingAnswers);
      return;
    }

    // Import and calculate scores using the service logic
    import('../services/riskProfile.service').then(({ scoreRiskProfile }) => {
      const result = scoreRiskProfile(answers);
      
      onComplete({
        answers: result.answers,
        dimensions: result.dimensions,
        overall: result.overall,
        investorType: result.investorType
      });
    });
  };

  const handleReset = () => {
    setAnswers({});
    setErrors({});
  };

  const progress = (Object.keys(answers).length / RISK_QUESTIONS.length) * 100;

  return (
    <Card className="financial-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Risk Assessment Quiz</CardTitle>
          <Badge variant="outline" className="text-primary border-primary/20">
            {Object.keys(answers).length}/{RISK_QUESTIONS.length} Complete
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted-foreground">
          Answer all questions to discover your investor profile and get personalized recommendations.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {RISK_QUESTIONS.map((question, index) => (
          <div 
            key={question.id}
            className={`p-4 rounded-lg border transition-colors ${
              errors[question.id] 
                ? 'border-danger bg-danger/5' 
                : answers[question.id] 
                ? 'border-primary/20 bg-primary/5' 
                : 'border-border bg-card'
            }`}
          >
            <div className="mb-3">
              <Label className="text-base font-medium">
                <span className="text-muted-foreground mr-2">Q{index + 1}.</span>
                {question.text}
              </Label>
              {errors[question.id] && (
                <p className="text-sm text-danger mt-1">Please answer this question</p>
              )}
            </div>
            
            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
            >
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {SCALE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option.value.toString()} 
                      id={`${question.id}-${option.value}`}
                      className="w-4 h-4"
                    />
                    <Label 
                      htmlFor={`${question.id}-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSubmit}
            className="flex-1"
            disabled={Object.keys(answers).length !== RISK_QUESTIONS.length}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Profile
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={Object.keys(answers).length === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};