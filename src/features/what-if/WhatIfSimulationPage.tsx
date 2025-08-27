import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import WhatIfControlPanel from './components/WhatIfControlPanel';
import AllocationEditor from './components/AllocationEditor';
import AssumptionsPanel from './components/AssumptionsPanel';
import GlidePathEditor from './components/GlidePathEditor';
import ShockEditor from './components/ShockEditor';
import ScenarioBuilder from './components/ScenarioBuilder';
import ResultsDashboard from './components/ResultsDashboard';
import ProjectionChart from './components/ProjectionChart';
import StackedBars from './components/StackedBars';
import SaveLoadBar from './components/SaveLoadBar';
import { simulateDeterministic, simulateMonteCarlo, applyScenarioDeltas } from './services/whatif.service';
import type { 
  WhatIfInputs, 
  AssetAllocation, 
  SimulationAssumptions, 
  SimulationResults, 
  SimulationMode,
  Scenario,
  GlidePath,
  MarketShock
} from './types';

const WhatIfSimulationPage = () => {
  const navigate = useNavigate();
  
  // Default inputs
  const [inputs, setInputs] = useState<WhatIfInputs>({
    goalName: 'Retirement',
    goalType: 'retirement',
    timeHorizonYears: 20,
    startDelayMonths: 0,
    lumpSum: 0,
    recurringAmount: 5000,
    frequency: 'monthly',
    annualEscalation: 5,
    skipMonthsPerYear: 0
  });

  const [allocation, setAllocation] = useState<AssetAllocation>({
    domesticEquity: 60,
    internationalEquity: 15,
    bonds: 15,
    reits: 5,
    gold: 3,
    cash: 2
  });

  const [assumptions, setAssumptions] = useState<SimulationAssumptions>({
    scenario: 'medium',
    inflation: 6,
    fees: 1,
    taxDrag: 10
  });

  const [glidePath, setGlidePath] = useState<GlidePath>({
    enabled: false,
    reduceEquityPercent: 5,
    everyYears: 5,
    floorPercent: 20
  });

  const [shock, setShock] = useState<MarketShock>({
    enabled: false,
    year: 5,
    magnitude: -20
  });

  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'baseline', name: 'Baseline', isBaseline: true, deltas: {} }
  ]);
  
  const [activeScenarioId, setActiveScenarioId] = useState('baseline');
  const [mode, setMode] = useState<SimulationMode>('deterministic');
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showReal, setShowReal] = useState(false);
  const [showContributionsOnly, setShowContributionsOnly] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    
    try {
      const activeScenario = scenarios.find(s => s.id === activeScenarioId);
      if (!activeScenario) return;

      const { inputs: effectiveInputs, allocation: effectiveAllocation, assumptions: effectiveAssumptions } = 
        applyScenarioDeltas(inputs, allocation, assumptions, activeScenario.deltas);

      const scenarioGlidePath = activeScenario.deltas.glidePath || glidePath;
      const scenarioShock = activeScenario.deltas.shock || shock;

      let simulationResults: SimulationResults;
      
      if (mode === 'montecarlo') {
        simulationResults = simulateMonteCarlo(
          effectiveInputs, 
          effectiveAllocation, 
          effectiveAssumptions, 
          500, 
          scenarioGlidePath, 
          scenarioShock
        );
      } else {
        simulationResults = simulateDeterministic(
          effectiveInputs, 
          effectiveAllocation, 
          effectiveAssumptions, 
          scenarioGlidePath, 
          scenarioShock
        );
      }

      setResults(simulationResults);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const addScenario = () => {
    const newId = `scenario-${Date.now()}`;
    const newScenario: Scenario = {
      id: newId,
      name: `Scenario ${scenarios.length}`,
      isBaseline: false,
      deltas: {}
    };
    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newId);
  };

  const handleSave = () => {
    const plan = {
      id: Date.now().toString(),
      name: inputs.goalName || 'What-If Plan',
      timestamp: new Date().toISOString(),
      inputs,
      assumptions,
      scenarios,
      results
    };
    
    const saved = JSON.parse(localStorage.getItem('whatIf.plans') || '[]');
    saved.push(plan);
    localStorage.setItem('whatIf.plans', JSON.stringify(saved));
  };

  const handleExport = () => {
    const data = { inputs, assumptions, scenarios, results };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `what-if-simulation-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-ai-secondary/5">
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/investment-features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Investment Features
            </Link>
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-ai-secondary/10 text-ai-secondary rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">What-If Simulation</h1>
                <p className="text-muted-foreground">
                  Experiment with contributions, timing, allocation, and market conditions to see possible outcomes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Controls */}
            <div className="lg:col-span-1 space-y-6">
              <WhatIfControlPanel
                inputs={inputs}
                mode={mode}
                onInputsChange={setInputs}
                onModeChange={setMode}
                onRunSimulation={runSimulation}
                onAddScenario={addScenario}
                onReset={() => setResults(null)}
                isRunning={isRunning}
              />
              
              <ScenarioBuilder
                scenarios={scenarios}
                activeScenarioId={activeScenarioId}
                onScenarioSelect={setActiveScenarioId}
                onScenarioDelete={(id) => setScenarios(scenarios.filter(s => s.id !== id))}
                onScenarioClone={(scenario) => {
                  const newId = `${scenario.id}-copy-${Date.now()}`;
                  setScenarios([...scenarios, { ...scenario, id: newId, name: `${scenario.name} Copy`, isBaseline: false }]);
                }}
                onScenarioEdit={() => {}}
              />
              
              <AllocationEditor
                allocation={allocation}
                onAllocationChange={setAllocation}
                onImportFromPortfolio={() => {}}
                canImportFromPortfolio={false}
              />
              
              <AssumptionsPanel
                assumptions={assumptions}
                onAssumptionsChange={setAssumptions}
              />
              
              <GlidePathEditor
                glidePath={glidePath}
                onGlidePathChange={setGlidePath}
              />
              
              <ShockEditor
                shock={shock}
                onShockChange={setShock}
                maxYears={inputs.timeHorizonYears}
              />
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 space-y-6">
              <ResultsDashboard
                results={results}
                inputs={inputs}
                showReal={showReal}
                onToggleReal={() => setShowReal(!showReal)}
              />
              
              <ProjectionChart
                results={results}
                mode={mode}
                showContributionsOnly={showContributionsOnly}
                onToggleContributionsOnly={() => setShowContributionsOnly(!showContributionsOnly)}
                showReal={showReal}
              />
              
              <StackedBars results={results} showReal={showReal} />
              
              <SaveLoadBar
                onSave={handleSave}
                onExport={handleExport}
                onBackToHub={() => navigate('/investment-features')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulationPage;