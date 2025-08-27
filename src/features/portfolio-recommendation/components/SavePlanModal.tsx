import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, FileText } from 'lucide-react';

import { PortfolioRecommendation, ProjectionResults, Goal } from '../types';
import { savePlan } from '../services/portfolio.service';

interface SavePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: PortfolioRecommendation;
  projections: ProjectionResults;
  goal: Goal;
}

const SavePlanModal: React.FC<SavePlanModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  projections,
  goal
}) => {
  const { toast } = useToast();
  const [planName, setPlanName] = useState(goal.goalName || 'My Investment Plan');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!planName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your investment plan.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { id } = savePlan({
        name: planName.trim(),
        notes: notes.trim() || undefined,
        goal,
        allocation: recommendation.allocation,
        rationale: recommendation.rationale,
        projection: projections
      });

      toast({
        title: "Plan Saved Successfully!",
        description: `Your investment plan "${planName}" has been saved locally.`
      });

      onClose();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save your plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Investment Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Plan Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Goal:</span>
                <span>{goal.goalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Horizon:</span>
                <span>{goal.timeHorizonYears} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Profile:</span>
                <span>{recommendation.investorType}</span>
              </div>
              {goal.targetAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Amount:</span>
                  <span>₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name *</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter a name for your plan"
              maxLength={100}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any personal notes or considerations..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Storage Info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Local Storage</p>
                <p>Your plan will be saved in your browser's local storage. 
                   To keep it permanently, consider exporting it as a file.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavePlanModal;