import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MicroSimulationInputs, SimulationResult, MonteCarloResult } from './types';
import { simulateDeterministic, simulateMonteCarlo } from './services/microSim.service';
import { MicroForm } from './components/MicroForm';
import { StrategyCard } from './components/StrategyCard';
import { AnimatedBarGraph } from './components/AnimatedBarGraph';
import { MonteCarloChart } from './components/MonteCarloChart';
import { ContributionTimeline } from './components/ContributionTimeline';
import { SavePlanModal } from './components/SavePlanModal';

const defaultInputs: MicroSimulationInputs = {
  currency: 'USD',
  lumpSum: 0,
  periodicAmount: 5,
  frequency: 'daily',
  roundUpAvgTxPerMonth: 20,
  avgTxAmount: 15.50,
  roundUpTo: 1,
  roundUpMultiplier: 1,
  durationYears: 10,
  scenarioType: 'deterministic',
  numSimulations: 500,
  assetAllocation: { equity: 0.6, bonds: 0.3, cash: 0.1, gold: 0.0 },
  feeEstimate: 0.0025,
  selectedStrategy: 'daily'
};

const MicroSimulationPage = () => {
  const [inputs, setInputs] = useState<MicroSimulationInputs>(defaultInputs);
  const [result, setResult] = useState<SimulationResult | MonteCarloResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setIsAnimating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Brief delay for UX
      
      const simulationResult = inputs.scenarioType === 'monteCarlo' 
        ? simulateMonteCarlo(inputs)
        : simulateDeterministic(inputs);
      
      setResult(simulationResult);
      
      // Animation timing
      setTimeout(() => setIsAnimating(false), 2000);
      
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/investment-features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Investment Features
            </Link>
          </Button>
          
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Micro-Investment Simulator</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Visualize how small, regular investments grow over time with powerful simulation tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <MicroForm 
                inputs={inputs}
                onInputsChange={setInputs}
                onRunSimulation={handleRunSimulation}
                isRunning={isRunning}
              />
            </div>
            <div>
              <StrategyCard inputs={inputs} />
            </div>
          </div>

          {result && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <AnimatedBarGraph result={result} isAnimating={isAnimating} />
                <MonteCarloChart result={result} />
              </div>
              
              <ContributionTimeline result={result} />
              
              <div className="mt-6 text-center">
                <Button onClick={() => setShowSaveModal(true)}>
                  Save Simulation
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {result && (
        <SavePlanModal 
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          result={result}
        />
      )}
    </div>
  );
};

export default MicroSimulationPage;