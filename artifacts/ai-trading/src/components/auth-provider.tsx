import { createContext, useContext } from "react";
import {
  useGetMe,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export type UserRole = "user" | "admin" | "super_admin";

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  role: UserRole;
  selectedMode: "beginner" | "pro";
  themePreference: string;
  onboardingCompleted: boolean;
}

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refetch: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useGetMe({
    query: {
      retry: false,
      queryKey: getGetMeQueryKey(),
    },
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  return (
    <AuthContext.Provider
      value={{
        user: (user as unknown as AuthUser) ?? null,
        isLoading,
        isAuthenticated: !!user && !isError,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
