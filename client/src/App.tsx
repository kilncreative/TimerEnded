import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Timer from "@/pages/Timer";
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';   // ← new

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />                                   {/* ← new */}
      </body>
    </html>
  );
}


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
