import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { token, isLoading } = useAuth();

  if (isLoading) return null;
  if (token) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    />
  );
}
