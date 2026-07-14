import { useAuth, type AuthUser } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { useLogin } from "@workspace/api-client-react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const colors = useColors();
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin({
    mutation: {
      onSuccess: async (data) => {
        if (data.token && data.user) {
          await signIn(data.token, data.user as AuthUser);
          router.replace("/(tabs)");
        }
      },
      onError: (err) => {
        const msg = (err as any)?.data?.error;
        setError(msg ?? t.auth.invalid_credentials);
      },
    },
  });

  const handleLogin = () => {
    if (!email.trim() || !password) return;
    setError(null);
    login({ data: { email: email.trim().toLowerCase(), password } });
  };

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    gradient: { position: "absolute", top: 0, left: 0, right: 0, height: 320 },
    scroll: {
      flex: 1,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
    },
    inner: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
    logo: {
      fontSize: 36,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      letterSpacing: -0.5,
      marginBottom: 6,
    },
    tagline: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 44,
    },
    label: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 8,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      marginBottom: 16,
    },
    inputFocused: { borderColor: colors.primary },
    error: {
      backgroundColor: colors.destructive + "18",
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 16,
    },
    errorText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.destructive,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 4,
      marginBottom: 24,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.primaryForeground,
    },
    footer: { flexDirection: "row", justifyContent: "center", gap: 4 },
    footerText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    footerLink: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
  });

  const isDisabled = isPending || !email.trim() || !password;

  return (
    <View style={s.root}>
      <LinearGradient
        colors={[colors.primary + "22", "transparent"]}
        style={s.gradient}
        pointerEvents="none"
      />
      <KeyboardAvoidingView
        style={s.scroll}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={s.inner}>
          <Text style={s.logo}>{t.auth.welcome}</Text>
          <Text style={s.tagline}>{t.auth.tagline}</Text>

          <Text style={s.label}>{t.auth.email}</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
          />

          <Text style={s.label}>{t.auth.password}</Text>
          <TextInput
            style={s.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          {error ? (
            <View style={s.error}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={[s.button, isDisabled && s.buttonDisabled]}
            onPress={handleLogin}
            disabled={isDisabled}
          >
            {isPending ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={s.buttonText}>{t.auth.login_button}</Text>
            )}
          </Pressable>

          <View style={s.footer}>
            <Text style={s.footerText}>{t.auth.no_account}</Text>
            <Link href="/(auth)/register" style={s.footerLink}>
              {t.auth.sign_up}
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
