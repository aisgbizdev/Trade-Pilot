import { ProgressionEmblem } from "@/components/ProgressionEmblem";
import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import {
  useGetProgressionCatalog,
  useGetProgressionHistory,
  useGetProgressionSummary,
} from "@workspace/api-client-react";
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

const BADGE_KEYS = [
  "first_reflection",
  "journal_5",
  "journal_20",
  "journal_50",
  "evaluation_1",
  "evaluation_10",
  "evaluation_50",
  "checklist_1",
  "checklist_10",
  "checklist_50",
  "guide_1",
  "guide_5",
  "guide_10",
  "wait_1",
  "wait_10",
  "streak_3",
  "streak_7",
  "streak_30",
  "level_10",
  "level_25",
  "level_50",
  "level_75",
  "level_100",
  "mastery_1",
  "consistent_1000",
] as const;

const RANK_KEYS = [
  "seedling",
  "observer",
  "planner",
  "guardian",
  "navigator",
  "strategist",
  "sentinel",
  "vanguard",
  "steward",
  "apex",
] as const;

type Tab = "overview" | "catalog" | "history";
type BadgeKey = (typeof BADGE_KEYS)[number];
type RankKey = (typeof RANK_KEYS)[number];

function isRankKey(value: string): value is RankKey {
  return (RANK_KEYS as readonly string[]).includes(value);
}

export default function ProgressionScreen() {
  const colors = useColors();
  const { t, lang } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("overview");
  const summaryQuery = useGetProgressionSummary();
  const catalogQuery = useGetProgressionCatalog();
  const historyQuery = useGetProgressionHistory();
  const loading = summaryQuery.isLoading || catalogQuery.isLoading || historyQuery.isLoading;
  const failed = summaryQuery.isError || catalogQuery.isError || historyQuery.isError;

  const retry = () => {
    void Promise.all([
      summaryQuery.refetch(),
      catalogQuery.refetch(),
      historyQuery.refetch(),
    ]);
  };

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "web" ? 67 : insets.top,
    },
    header: {
      height: 62,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    back: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
    headerCopy: { flex: 1, minWidth: 0 },
    title: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 20 },
    subtitle: { color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 2 },
    private: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginHorizontal: 16,
      marginTop: 14,
    },
    privateText: { flex: 1, color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12 },
    content: {
      width: "100%",
      maxWidth: 720,
      alignSelf: "center",
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 32,
      gap: 16,
    },
    hero: {
      padding: 18,
      borderRadius: colors.radius,
      backgroundColor: colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      alignItems: "center",
    },
    rank: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 24, marginTop: 8 },
    level: { color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 13, marginTop: 2 },
    xpRow: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
    xpText: { color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 12 },
    nextText: { color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 11 },
    track: { height: 8, width: "100%", borderRadius: 4, backgroundColor: colors.muted, overflow: "hidden", marginTop: 7 },
    fill: { height: "100%", borderRadius: 4, backgroundColor: colors.primary },
    streakRow: { flexDirection: "row", width: "100%", gap: 10, marginTop: 16 },
    streak: { flex: 1, backgroundColor: colors.muted, borderRadius: colors.radius, padding: 12 },
    streakLabel: { color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 10 },
    streakValue: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 19, marginTop: 3 },
    tabs: { flexDirection: "row", gap: 7 },
    tab: {
      flex: 1,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    tabText: { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", fontSize: 12 },
    tabTextActive: { color: colors.primaryForeground },
    sectionTitle: { color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 16 },
    card: {
      borderRadius: colors.radius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.card,
      overflow: "hidden",
    },
    row: {
      minHeight: 72,
      padding: 13,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    badgeIcon: {
      width: 42,
      height: 42,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.muted,
    },
    badgeIconUnlocked: { backgroundColor: colors.secondary, borderColor: colors.primary },
    rowCopy: { flex: 1, minWidth: 0 },
    rowTitle: { color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 },
    rowDetail: { color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 11, lineHeight: 16, marginTop: 2 },
    status: { color: colors.primary, fontFamily: "Inter_500Medium", fontSize: 10, marginTop: 4 },
    xpBubble: { color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 13 },
    empty: { padding: 28, alignItems: "center", gap: 9 },
    emptyText: { textAlign: "center", color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, gap: 12 },
    error: { color: colors.foreground, textAlign: "center", fontFamily: "Inter_500Medium", fontSize: 14 },
    retry: { minHeight: 44, paddingHorizontal: 22, justifyContent: "center", borderRadius: colors.radius, backgroundColor: colors.primary },
    retryText: { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold", fontSize: 14 },
    allButton: { minHeight: 44, justifyContent: "center", alignItems: "center" },
    allText: { color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 13 },
  });

  const header = (
    <View style={styles.header}>
      <Pressable
        testID="progression-back"
        accessibilityRole="button"
        accessibilityLabel={t.common.back}
        hitSlop={8}
        style={({ pressed }) => [styles.back, { opacity: pressed ? 0.5 : 1 }]}
        onPress={() => router.back()}
      >
        <Feather name="arrow-left" size={22} color={colors.foreground} />
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={styles.title} numberOfLines={1}>{t.progression.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{t.progression.subtitle}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.root}>
        {header}
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.emptyText}>{t.progression.loading}</Text>
        </View>
      </View>
    );
  }

  if (failed || !summaryQuery.data) {
    return (
      <View style={styles.root}>
        {header}
        <View style={styles.center}>
          <Feather name="alert-circle" size={28} color={colors.destructive} />
          <Text style={styles.error}>{t.progression.error}</Text>
          <Pressable
            testID="progression-retry"
            accessibilityRole="button"
            onPress={retry}
            style={({ pressed }) => [styles.retry, { opacity: pressed ? 0.75 : 1 }]}
          >
            <Text style={styles.retryText}>{t.common.retry}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const summary = summaryQuery.data;
  const catalog = catalogQuery.data?.achievements ?? [];
  const history = historyQuery.data?.entries ?? [];
  const rank = isRankKey(summary.rank) ? t.progression[`rank_${summary.rank}`] : summary.rank;
  const range = summary.nextLevelXp - summary.currentLevelXp;
  const progress = range > 0
    ? Math.min(1, Math.max(0, (summary.totalXp - summary.currentLevelXp) / range))
    : 1;
  const remaining = Math.max(0, summary.nextLevelXp - summary.totalXp);
  const unlocked = catalog.filter((item) => item.unlocked);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));

  const renderBadge = (key: BadgeKey) => {
    const item = catalog.find((badge) => badge.key === key);
    const isUnlocked = item?.unlocked === true;
    const copy = t.progression.badges[key];
    return (
      <View key={key} style={styles.row} testID={`progression-badge-${key}`}>
        <View style={[styles.badgeIcon, isUnlocked && styles.badgeIconUnlocked]}>
          <Feather name={isUnlocked ? "award" : "lock"} size={19} color={isUnlocked ? colors.primary : colors.mutedForeground} />
        </View>
        <View style={styles.rowCopy}>
          <Text style={styles.rowTitle}>{copy.name}</Text>
          <Text style={styles.rowDetail}>{copy.requirement}</Text>
          <Text style={styles.status}>
            {isUnlocked && item?.unlockedAt
              ? t.progression.unlocked.replace("{date}", formatDate(item.unlockedAt))
              : t.progression.locked}
          </Text>
        </View>
      </View>
    );
  };

  const renderHistory = (limit?: number) => {
    const entries = limit ? history.slice(0, limit) : history;
    if (!entries.length) {
      return (
        <View style={styles.empty}>
          <Feather name="clock" size={23} color={colors.mutedForeground} />
          <Text style={styles.emptyText}>{t.progression.empty_history}</Text>
        </View>
      );
    }
    return entries.map((entry) => {
      const reasonKey = `reason_${entry.source}` as keyof typeof t.progression;
      const reasonValue = t.progression[reasonKey];
      const reason = typeof reasonValue === "string" ? reasonValue : entry.source;
      return (
        <View key={entry.id} style={styles.row}>
          <Text style={styles.xpBubble}>{t.progression.xp_awarded.replace("{xp}", String(entry.xp))}</Text>
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>{reason}</Text>
            <Text style={styles.rowDetail}>{formatDate(entry.createdAt)}</Text>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.root}>
      {header}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.private}>
          <Feather name="lock" size={13} color={colors.mutedForeground} />
          <Text style={styles.privateText}>{t.progression.private_note}</Text>
        </View>

        <View style={styles.hero}>
          <ProgressionEmblem level={summary.level} masteryLevel={summary.masteryLevel} />
          <Text style={styles.rank}>{rank}</Text>
          <Text style={styles.level}>
            {(summary.masteryLevel > 0 ? t.progression.mastery : t.progression.level)
              .replace("{n}", String(summary.masteryLevel > 0 ? summary.masteryLevel : summary.level))}
          </Text>
          <View style={styles.xpRow}>
            <Text style={styles.xpText}>{summary.totalXp.toLocaleString()} XP</Text>
            <Text style={styles.nextText}>{t.progression.next_level.replace("{xp}", remaining.toLocaleString())}</Text>
          </View>
          <View
            style={styles.track}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: summary.currentLevelXp, max: summary.nextLevelXp, now: summary.totalXp }}
          >
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.streakRow}>
            <View style={styles.streak}>
              <Text style={styles.streakLabel}>{t.progression.current_streak}</Text>
              <Text style={styles.streakValue}>{summary.currentStreak} {t.progression.days}</Text>
            </View>
            <View style={styles.streak}>
              <Text style={styles.streakLabel}>{t.progression.longest_streak}</Text>
              <Text style={styles.streakValue}>{summary.longestStreak} {t.progression.days}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs} accessibilityRole="tablist">
          {(["overview", "catalog", "history"] as const).map((value) => (
            <Pressable
              key={value}
              testID={`progression-tab-${value}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === value }}
              onPress={() => setTab(value)}
              style={[styles.tab, tab === value && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === value && styles.tabTextActive]}>
                {t.progression[value]}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === "overview" ? (
          <>
            <Text style={styles.sectionTitle}>{t.progression.achievements} · {unlocked.length}/{BADGE_KEYS.length}</Text>
            <View style={styles.card}>
              {unlocked.length
                ? unlocked.slice(0, 3).map((item) => renderBadge(item.key as BadgeKey))
                : <View style={styles.empty}><Text style={styles.emptyText}>{t.progression.empty_badges}</Text></View>}
              <Pressable
                testID="progression-view-all-badges"
                accessibilityRole="button"
                onPress={() => setTab("catalog")}
                style={styles.allButton}
              >
                <Text style={styles.allText}>{t.progression.view_all}</Text>
              </Pressable>
            </View>
            <Text style={styles.sectionTitle}>{t.progression.history}</Text>
            <View style={styles.card}>{renderHistory(5)}</View>
          </>
        ) : null}

        {tab === "catalog" ? (
          <View style={styles.card}>{BADGE_KEYS.map(renderBadge)}</View>
        ) : null}

        {tab === "history" ? (
          <View style={styles.card}>{renderHistory()}</View>
        ) : null}
      </ScrollView>
    </View>
  );
}