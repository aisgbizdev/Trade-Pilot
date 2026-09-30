import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { refreshProgression } from "@/lib/progression-queries";
import { useQueryClient } from "@tanstack/react-query";
import { getGetAnalysisQueryKey, useGetAnalysis, useSubmitFeedback } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TradeSide = {
  entryZone?: string | null;
  stopLoss?: string | null;
  takeProfit1?: string | null;
  takeProfit2?: string | null;
  riskRewardRatio?: string | null;
  rationale?: string | null;
} | null;

type TradePlan = {
  preferredSide?: "buy" | "sell" | null;
  buy?: TradeSide;
  sell?: TradeSide;
} | null;

type Analysis = {
  id: number;
  instrument: string;
  timeframe: string;
  mode: string;
  tradingBias: string | null;
  confidenceMin: number | null;
  confidenceMax: number | null;
  mainScenario: string | null;
  alternativeScenario: string | null;
  failureConditions: string | null;
  tradePlan: TradePlan;
  validUntil: string;
  createdAt: string;
  feedback?: { feedbackType: "useful" | "not_useful"; note: string | null } | null;
};

function AnalysisFeedback({ analysis, colors }: { analysis: Analysis; colors: ReturnType<typeof useColors> }) {
  const { t } = useLang();
  const queryClient = useQueryClient();
  const submit = useSubmitFeedback();
  const [choice, setChoice] = useState<"useful" | "not_useful" | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const selected = choice ?? analysis.feedback?.feedbackType ?? null;
  const save = async () => {
    if (!selected || submit.isPending) return;
    try {
      await submit.mutateAsync({ id: analysis.id, data: { feedbackType: selected, note: note ?? analysis.feedback?.note ?? undefined } });
      setMessage(t.activities.feedback_saved);
      void queryClient.invalidateQueries({ queryKey: getGetAnalysisQueryKey(analysis.id) });
      refreshProgression(queryClient);
    } catch {
      setMessage(t.activities.save_error);
    }
  };
  const s = StyleSheet.create({
    hint: { color: colors.mutedForeground, fontSize: 12, lineHeight: 18, marginBottom: 12 },
    choices: { flexDirection: "row", gap: 8, marginBottom: 12 },
    choice: { flex: 1, minHeight: 44, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, justifyContent: "center", alignItems: "center" },
    choiceText: { color: colors.foreground, fontSize: 13 },
    input: { minHeight: 68, padding: 10, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, color: colors.foreground, textAlignVertical: "top" },
    button: { minHeight: 44, marginTop: 12, borderRadius: colors.radius, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  });
  return (
    <Section title={t.activities.feedback_title} colors={colors}>
      <Text style={s.hint}>{t.activities.feedback_hint}</Text>
      <View style={s.choices}>
        {(["useful", "not_useful"] as const).map((value) => (
          <Pressable key={value} testID={`feedback-${value}`} accessibilityRole="radio"
            accessibilityState={{ checked: selected === value }} onPress={() => { setChoice(value); setMessage(""); }}
            style={[s.choice, selected === value && { borderColor: colors.primary, backgroundColor: colors.primary + "14" }]}>
            <Text style={s.choiceText}>{value === "useful" ? t.activities.feedback_useful : t.activities.feedback_not_useful}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput testID="feedback-note" accessibilityLabel={t.activities.feedback_note}
        placeholder={t.activities.feedback_note} placeholderTextColor={colors.mutedForeground}
        value={note ?? analysis.feedback?.note ?? ""} onChangeText={setNote}
        multiline maxLength={1000} style={s.input} />
      <Pressable testID="feedback-save" accessibilityRole="button" disabled={!selected || submit.isPending}
        onPress={() => void save()} style={[s.button, (!selected || submit.isPending) && { opacity: 0.5 }]}>
        <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_600SemiBold" }}>{t.activities.feedback_save}</Text>
      </Pressable>
      {message ? <Text accessibilityRole="alert" style={[s.hint, { marginTop: 10 }]}>{message}</Text> : null}
    </Section>
  );
}

function Section({ title, children, colors }: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: colors.card,
        borderRadius: colors.radius,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontFamily: "Inter_600SemiBold",
          color: colors.mutedForeground,
          textTransform: "uppercase",
          letterSpacing: 0.7,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function TradePlanCard({ side, data, label, colors, t }: {
  side: "buy" | "sell";
  data: TradeSide;
  label: string;
  colors: ReturnType<typeof useColors>;
  t: ReturnType<typeof useLang>["t"];
}) {
  if (!data) return null;
  const accentColor = side === "buy" ? colors.bullish : colors.bearish;
  const isMissing = (val?: string | null) => !val || /^(?:n\/a|na|—|-)$/i.test(val.trim());
  const pending = [data.entryZone, data.stopLoss, data.takeProfit1, data.takeProfit2]
    .some((val) => isMissing(val) || /\b(menunggu|tunggu|belum|pending|wait for)\b/i.test(val ?? ""));
  const displayLevel = (val?: string | null) => isMissing(val) ? t.analysis.pending_level : val;

  return (
    <View
      style={{
        backgroundColor: accentColor + "0e",
        borderRadius: colors.radius - 2,
        borderLeftWidth: 3,
        borderLeftColor: accentColor,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 13, fontFamily: "Inter_700Bold", color: accentColor, marginBottom: 10 }}>
        {label}
      </Text>
      {pending ? (
        <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: colors.mutedForeground, marginBottom: 8 }}>
          {t.analysis.pending_guidance}
        </Text>
      ) : null}
      {[
        { key: t.analysis.entry, val: data.entryZone },
        { key: t.analysis.stop_loss, val: data.stopLoss },
        { key: t.analysis.tp1, val: data.takeProfit1 },
        { key: t.analysis.tp2, val: data.takeProfit2 },
        { key: t.analysis.rr, val: data.riskRewardRatio },
      ]
        .map(({ key, val }) => (
          <View
            key={key}
            style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 6, gap: 8 }}
          >
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, flexShrink: 1 }}>{key}</Text>
            <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.foreground, flex: 1, textAlign: "right", minWidth: 100 }}>{displayLevel(val)}</Text>
          </View>
        ))}
      {data.rationale ? (
        <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 6, lineHeight: 18 }}>
          {data.rationale}
        </Text>
      ) : null}
    </View>
  );
}

export default function AnalysisDetailScreen() {
  const colors = useColors();
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const analysisId = Number(id);

  const { data, isLoading, isError, refetch } = useGetAnalysis(analysisId);

  const analysis = data as Analysis | undefined;

  const biasColor =
    analysis?.tradingBias === "bullish"
      ? colors.bullish
      : analysis?.tradingBias === "bearish"
      ? colors.bearish
      : colors.neutral;

  const biasLabel =
    analysis?.tradingBias === "bullish"
      ? t.analysis.bullish
      : analysis?.tradingBias === "bearish"
      ? t.analysis.bearish
      : t.analysis.neutral;

  const s = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "web" ? 67 : 0,
      paddingBottom: Platform.OS === "web" ? 34 : 0,
    },
    headerBar: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerInner: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 12,
      width: "100%",
      maxWidth: 720,
      alignSelf: "center",
    },
    backBtn: { padding: 8 },
    headerTitle: {
      flex: 1,
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    headerSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
    errorText: { fontSize: 15, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    retryBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    retryText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.primaryForeground },
    biasRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 10,
      marginHorizontal: 16,
      marginVertical: 12,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: 16,
    },
    biasDot: { width: 12, height: 12, borderRadius: 6 },
    biasLabel: { fontSize: 20, fontFamily: "Inter_700Bold" },
    confText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    bodyText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.foreground, lineHeight: 20 },
  });

  return (
    <View style={s.root}>
      <View
        style={[
          s.headerBar,
          { paddingTop: insets.top > 0 ? insets.top : (Platform.OS === "web" ? 0 : 12) },
        ]}
      >
        <View style={s.headerInner}>
          <Pressable style={s.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle} numberOfLines={1}>
              {analysis?.instrument ?? "—"} · {analysis?.timeframe ?? "—"}
            </Text>
            <Text style={s.headerSub}>
              {analysis?.mode ? (analysis.mode === "beginner" ? t.common.beginner : t.common.pro) : ""}
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={s.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : isError || !analysis ? (
        <View style={s.centered}>
          <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
          <Text style={s.errorText}>{t.common.error}</Text>
          <Pressable style={s.retryBtn} onPress={() => void refetch()}>
            <Text style={s.retryText}>{t.common.retry}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + 32,
            paddingTop: 8,
            width: "100%",
            maxWidth: 720,
            alignSelf: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.biasRow}>
            <View style={[s.biasDot, { backgroundColor: biasColor }]} />
            <View style={{ flex: 1 }}>
              <Text style={[s.biasLabel, { color: biasColor }]}>{biasLabel}</Text>
              {analysis.confidenceMin != null && analysis.confidenceMax != null ? (
                <Text style={s.confText}>
                  {t.analysis.confidence}: {analysis.confidenceMin}–{analysis.confidenceMax}%
                </Text>
              ) : null}
            </View>
          </View>

          {analysis.mainScenario ? (
            <Section title={t.analysis.main_scenario} colors={colors}>
              <Text style={s.bodyText}>{analysis.mainScenario}</Text>
            </Section>
          ) : null}

          {analysis.tradePlan ? (
            <Section title={t.analysis.trade_plan} colors={colors}>
              <TradePlanCard
                side="buy"
                data={analysis.tradePlan.buy ?? null}
                label={t.analysis.buy}
                colors={colors}
                t={t}
              />
              <TradePlanCard
                side="sell"
                data={analysis.tradePlan.sell ?? null}
                label={t.analysis.sell}
                colors={colors}
                t={t}
              />
            </Section>
          ) : null}

          {analysis.alternativeScenario ? (
            <Section title={t.analysis.alt_scenario} colors={colors}>
              <Text style={s.bodyText}>{analysis.alternativeScenario}</Text>
            </Section>
          ) : null}

          {analysis.failureConditions ? (
            <Section title={t.analysis.failure} colors={colors}>
              <Text style={s.bodyText}>{analysis.failureConditions}</Text>
            </Section>
          ) : null}
          <AnalysisFeedback analysis={analysis} colors={colors} />

          <Text
            style={{
              textAlign: "center",
              fontSize: 11,
              fontFamily: "Inter_400Regular",
              color: colors.mutedForeground,
              marginTop: 4,
              paddingHorizontal: 16,
            }}
          >
            {t.analysis.valid_until}:{" "}
            {new Date(analysis.validUntil).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
