import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { useGetAnalysis } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
};

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
      {[
        { key: t.analysis.entry, val: data.entryZone },
        { key: t.analysis.stop_loss, val: data.stopLoss },
        { key: t.analysis.tp1, val: data.takeProfit1 },
        { key: t.analysis.tp2, val: data.takeProfit2 },
        { key: t.analysis.rr, val: data.riskRewardRatio },
      ]
        .filter((r) => r.val)
        .map(({ key, val }) => (
          <View
            key={key}
            style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}
          >
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>{key}</Text>
            <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.foreground }}>{val}</Text>
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
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: 4,
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
          contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingTop: 8 }}
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
