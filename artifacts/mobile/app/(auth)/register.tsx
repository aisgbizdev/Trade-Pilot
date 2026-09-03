import { useAuth, type AuthUser } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { useRegister } from "@workspace/api-client-react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SECURITY_QUESTION = "Nama hewan peliharaan pertama kamu?";

export default function RegisterScreen() {
  const colors = useColors();
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: register, isPending } = useRegister({
    mutation: {
      onSuccess: async (data) => {
        if (data.token && data.user) {
          await signIn(data.token, data.user as AuthUser);
          router.replace("/(tabs)");
        }
      },
      onError: (err) => {
        const msg = (err as any)?.data?.error;
        if (msg?.includes("terdaftar") || msg?.includes("exists")) {
          setError(t.auth.email_taken);
        } else {
          setError(msg ?? t.common.error);
        }
      },
    },
  });

  const handleRegister = () => {
    if (!displayName.trim() || !email.trim() || !password || !securityAnswer.trim()) return;
    setError(null);
    register({
      data: {
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        password,
        selectedMode: "pro",
        securityQuestion: SECURITY_QUESTION,
        securityAnswer: securityAnswer.trim(),
      },
    });
  };

  const isDisabled =
    isPending ||
    !displayName.trim() ||
    !email.trim() ||
    !password ||
    !securityAnswer.trim();

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    gradient: { position: "absolute", top: 0, left: 0, right: 0, height: 280 },
    scroll: {
      flex: 1,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
    },
    inner: { paddingHorizontal: 28, paddingVertical: 32 },
    logo: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      letterSpacing: -0.5,
      marginBottom: 6,
    },
    tagline: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 36,
    },
    label: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 8,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    hint: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 8,
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
    modeRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    modeBtn: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    modeBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + "14" },
    modeBtnText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    modeBtnTextActive: { color: colors.primary, fontFamily: "Inter_600SemiBold" },
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
        <ScrollView
          contentContainerStyle={s.inner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.logo}>{t.auth.welcome}</Text>
          <Text style={s.tagline}>{t.auth.tagline}</Text>

          <Text style={s.label}>{t.auth.display_name}</Text>
          <TextInput
            style={s.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor={colors.mutedForeground}
            autoComplete="name"
            returnKeyType="next"
          />

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
            placeholder="Min 6 characters"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="next"
          />

          <Text style={s.label}>{t.auth.security_question}</Text>
          <Text style={s.hint}>{SECURITY_QUESTION}</Text>
          <TextInput
            style={s.input}
            value={securityAnswer}
            onChangeText={setSecurityAnswer}
            placeholder={t.auth.security_answer}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          {error ? (
            <View style={s.error}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={[s.button, isDisabled && s.buttonDisabled]}
            onPress={handleRegister}
            disabled={isDisabled}
          >
            {isPending ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={s.buttonText}>{t.auth.register_button}</Text>
            )}
          </Pressable>

          <View style={s.footer}>
            <Text style={s.footerText}>{t.auth.has_account}</Text>
            <Link href="/(auth)/login" style={s.footerLink}>
              {t.auth.sign_in}
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
