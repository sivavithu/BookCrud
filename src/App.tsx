import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import NotFound from "./pages/NotFound";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgotPassword from './pages/ForgotPassword';

// Validate required environment variables
const validateEnv = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!googleClientId || !apiUrl) {
    const errors = [];
    if (!googleClientId) errors.push('VITE_GOOGLE_CLIENT_ID');
    if (!apiUrl) errors.push('VITE_API_URL');
    
    console.error(
      '❌ Missing required environment variables:\n' +
      errors.map(e => `  • ${e}`).join('\n') +
      '\n\n📝 Setup instructions:\n' +
      '  1. Copy .env.example to .env: cp .env.example .env\n' +
      '  2. Edit .env and fill in your configuration values\n' +
      '  3. Restart the development server\n\n' +
      'For more information, see README.md'
    );
  }
  
  return { googleClientId: googleClientId || '', apiUrl: apiUrl || '' };
};

const env = validateEnv();

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId={env.googleClientId}>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected Route */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
