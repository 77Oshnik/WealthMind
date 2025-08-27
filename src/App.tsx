import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import InvestmentFeaturesPage from "./pages/InvestmentFeaturesPage";
import RiskProfileAnalyzerPage from "./features/risk-profile/RiskProfileAnalyzerPage";
import MicroSimulationPage from "./features/micro-simulation/MicroSimulationPage";
import PortfolioRecommendationPage from "./features/portfolio-recommendation/PortfolioRecommendationPage";
import WhatIfSimulationPage from "./pages/investment/WhatIfSimulationPage";
import AutoInvestPlannerPage from "./pages/investment/AutoInvestPlannerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investment-features" element={<InvestmentFeaturesPage />} />
          <Route path="/features/risk-profile" element={<RiskProfileAnalyzerPage />} />
          <Route path="/investment/micro-simulation" element={<MicroSimulationPage />} />
          <Route path="/investment/portfolio-recommendation" element={<PortfolioRecommendationPage />} />
          <Route path="/investment/what-if-simulation" element={<WhatIfSimulationPage />} />
          <Route path="/investment/auto-invest-planner" element={<AutoInvestPlannerPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
