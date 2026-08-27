import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const TOKEN_KEY = "@trade_pilot_token";
const USER_KEY = "@trade_pilot_user";

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  role: string;
  selectedMode: "beginner" | "pro";
  themePreference: string;
  onboardingCompleted: boolean;
  avatarUrl: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

const tokenRef = { current: null as string | null };

setAuthTokenGetter(() => tokenRef.current);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (storedToken && storedUser) {
          tokenRef.current = storedToken;
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as AuthUser);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function signIn(newToken: string, newUser: AuthUser) {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, newToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
    ]);
    tokenRef.current = newToken;
    setToken(newToken);
    setUser(newUser);
  }

  async function signOut() {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    tokenRef.current = null;
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
