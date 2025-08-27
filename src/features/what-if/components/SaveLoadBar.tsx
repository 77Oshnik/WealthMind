import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Save, Upload } from 'lucide-react';

interface SaveLoadBarProps {
  onSave: () => void;
  onExport: () => void;
  onBackToHub: () => void;
}

export default function SaveLoadBar({ onSave, onExport, onBackToHub }: SaveLoadBarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button onClick={onSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Scenario
            </Button>
            <Button variant="outline" onClick={onExport} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
          <Button variant="outline" onClick={onBackToHub}>
            Back to Features Hub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}