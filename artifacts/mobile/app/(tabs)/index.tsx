import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import {
  type CreateAnalysisBodyTimeframe,
  useCreateAnalysis,
  useGetAnalysisQuota,
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

const INSTRUMENTS = {
  futures: ["XAU/USD", "XAG/USD", "US30", "NAS100", "US500", "OIL/USD", "GC=F"],
  forex: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF", "USD/CAD", "NZD/USD"],
  crypto: ["BTC/USD", "ETH/USD", "BNB/USD", "SOL/USD", "XRP/USD", "DOGE/USD"],
} as const;

type Category = keyof typeof INSTRUMENTS;

const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1D"] as const;

export default function AnalyzeScreen() {
  const colors = useColors();
  const { t } = useLang();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [category, setCategory] = useState<Category>("futures");
  const [instrument, setInstrument] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<CreateAnalysisBodyTimeframe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: quota } = useGetAnalysisQuota();
  const remaining = (quota as any)?.remaining as number | undefined;

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
        mode: user?.selectedMode ?? "beginner",
      },
    });
  };

  const canSubmit = !!instrument && !!timeframe && !isPending;

  const s = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "web" ? 67 : 0,
      paddingBottom: Platform.OS === "web" ? 34 : 0,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    title: { fontSize: 28, fontFamily: "Inter_700Bold", color: colors.foreground },
    modeBadge: {
      backgroundColor: colors.primary + "1a",
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginBottom: 4,
    },
    modeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: colors.primary },
    section: { paddingHorizontal: 16, marginTop: 20 },
    label: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 0.7,
      marginBottom: 10,
    },
    catRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
    catBtn: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      backgroundColor: colors.card,
    },
    catBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + "14" },
    catText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
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
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 100 : 12),
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
        <Text style={s.title}>{t.analyze.title}</Text>
        {user ? (
          <View style={s.modeBadge}>
            <Text style={s.modeText}>
              {user.selectedMode === "beginner" ? t.common.beginner : t.common.pro}
            </Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.section}>
          <Text style={s.label}>Instrument</Text>
          <View style={s.catRow}>
            {(Object.keys(INSTRUMENTS) as Category[]).map((cat) => (
              <Pressable
                key={cat}
                style={[s.catBtn, category === cat && s.catBtnActive]}
                onPress={() => {
                  setCategory(cat);
                  setInstrument(null);
                }}
              >
                <Text style={[s.catText, category === cat && s.catTextActive]}>
                  {t.analyze[cat as keyof typeof t.analyze] ?? cat}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={s.instrumentGrid}>
            {INSTRUMENTS[category].map((instr) => (
              <Pressable
                key={instr}
                style={[s.instrBtn, instrument === instr && s.instrBtnActive]}
                onPress={() => setInstrument(instr)}
              >
                <Text style={[s.instrText, instrument === instr && s.instrTextActive]}>
                  {instr}
                </Text>
              </Pressable>
            ))}
          </View>
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
            style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
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
      </ScrollView>
    </View>
  );
}
