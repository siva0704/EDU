
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Recordings from "./pages/Recordings";
import RecordingDetail from "./pages/RecordingDetail";
import Attendance from "./pages/Attendance";
import AttendanceReports from "./pages/attendance/AttendanceReports";
import AttendanceHistory from "./pages/attendance/AttendanceHistory";
import AttendanceSchedule from "./pages/attendance/AttendanceSchedule";
import LessonPlans from "./pages/LessonPlans";
import CreateLessonPlan from "./pages/lesson-plans/CreateLessonPlan";
import DownloadLessonPlans from "./pages/lesson-plans/DownloadLessonPlans";
import FilterLessonPlans from "./pages/lesson-plans/FilterLessonPlans";
import Contacts from "./pages/Contacts";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import TeacherSettings from "./pages/TeacherSettings";
import StudentSettings from "./pages/StudentSettings";

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

const App = () => {
  const { role } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/recordings/:id" element={<RecordingDetail />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/reports" element={<AttendanceReports />} />
          <Route path="/attendance/history" element={<AttendanceHistory />} />
          <Route path="/attendance/schedule" element={<AttendanceSchedule />} />
          <Route path="/lesson-plans" element={<LessonPlans />} />
          <Route path="/lesson-plans/create" element={<CreateLessonPlan />} />
          <Route path="/lesson-plans/download" element={<DownloadLessonPlans />} />
          <Route path="/lesson-plans/filter" element={<FilterLessonPlans />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/events" element={<Events />} />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                {role === 'admin' && <Settings />}
                {role === 'teacher' && <TeacherSettings />}
                {role === 'student' && <StudentSettings />}
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
