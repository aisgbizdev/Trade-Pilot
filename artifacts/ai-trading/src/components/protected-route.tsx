import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "./auth-provider";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "super_admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    if (requiredRole === "super_admin" && user?.role !== "super_admin") {
      setLocation("/dashboard");
      return;
    }
    if (requiredRole === "admin" && user?.role !== "admin" && user?.role !== "super_admin") {
      setLocation("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, requiredRole, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (requiredRole === "super_admin" && user?.role !== "super_admin") return null;

  if (requiredRole === "admin" && user?.role !== "admin" && user?.role !== "super_admin") return null;

  return <>{children}</>;
}
