import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/authStore";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DonorDashboard from "./pages/dashboard/DonorDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import InstitutionDashboard from "./pages/dashboard/InstitutionDashboard";
import VerifierDashboard from "./pages/dashboard/VerifierDashboard";
import TransactionLedger from "./pages/TransactionLedger";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  if (user?.role !== allowedRole) return <Navigate to={`/dashboard/${user?.role}`} />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to={`/dashboard/${useAuthStore.getState().user?.role}`} />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/auth/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />
          <Route path="/dashboard/donor" element={<ProtectedRoute allowedRole="donor"><DonorDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/institution" element={<ProtectedRoute allowedRole="institution"><InstitutionDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/verifier" element={<ProtectedRoute allowedRole="verifier"><VerifierDashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<TransactionLedger />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
