import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { WatchlistProvider } from "@/lib/watchlist-store";
import Dashboard from "./pages/Dashboard";
import StockExplorer from "./pages/StockExplorer";
import Watchlist from "./pages/Watchlist";
import Briefcase from "./pages/Briefcase";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WatchlistProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/explorer" element={<StockExplorer />} />
              <Route path="/explorer/:ticker" element={<StockExplorer />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/briefcase" element={<Briefcase />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WatchlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
