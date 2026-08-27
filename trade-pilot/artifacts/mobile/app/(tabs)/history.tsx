import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { useListAnalyses } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AnalysisItem = {
  id: number;
  instrument: string;
  timeframe: string;
  tradingBias: string | null;
  mode: string;
  createdAt: string;
  validUntil: string;
};

function BiasChip({ bias, colors }: { bias: string | null; colors: ReturnType<typeof useColors> }) {
  const color =
    bias === "bullish"
      ? colors.bullish
      : bias === "bearish"
      ? colors.bearish
      : colors.neutral;

  const label = bias ? bias.charAt(0).toUpperCase() + bias.slice(1) : "—";

  return (
    <View
      style={{
        backgroundColor: color + "20",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <Text style={{ fontSize: 11, fontFamily: "Inter_600SemiBold", color }}>
        {label}
      </Text>
    </View>
  );
}

function AnalysisRow({ item, onPress, colors, t }: {
  item: AnalysisItem;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
  t: ReturnType<typeof useLang>["t"];
}) {
  const now = Date.now();
  const expired = new Date(item.validUntil).getTime() < now;
  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
  const timeStr = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: pressed ? colors.muted : colors.card,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      })}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground }}>
            {item.instrument}
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary,
              borderRadius: 5,
              paddingHorizontal: 7,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: colors.mutedForeground }}>
              {item.timeframe}
            </Text>
          </View>
          <BiasChip bias={item.tradingBias} colors={colors} />
        </View>
        <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground }}>
          {dateStr} · {timeStr}
          {expired ? ` · ${t.history.expired}` : ""}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function HistoryScreen() {
  const colors = useColors();
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data, isLoading, refetch, isRefetching } = useListAnalyses({ limit: 50 });
  const items: AnalysisItem[] = Array.isArray(data)
    ? (data as AnalysisItem[])
    : ((data as any)?.items ?? []);

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
    },
    title: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    loading: { flex: 1, alignItems: "center", justifyContent: "center" },
    empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 40 },
    emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: colors.foreground, textAlign: "center" },
    emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center" },
    list: { flex: 1 },
  });

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>{t.history.title}</Text>
      </View>

      {isLoading ? (
        <View style={s.loading}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : items.length === 0 ? (
        <View style={s.empty}>
          <Feather name="clock" size={40} color={colors.mutedForeground} />
          <Text style={s.emptyTitle}>{t.history.empty}</Text>
          <Text style={s.emptyDesc}>{t.history.empty_desc}</Text>
        </View>
      ) : (
        <FlatList
          style={s.list}
          data={items}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={!!items.length}
          renderItem={({ item }) => (
            <AnalysisRow
              item={item}
              colors={colors}
              t={t}
              onPress={() => router.push(`/analysis/${item.id}`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        />
      )}
    </View>
  );
}
