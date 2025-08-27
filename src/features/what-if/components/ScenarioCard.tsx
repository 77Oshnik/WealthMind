import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Scenario } from '../types';

interface ScenarioCardProps {
  scenario: Scenario;
  isActive: boolean;
  onSelect: () => void;
}

export default function ScenarioCard({ scenario, isActive, onSelect }: ScenarioCardProps) {
  const getDeltaChips = () => {
    const chips: string[] = [];
    
    if (scenario.deltas.contributionChange) {
      const sign = scenario.deltas.contributionChange > 0 ? '+' : '';
      chips.push(`${sign}${scenario.deltas.contributionChange}% Contribution`);
    }
    
    if (scenario.deltas.startDelayChange) {
      const sign = scenario.deltas.startDelayChange > 0 ? '+' : '';
      chips.push(`${sign}${scenario.deltas.startDelayChange}mo Start`);
    }
    
    if (scenario.deltas.allocationChange) {
      chips.push('Custom Allocation');
    }
    
    if (scenario.deltas.glidePath?.enabled) {
      chips.push('Glide Path');
    }
    
    if (scenario.deltas.shock?.enabled) {
      chips.push(`${scenario.deltas.shock.magnitude}% Shock Y${scenario.deltas.shock.year}`);
    }
    
    if (scenario.deltas.assumptions) {
      chips.push('Custom Assumptions');
    }
    
    return chips;
  };

  const chips = getDeltaChips();

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className="w-full justify-start h-auto p-3"
      onClick={onSelect}
    >
      <div className="text-left space-y-2 w-full">
        <div className="flex items-center justify-between">
          <span className="font-medium">{scenario.name}</span>
          {scenario.isBaseline && (
            <Badge variant="secondary" className="text-xs">Baseline</Badge>
          )}
        </div>
        
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {chips.map((chip, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {chip}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Button>
  );
}