import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { GlidePath } from '../types';

interface GlidePathEditorProps {
  glidePath: GlidePath;
  onGlidePathChange: (glidePath: GlidePath) => void;
}

export default function GlidePathEditor({ glidePath, onGlidePathChange }: GlidePathEditorProps) {
  const updateGlidePath = (field: keyof GlidePath, value: any) => {
    onGlidePathChange({ ...glidePath, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Glide Path</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="glidePathEnabled"
            checked={glidePath.enabled}
            onCheckedChange={(checked) => updateGlidePath('enabled', checked)}
          />
          <Label htmlFor="glidePathEnabled">Enable Equity Glide Path</Label>
        </div>

        {glidePath.enabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reduceEquity">Reduce Equity (%)</Label>
                <Input
                  id="reduceEquity"
                  type="number"
                  value={glidePath.reduceEquityPercent}
                  onChange={(e) => updateGlidePath('reduceEquityPercent', Number(e.target.value))}
                  min="0"
                  max="20"
                  step="0.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="everyYears">Every (Years)</Label>
                <Input
                  id="everyYears"
                  type="number"
                  value={glidePath.everyYears}
                  onChange={(e) => updateGlidePath('everyYears', Number(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="floorPercent">Minimum Equity Floor (%)</Label>
              <Input
                id="floorPercent"
                type="number"
                value={glidePath.floorPercent}
                onChange={(e) => updateGlidePath('floorPercent', Number(e.target.value))}
                min="0"
                max="50"
                step="1"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Automatically reduce equity allocation by {glidePath.reduceEquityPercent}% every {glidePath.everyYears} year(s), 
              with a minimum floor of {glidePath.floorPercent}% equity.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}