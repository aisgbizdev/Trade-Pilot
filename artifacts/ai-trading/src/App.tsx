import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ForgotPasswordPage from "@/pages/forgot-password";
import DashboardPage from "@/pages/dashboard";
import AnalyzePage from "@/pages/analyze";
import AnalysisDetailPage from "@/pages/analysis-detail";
import HistoryPage from "@/pages/history";
import AnalyticsPage from "@/pages/analytics";
import ProfilePage from "@/pages/profile";
import NotificationsPage from "@/pages/notifications";
import AdminPage from "@/pages/admin";
import AdminUsersPage from "@/pages/admin-users";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: false,
    },
  },
});

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (location === "/login" || location === "/register") {
        setLocation("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  return <>{children}</>;
}

function Router() {
  return (
    <AuthRedirect>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        </Route>
        <Route path="/analyze">
          <ProtectedRoute>
            <AnalyzePage />
          </ProtectedRoute>
        </Route>
        <Route path="/analyses/:id">
          {(params) => (
            <ProtectedRoute>
              <AnalysisDetailPage params={params} />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/history">
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        </Route>
        <Route path="/analytics">
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/profile">
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        </Route>
        <Route path="/notifications">
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin">
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/users">
          <ProtectedRoute requiredRole="super_admin">
            <AdminUsersPage />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AuthRedirect>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ai-trading-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
