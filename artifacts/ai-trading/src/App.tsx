import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { InstallPromptProvider } from "@/hooks/use-install-prompt";
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
import DailySummaryPage from "@/pages/daily-summary";
import MyAlertsPage from "@/pages/my-alerts";
import AdminPage from "@/pages/admin";
import AdminUsersPage from "@/pages/admin-users";
import AdminFeedbackPage from "@/pages/admin-feedback";
import LegalPage from "@/pages/legal";
import MindsetPage from "@/pages/mindset";
import JournalPage from "@/pages/journal";
import MirrorPage from "@/pages/mirror";
import PerformancePage, { PerformanceMethodologyPage } from "@/pages/performance";
import { SplashScreen } from "@/components/splash-screen";
import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

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

function ThemeSync() {
  const { user } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (user?.themePreference === "dark" || user?.themePreference === "light") {
      setTheme(user.themePreference);
    }
  }, [user?.themePreference, setTheme]);

  return null;
}

function Router() {
  return (
    <AuthRedirect>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/privacy">
          <LegalPage kind="privacy" />
        </Route>
        <Route path="/terms">
          <LegalPage kind="terms" />
        </Route>
        <Route path="/performance" component={PerformancePage} />
        <Route path="/performance/methodology" component={PerformanceMethodologyPage} />
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
        <Route path="/daily-summary">
          <ProtectedRoute>
            <DailySummaryPage />
          </ProtectedRoute>
        </Route>
        <Route path="/my-alerts">
          <ProtectedRoute>
            <MyAlertsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/mindset">
          <ProtectedRoute>
            <MindsetPage />
          </ProtectedRoute>
        </Route>
        <Route path="/journal">
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        </Route>
        <Route path="/mirror">
          <ProtectedRoute>
            <MirrorPage />
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
        <Route path="/admin/feedback">
          <ProtectedRoute requiredRole="admin">
            <AdminFeedbackPage />
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
      <ThemeProvider defaultTheme="dark" storageKey="ai-trading-theme">
        <LanguageProvider>
          <TooltipProvider>
            <InstallPromptProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <AuthProvider>
                  <ThemeSync />
                  <Router />
                </AuthProvider>
              </WouterRouter>
            </InstallPromptProvider>
            <SplashScreen />
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
