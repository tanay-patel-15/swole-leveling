import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

// ===========================================
// AUTH0 CONFIGURATION
// ===========================================
// Replace these with your actual Auth0 credentials from your Auth0 dashboard
const AUTH0_DOMAIN = "dev-e8lefeemyfvlm4vs.us.auth0.com";
const AUTH0_CLIENT_ID = "Yzpe1PzVAHGbeoOHWgxEqJ9Z0xVuRAm7";

// Make sure to add these URLs in your Auth0 dashboard under "Allowed URLs":
// - Allowed Callback URLs: http://localhost:5173/callback, http://localhost:5173
// - Allowed Logout URLs: http://localhost:5173
// - Allowed Web Origins: http://localhost:5173
// ===========================================

const App = () => (
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Auth0Provider>
);

export default App;
