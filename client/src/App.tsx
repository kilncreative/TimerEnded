import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Timer from "@/pages/Timer";
import type { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/next"



function Router() {
  return (
    <Switch>
      <Route path="/" component={Timer} />
      <Route path="/timer" component={Timer} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
