import { LucideIcon } from 'lucide-react';

interface FinancialBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  earned: boolean;
  progress?: number;
}

export const FinancialBadge = ({ 
  icon: Icon, 
  title, 
  description, 
  earned,
  progress = 0
}: FinancialBadgeProps) => {
  return (
    <div className={`
      financial-card p-4 text-center space-y-3 relative overflow-hidden
      ${earned ? 'badge-earned' : 'opacity-60'}
    `}>
      {earned && (
        <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-accent/10" />
      )}
      <div className={`
        relative w-16 h-16 mx-auto rounded-full flex items-center justify-center
        ${earned 
          ? 'bg-gradient-to-br from-success to-accent text-white animate-glow' 
          : 'bg-muted text-muted-foreground'
        }
      `}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="relative">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        {!earned && progress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-muted rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
          </div>
        )}
      </div>
    </div>
  );
};