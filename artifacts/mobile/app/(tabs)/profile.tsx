import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colors = useColors();
  const { t, lang, setLang } = useLang();
  const insets = useSafeAreaInsets();
  const { user, signOut, token } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await fetch(
        `https://${process.env.EXPO_PUBLIC_DOMAIN}/api/auth/logout`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      ).catch(() => {});
    } finally {
      await signOut();
      setIsSigningOut(false);
      router.replace("/(auth)/login");
    }
  };

  const s = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "web" ? 67 : 0,
      paddingBottom: Platform.OS === "web" ? 34 : 0,
    },
    scroll: { flex: 1 },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    section: { marginTop: 24, paddingHorizontal: 16 },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: "hidden",
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
    },
    userName: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    userEmail: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    rowBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    rowLabel: { fontSize: 15, fontFamily: "Inter_400Regular", color: colors.foreground },
    rowValue: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    toggleRow: { flexDirection: "row", gap: 6 },
    toggleBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    toggleBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + "14" },
    toggleText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    toggleTextActive: { color: colors.primary, fontFamily: "Inter_600SemiBold" },
    signOutBtn: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.destructive + "40",
      paddingVertical: 15,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    signOutText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.destructive },
    modeBadge: {
      backgroundColor: colors.primary + "18",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    modeBadgeText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.primary },
  });

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>{t.profile.title}</Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {user ? (
          <View style={s.section}>
            <View style={s.card}>
              <View style={s.userCard}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.userName} numberOfLines={1}>
                    {user.displayName}
                  </Text>
                  <Text style={s.userEmail} numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>
              </View>

              <View style={[s.row, s.rowBorder]}>
                <Text style={s.rowLabel}>{t.profile.trading_mode}</Text>
                <View style={s.modeBadge}>
                  <Text style={s.modeBadgeText}>
                    {user.selectedMode === "beginner" ? t.common.beginner : t.common.pro}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        <View style={s.section}>
          <View style={s.card}>
            <View style={s.row}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Feather name="globe" size={18} color={colors.mutedForeground} />
                <Text style={s.rowLabel}>{t.profile.language}</Text>
              </View>
              <View style={s.toggleRow}>
                {(["en", "id"] as const).map((l) => (
                  <Pressable
                    key={l}
                    style={[s.toggleBtn, lang === l && s.toggleBtnActive]}
                    onPress={() => setLang(l)}
                  >
                    <Text style={[s.toggleText, lang === l && s.toggleTextActive]}>
                      {l === "en" ? "EN" : "ID"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={[s.section, { marginTop: 32 }]}>
          <Pressable
            style={({ pressed }) => [s.signOutBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color={colors.destructive} size="small" />
            ) : (
              <>
                <Feather name="log-out" size={18} color={colors.destructive} />
                <Text style={s.signOutText}>{t.profile.sign_out}</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
