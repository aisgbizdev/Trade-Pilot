import { ProgressionEmblem } from "@/components/ProgressionEmblem";
import { PreAnalysisChecklist } from "@/components/PreAnalysisChecklist";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import {
  getHomeProgressionContent,
  HOME_PROGRESSION_ROUTE,
  HOME_PROGRESSION_TEST_ID,
} from "@/lib/home-progression";
import { Feather } from "@expo/vector-icons";
import {
  type CreateAnalysisBodyTimeframe,
  useCreateAnalysis,
  useGetAnalysisQuota,
  useGetProgressionSummary,
  useSubmitInstrumentRequest,
} from "@workspace/api-client-react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTabContentBottomPadding } from "@/constants/layout";

const INSTRUMENTS = {
  main: ["XAU/USD", "BRENT", "HSI", "NIKKEI"],
  forex: ["EUR/USD", "GBP/USD", "AUD/USD", "USD/JPY"],
} as const;

type Category = keyof typeof INSTRUMENTS;

const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1D"] as const;

export default function AnalyzeScreen() {
  const colors = useColors();
  const { t, lang } = useLang();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [category, setCategory] = useState<Category>("main");
  const [instrument, setInstrument] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const requestInstrument = useSubmitInstrumentRequest();
  const [timeframe, setTimeframe] = useState<CreateAnalysisBodyTimeframe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: quota } = useGetAnalysisQuota();
  const progression = useGetProgressionSummary();
  const remaining = (quota as any)?.remaining as number | undefined;
  const progressionContent = getHomeProgressionContent(
    t.progression,
    progression.data,
    progression.isError,
    t.progression.loading,
  );

  const { mutate: createAnalysis, isPending } = useCreateAnalysis({
    mutation: {
      onSuccess: (data) => {
        router.push(`/analysis/${(data as unknown as { id: number }).id}`);
      },
      onError: () => {
        setError(t.analyze.error);
      },
    },
  });

  const handleSubmit = () => {
    if (!instrument || !timeframe) return;
    setError(null);
    createAnalysis({
      data: {
        instrument,
        timeframe,
        mode: "pro",
      },
    });
  };

  const canSubmit = !!instrument && !!timeframe && !isPending;
  const aliases: Record<string, string> = {
    "XAU/USD": "gold xauusd", BRENT: "bco uk oil brent crude",
    HSI: "hang seng", NIKKEI: "nikkei 225 japan",
    "EUR/USD": "eurusd euro", "GBP/USD": "gbpusd pound",
    "AUD/USD": "audusd aussie", "USD/JPY": "usdjpy yen",
  };
  const requested = search.trim().toUpperCase();
  const matches = (code: string) => `${code} ${aliases[code]}`.toUpperCase().includes(requested);
  const matching = (requested ? Object.values(INSTRUMENTS).flat() : [...INSTRUMENTS[category]]).filter(matches);
  const noMatch = !!requested && !Object.values(INSTRUMENTS).flat().some(matches);
  const requestable = !!requested &&
    !Object.values(INSTRUMENTS).flat().some((code) => code === requested) &&
    /^[A-Z0-9]{2,12}(?:[/.:-][A-Z0-9]{1,12})?$/.test(requested);

  const s = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "web" ? 67 : 0,
      paddingBottom: Platform.OS === "web" ? 34 : 0,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === "web" ? 16 : insets.top + 16,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: 720,
      alignSelf: "center",
      gap: 16,
      minHeight: 32,
    },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground, flexShrink: 1 },
    modeBadge: {
      backgroundColor: colors.primary + "1a",
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      flexShrink: 0,
    },
    modeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: colors.primary },
    content: {
      width: "100%",
      maxWidth: 720,
      alignSelf: "center",
    },
    section: { paddingHorizontal: 16, marginTop: 20 },
    progressionCard: {
      minHeight: 68,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: colors.radius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    progressionCopy: { flex: 1, minWidth: 0, marginLeft: 10, marginRight: 8 },
    progressionRank: {
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
    },
    progressionLevel: {
      color: colors.primary,
      fontFamily: "Inter_500Medium",
      fontSize: 12,
      marginTop: 2,
    },
    progressionLoading: {
      flex: 1,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      marginLeft: 12,
    },
    label: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 0.7,
      marginBottom: 10,
    },
    catRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
    catBtn: {
      flex: 1,
      minWidth: "30%",
      paddingVertical: 9,
      paddingHorizontal: 4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      backgroundColor: colors.card,
    },
    catBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + "14" },
    catText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.mutedForeground, textAlign: "center" },
    catTextActive: { color: colors.primary, fontFamily: "Inter_600SemiBold" },
    instrumentGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    instrBtn: {
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    instrBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "14",
    },
    instrText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground },
    instrTextActive: { color: colors.primary, fontFamily: "Inter_600SemiBold" },
    tfRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tfBtn: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    tfBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "14",
    },
    tfText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground },
    tfTextActive: { color: colors.primary, fontFamily: "Inter_600SemiBold" },
    error: {
      marginHorizontal: 16,
      marginTop: 12,
      backgroundColor: colors.destructive + "18",
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    errorText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.destructive },
    submitContainer: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: getTabContentBottomPadding(Platform.OS, insets.bottom),
    },
    quotaText: {
      textAlign: "center",
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    submitBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
    },
    submitBtnDisabled: { opacity: 0.5 },
    submitText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.primaryForeground,
    },
    analyzingText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.primaryForeground,
    },
  });

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.headerInner}>
          <Text style={s.title} numberOfLines={1}>{t.analyze.title}</Text>
          {user ? (
            <View style={s.modeBadge}>
              <Text style={s.modeText}>
                {user.selectedMode === "beginner" ? t.common.beginner : t.common.pro}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.content}>
          {progressionContent.kind !== "hidden" ? (
          <View style={s.section}>
            <Pressable
              testID={HOME_PROGRESSION_TEST_ID}
              accessibilityRole="button"
              accessibilityLabel={progressionContent.accessibilityLabel}
              onPress={() => router.push(HOME_PROGRESSION_ROUTE as never)}
              style={({ pressed }) => [
                s.progressionCard,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              {progressionContent.kind === "summary" && progression.data ? (
                <>
                  <ProgressionEmblem
                    level={progression.data.level}
                    masteryLevel={progression.data.masteryLevel}
                    size={50}
                  />
                  <View style={s.progressionCopy}>
                    <Text style={s.progressionRank} numberOfLines={1}>
                      {progressionContent.rank}
                    </Text>
                    <Text style={s.progressionLevel} numberOfLines={1}>
                      {progressionContent.level}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </>
              ) : (
                <>
                  <ActivityIndicator color={colors.primary} size="small" />
                  <Text style={s.progressionLoading}>
                    {progressionContent.kind === "loading"
                      ? progressionContent.label
                      : t.progression.loading}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        ) : null}

        <View style={s.section}>
          <Text style={s.label}>Instrument</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={lang === "id" ? "Cari nama atau kode instrumen" : "Search instrument name or code"}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={lang === "id" ? "Cari instrumen" : "Search instruments"}
            style={[s.instrBtn, { color: colors.foreground, marginBottom: 12 }]}
          />
          <View style={s.catRow}>
            {(Object.keys(INSTRUMENTS) as Category[]).map((cat) => (
              <Pressable
                key={cat}
                style={[s.catBtn, category === cat && s.catBtnActive]}
                onPress={() => {
                  setCategory(cat);
                }}
              >
                <Text style={[s.catText, category === cat && s.catTextActive]}>
                  {cat === "main" ? (lang === "id" ? "Utama" : "Main") : t.analyze.forex}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={s.instrumentGrid}>
            {matching.map((instr) => (
              <Pressable
                key={instr}
                style={[s.instrBtn, instrument === instr && s.instrBtnActive]}
                onPress={() => setInstrument(instr)}
              >
                <Text style={[s.instrText, instrument === instr && s.instrTextActive]}>
                  {instr}{INSTRUMENTS.forex.some((code) => code === instr) ? (lang === "id" ? " · Analisis saja" : " · Analysis only") : ""}
                </Text>
              </Pressable>
            ))}
          </View>
          {noMatch || requestable ? (
            <View style={{ marginTop: 12, gap: 8 }}>
              {noMatch ? <Text style={s.quotaText}>{lang === "id" ? "Kode belum terverifikasi di aplikasi ini." : "Code not yet verified in this app."}</Text> : null}
              {requestable ? (
                <Pressable accessibilityRole="button" style={s.instrBtn} onPress={() => setRequestCode(requested)}>
                  <Text style={s.instrText}>{lang === "id" ? `Ajukan ${requested}` : `Request ${requested}`}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          {requestMessage ? <Text accessibilityRole="alert" style={[s.quotaText, { marginTop: 8 }]}>{requestMessage}</Text> : null}
        </View>

        <View style={s.section}>
          <Text style={s.label}>{t.analyze.timeframe}</Text>
          <View style={s.tfRow}>
            {TIMEFRAMES.map((tf) => (
              <Pressable
                key={tf}
                style={[s.tfBtn, timeframe === tf && s.tfBtnActive]}
                onPress={() => setTimeframe(tf)}
              >
                <Text style={[s.tfText, timeframe === tf && s.tfTextActive]}>{tf}</Text>
              </Pressable>
            ))}
          </View>
          <PreAnalysisChecklist instrument={instrument} timeframe={timeframe} />
        </View>

        {error ? (
          <View style={s.error}>
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={s.submitContainer}>
          {remaining !== undefined ? (
            <Text style={s.quotaText}>
              {remaining} {t.analyze.quota}
            </Text>
          ) : null}
          <Pressable
            style={[s.submitBtn, (!canSubmit || !!requested) && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit || !!requested}
          >
            {isPending ? (
              <>
                <ActivityIndicator color={colors.primaryForeground} size="small" />
                <Text style={s.analyzingText}>{t.analyze.analyzing}</Text>
              </>
            ) : (
              <Text style={s.submitText}>{t.analyze.submit}</Text>
            )}
          </Pressable>
        </View>
        </View>
      </ScrollView>
      <Modal visible={requestCode !== null} transparent animationType="fade" onRequestClose={() => setRequestCode(null)}>
        <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#0009" }}>
          <View style={{ padding: 20, gap: 14, borderRadius: colors.radius, backgroundColor: colors.card }}>
            <Text style={[s.title, { fontSize: 19 }]}>
              {lang === "id" ? `Ajukan ${requestCode}?` : `Request ${requestCode}?`}
            </Text>
            <Text style={[s.instrText, { lineHeight: 21 }]}>
              {lang === "id"
                ? "Kode ini belum didukung atau harganya belum terverifikasi di aplikasi ini. Permintaan ditinjau dahulu; analisis tidak dijalankan dan kredit tidak dipakai."
                : "This code is not supported or its price is not verified in this app. The request is for review only; no analysis runs and no credit is used."}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable accessibilityRole="button" disabled={requestInstrument.isPending}
                style={[s.instrBtn, { flex: 1 }]} onPress={() => setRequestCode(null)}>
                <Text style={s.instrText}>{lang === "id" ? "Batal" : "Cancel"}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={requestInstrument.isPending}
                style={[s.instrBtn, { flex: 1, borderColor: colors.primary }]}
                onPress={async () => {
                  if (!requestCode) return;
                  try {
                    await requestInstrument.mutateAsync({ data: { code: requestCode } });
                    setRequestMessage(lang === "id" ? `Permintaan ${requestCode} terkirim.` : `${requestCode} request submitted.`);
                    setRequestCode(null);
                  } catch {
                    setRequestMessage(lang === "id" ? "Permintaan gagal dikirim." : "Could not submit request.");
                    setRequestCode(null);
                  }
                }}>
                <Text style={[s.instrText, { color: colors.primary }]}>
                  {requestInstrument.isPending ? "…" : lang === "id" ? "Kirim permintaan" : "Send request"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
