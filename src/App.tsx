import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Vocabulary from "./pages/Vocabulary";
import VocabularyList from "./pages/VocabularyList";
import UsefulWords from "./pages/UsefulWords";
import Dictation from "./pages/Dictation";
import Roulette from "./pages/Roulette";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/vocabulary/:listId" element={<VocabularyList />} />
          <Route path="/useful-words" element={<UsefulWords />} />
          <Route path="/dictation" element={<Dictation />} />
          <Route path="/roulette" element={<Roulette />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
