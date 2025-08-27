import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Link, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SimulationResult, MonteCarloResult, SavedPlan } from '../types';
import { formatCurrency } from '../utils';

interface SavePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SimulationResult | MonteCarloResult;
}

export function SavePlanModal({ isOpen, onClose, result }: SavePlanModalProps) {
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  
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
      // Create saved plan object
      const savedPlan: SavedPlan = {
        id: Date.now().toString(),
        name: planName.trim(),
        createdAt: new Date().toISOString(),
        inputs: result.inputs,
        result
      };
      
      // Get existing saved plans
      const existingPlans = JSON.parse(localStorage.getItem('microSim.savedPlans') || '[]');
      
      // Add new plan
      const updatedPlans = [...existingPlans, savedPlan];
      
      // Save to localStorage
      localStorage.setItem('microSim.savedPlans', JSON.stringify(updatedPlans));
      
      // Update last inputs for quick re-run
      localStorage.setItem('microSim.lastInputs', JSON.stringify(result.inputs));
      
      setSaved(true);
      toast({
        title: "Plan Saved Successfully",
        description: `"${planName}" has been saved to your local storage.`
      });
      
      setTimeout(() => {
        onClose();
        setSaved(false);
        setPlanName('');
        setDescription('');
      }, 1500);
      
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
  
  const handleExportJSON = () => {
    const exportData = {
      name: planName || 'Micro Investment Simulation',
      createdAt: new Date().toISOString(),
      inputs: result.inputs,
      results: {
        finalValue: result.finalValue,
        totalContributions: result.totalContributions,
        totalReturns: result.totalReturns,
        monthlyContribution: result.monthlyContribution,
        yearlySnapshots: result.yearlySnapshots
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `micro-investment-plan-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Your simulation data has been exported as JSON."
    });
  };
  
  const handleShareLink = () => {
    // Create a simple text data URI for sharing
    const shareData = {
      strategy: result.inputs.selectedStrategy,
      monthlyAmount: result.monthlyContribution,
      duration: result.inputs.durationYears,
      finalValue: result.finalValue
    };
    
    const shareText = `My Micro Investment Plan:
Strategy: ${result.inputs.selectedStrategy}
Monthly Investment: ${formatCurrency(result.monthlyContribution)}
Time Horizon: ${result.inputs.durationYears} years
Projected Value: ${formatCurrency(result.finalValue)}

Generated with Micro Investment Simulator`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Investment Plan',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Your plan summary has been copied to clipboard."
      });
    }
  };
  
  const isMonteCarloResult = 'finalStats' in result;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5 text-primary" />
            Save Investment Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Plan Summary */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="font-medium text-sm mb-2">Plan Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Strategy:</span>
                <Badge variant="secondary" className="capitalize">
                  {result.inputs.selectedStrategy}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Investment:</span>
                <span className="font-medium">{formatCurrency(result.monthlyContribution)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Horizon:</span>
                <span className="font-medium">{result.inputs.durationYears} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {isMonteCarloResult ? 'Median Value:' : 'Final Value:'}
                </span>
                <span className="font-semibold text-primary">
                  {formatCurrency(result.finalValue)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Save Form */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="planName">Plan Name *</Label>
              <Input
                id="planName"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="My Investment Plan"
                disabled={saved}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notes about this investment strategy..."
                rows={2}
                disabled={saved}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={handleSave}
              disabled={isSaving || saved}
              className="w-full"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved Successfully
                </>
              ) : isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save to Local Storage
                </>
              )}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportJSON}
                disabled={saved}
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShareLink}
                disabled={saved}
              >
                <Link className="w-4 h-4 mr-2" />
                Share Summary
              </Button>
            </div>
          </div>
          
          {/* Note */}
          <p className="text-xs text-muted-foreground">
            Plans are saved locally in your browser. Export JSON for backup or sharing.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}