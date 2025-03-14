
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Recordings from "./pages/Recordings";
import RecordingDetail from "./pages/RecordingDetail";
import Attendance from "./pages/Attendance";
import LessonPlans from "./pages/LessonPlans";
import Contacts from "./pages/Contacts";
import Events from "./pages/Events";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { role, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !role) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/recordings" element={<Recordings />} />
      <Route path="/recordings/:id" element={<RecordingDetail />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/lesson-plans" element={<LessonPlans />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/events" element={<Events />} />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
