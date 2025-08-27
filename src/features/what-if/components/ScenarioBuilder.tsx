import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Edit } from 'lucide-react';
import type { Scenario } from '../types';
import ScenarioCard from './ScenarioCard';

interface ScenarioBuilderProps {
  scenarios: Scenario[];
  activeScenarioId: string;
  onScenarioSelect: (id: string) => void;
  onScenarioDelete: (id: string) => void;
  onScenarioClone: (scenario: Scenario) => void;
  onScenarioEdit: (scenario: Scenario) => void;
}

export default function ScenarioBuilder({
  scenarios,
  activeScenarioId,
  onScenarioSelect,
  onScenarioDelete,
  onScenarioClone,
  onScenarioEdit
}: ScenarioBuilderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenarios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="space-y-2">
            <ScenarioCard
              scenario={scenario}
              isActive={scenario.id === activeScenarioId}
              onSelect={() => onScenarioSelect(scenario.id)}
            />
            
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onScenarioClone(scenario)}
                className="h-6 px-2"
              >
                <Copy className="w-3 h-3 mr-1" />
                Clone
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onScenarioEdit(scenario)}
                className="h-6 px-2"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              {!scenario.isBaseline && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onScenarioDelete(scenario.id)}
                  className="h-6 px-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {scenarios.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No scenarios created yet. Add scenarios to compare different what-if situations.
          </p>
        )}
      </CardContent>
    </Card>
  );
}