import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ReportIncident from "./pages/ReportIncident";
import MissingPersons from "./pages/MissingPersons";
import Auth from "./pages/Auth";
import SafeCheckin from "./pages/SafeCheckin";
import CrisisMapPage from "./pages/CrisisMapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/missing" element={<MissingPersons />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/safe-checkin" element={<SafeCheckin />} />
            <Route path="/map" element={<CrisisMapPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
