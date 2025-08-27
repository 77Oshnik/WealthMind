import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, CheckCircle } from 'lucide-react';
import { RiskProfileResult } from '../types';

interface SaveProfileModalProps {
  profile: RiskProfileResult;
  onSave: (name: string) => Promise<void>;
  children: React.ReactNode;
}

export const SaveProfileModal = ({ profile, onSave, children }: SaveProfileModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('My Risk Profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(name);
      setSaved(true);
      setTimeout(() => {
        setOpen(false);
        setSaved(false);
        setSaving(false);
      }, 1500);
    } catch (error) {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Risk Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this profile"
              disabled={saving || saved}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Profile Summary:</strong><br/>
              Type: {profile.investorType}<br/>
              Score: {profile.overall}/100<br/>
              Date: {new Date(profile.timestamp).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={!name.trim() || saving || saved}
              className="flex-1"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};