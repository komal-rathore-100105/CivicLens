import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import Report from "./pages/Report";
import ProofOfImpact from "./pages/ProofOfImpact";
import Leaderboard from "./pages/Leaderboard";
import DonorDashboard from "./pages/DonorDashboard";
import ESGReport from "./pages/ESGReport";
import APIExplorer from "./pages/APIExplorer";
import CommunityHive from "./pages/CommunityHive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/report" element={<Report />} />
            <Route path="/proof" element={<ProofOfImpact />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/esg" element={<ESGReport />} />
            <Route path="/api" element={<APIExplorer />} />
            <Route path="/community" element={<CommunityHive />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
