import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { MarketShock } from '../types';

interface ShockEditorProps {
  shock: MarketShock;
  onShockChange: (shock: MarketShock) => void;
  maxYears: number;
}

export default function ShockEditor({ shock, onShockChange, maxYears }: ShockEditorProps) {
  const updateShock = (field: keyof MarketShock, value: any) => {
    onShockChange({ ...shock, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Shock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="shockEnabled"
            checked={shock.enabled}
            onCheckedChange={(checked) => updateShock('enabled', checked)}
          />
          <Label htmlFor="shockEnabled">Apply Market Shock</Label>
        </div>

        {shock.enabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shockYear">Shock Year</Label>
                <Input
                  id="shockYear"
                  type="number"
                  value={shock.year}
                  onChange={(e) => updateShock('year', Number(e.target.value))}
                  min="1"
                  max={maxYears}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shockMagnitude">Magnitude (%)</Label>
                <Input
                  id="shockMagnitude"
                  type="number"
                  value={shock.magnitude}
                  onChange={(e) => updateShock('magnitude', Number(e.target.value))}
                  min="-50"
                  max="0"
                  step="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery">Recovery (%)</Label>
              <Input
                id="recovery"
                type="number"
                value={shock.recovery || 0}
                onChange={(e) => updateShock('recovery', e.target.value ? Number(e.target.value) : undefined)}
                min="0"
                max="50"
                step="1"
                placeholder="Optional recovery bounce"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Apply a {shock.magnitude}% market drop in year {shock.year}
              {shock.recovery && ` followed by a ${shock.recovery}% recovery`}.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}