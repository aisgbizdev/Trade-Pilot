import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { useGetProgressionSummary } from "@workspace/api-client-react";
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
import { getTabContentBottomPadding } from "@/constants/layout";

export default function ProfileScreen() {
  const colors = useColors();
  const { t, lang, setLang } = useLang();
  const insets = useSafeAreaInsets();
  const { user, signOut, token } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const progression = useGetProgressionSummary();

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
      paddingTop: Platform.OS === "web" ? 16 : insets.top + 16,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerInner: {
      width: "100%",
      maxWidth: 720,
      alignSelf: "center",
    },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    content: {
      width: "100%",
      maxWidth: 720,
      alignSelf: "center",
    },
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
      flexWrap: "wrap",
    },
    userName: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    userEmail: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 2 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 16,
    },
    rowBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    rowLabel: { fontSize: 15, fontFamily: "Inter_400Regular", color: colors.foreground, flexShrink: 1 },
    rowValue: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    toggleRow: { flexDirection: "row", gap: 6, flexShrink: 0, flexWrap: "wrap" },
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
    progressionCopy: { flex: 1, minWidth: 0, marginLeft: 12, marginRight: 8 },
    progressionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    progressionDetail: { marginTop: 3, fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
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
        <View style={s.headerInner}>
          <Text style={s.title}>{t.profile.title}</Text>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={{
          paddingBottom: getTabContentBottomPadding(Platform.OS, insets.bottom),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.content}>
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
          <Pressable
            testID="profile-progression-link"
            accessibilityRole="button"
            accessibilityLabel={t.profile.progression}
            onPress={() => router.push("/progression" as never)}
            style={({ pressed }) => [s.card, s.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="award" size={22} color={colors.primary} />
            <View style={s.progressionCopy}>
              <Text style={s.progressionTitle}>{t.profile.progression}</Text>
              <Text style={s.progressionDetail}>
                {progression.data
                  ? t.profile.progression_summary
                      .replace("{level}", String(progression.data.level))
                      .replace("{xp}", progression.data.totalXp.toLocaleString())
                  : progression.isError
                    ? t.profile.progression_unavailable
                    : t.common.loading}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
          </Pressable>
        </View>

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
        </View>
      </ScrollView>
    </View>
  );
}
