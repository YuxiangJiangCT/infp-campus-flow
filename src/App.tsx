import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { FloatingTaskWindow } from "./components/FloatingTaskWindow";
import './utils/debug-storage'; // Add debug utility for localStorage inspection

const queryClient = new QueryClient();

// Use HashRouter for Electron compatibility
const Router = (window as any).electronAPI ? HashRouter : BrowserRouter;
const routerProps = (window as any).electronAPI ? {} : { basename: "/infp-campus-flow" };

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router {...routerProps}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/floating" element={<FloatingTaskWindow />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
