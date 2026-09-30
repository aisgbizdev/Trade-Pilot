import { useLang } from "@/context/LangContext";
import { useColors } from "@/hooks/useColors";
import { MOBILE_GUIDES } from "@/lib/mobile-guides";
import { refreshProgression } from "@/lib/progression-queries";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetProgressionCatalog,
  useRecordProgressionActivity,
  useStartProgressionEvidence,
  type ProgressionEvidenceSession,
} from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GuidesScreen() {
  const { t, lang } = useLang();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const catalog = useGetProgressionCatalog();
  const start = useStartProgressionEvidence();
  const record = useRecordProgressionActivity();
  const [selected, setSelected] = useState<(typeof MOBILE_GUIDES)[number] | null>(null);
  const [session, setSession] = useState<ProgressionEvidenceSession | null>(null);
  const [now, setNow] = useState(Date.now());
  const [message, setMessage] = useState("");
  const completed = catalog.data?.completedGuideIds ?? [];
  const wait = session ? Math.max(0, Math.ceil((Date.parse(session.minimumCompleteAt) - now) / 1000)) : 0;

  useEffect(() => {
    if (!session) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [session]);

  const open = async (article: (typeof MOBILE_GUIDES)[number]) => {
    if (start.isPending) return;
    setSelected(article);
    setSession(null);
    setMessage("");
    if (completed.includes(article.id)) return;
    try {
      const evidence = await start.mutateAsync({ data: { source: "guide_completion", guideId: article.id } });
      setSession(evidence);
    } catch {
      setMessage(t.activities.save_error);
    }
  };

  const finish = async () => {
    if (!selected || !session || record.isPending || wait > 0) return;
    try {
      const result = await record.mutateAsync({ data: { token: session.token } });
      setSession(null);
      refreshProgression(queryClient);
      setMessage(result.awarded ? t.activities.awarded.replace("{xp}", String(result.xp)) : t.activities.no_xp);
    } catch {
      setMessage(t.activities.save_error);
    }
  };

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === "web" ? 67 : insets.top },
    header: { minHeight: 60, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
    back: { width: 44, height: 44, justifyContent: "center" },
    title: { fontSize: 20, fontFamily: "Inter_700Bold", color: colors.foreground },
    content: { maxWidth: 720, width: "100%", alignSelf: "center", padding: 16, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 32, gap: 12 },
    card: { borderWidth: 1, borderColor: colors.border, borderRadius: colors.radius, backgroundColor: colors.card, padding: 16 },
    cardTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    text: { fontSize: 14, lineHeight: 22, color: colors.foreground, marginTop: 12 },
    hint: { fontSize: 12, lineHeight: 18, color: colors.mutedForeground, marginTop: 8 },
    button: { minHeight: 44, backgroundColor: colors.primary, borderRadius: colors.radius, alignItems: "center", justifyContent: "center", marginTop: 18, padding: 10 },
    buttonText: { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold", fontSize: 14 },
  });

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable testID="guides-back" accessibilityRole="button" accessibilityLabel={t.common.back}
          onPress={() => selected ? (setSelected(null), setSession(null), setMessage("")) : router.back()} style={s.back}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={s.title}>{t.activities.guides_title}</Text>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {selected ? (
          <>
            <Text style={s.cardTitle}>{selected.title[lang]}</Text>
            {selected.paragraphs[lang].map((paragraph, index) => <Text key={index} style={s.text}>{paragraph}</Text>)}
            {catalog.isLoading ? <ActivityIndicator color={colors.primary} /> : catalog.isError ? (
              <Pressable accessibilityRole="button" onPress={() => void catalog.refetch()}><Text style={s.hint}>{t.common.retry}</Text></Pressable>
            ) : completed.includes(selected.id) ? <Text style={s.hint}>{t.activities.guide_done}</Text> : (
              <Pressable testID="guide-complete" accessibilityRole="button"
                disabled={!session || wait > 0 || record.isPending} onPress={() => void finish()}
                style={[s.button, (!session || wait > 0 || record.isPending) && { opacity: 0.5 }]}>
                <Text style={s.buttonText}>{wait > 0 ? t.activities.wait.replace("{seconds}", String(wait)) : t.activities.guide_complete}</Text>
              </Pressable>
            )}
          </>
        ) : (
          <>
            <Text style={s.hint}>{t.activities.guides_hint}</Text>
            {MOBILE_GUIDES.map((article) => (
              <Pressable key={article.id} testID={`guide-${article.id}`} accessibilityRole="button"
                onPress={() => void open(article)} style={s.card}>
                <Text style={s.cardTitle}>{article.title[lang]}</Text>
                {completed.includes(article.id) ? <Text style={s.hint}>{t.activities.guide_done}</Text> : null}
              </Pressable>
            ))}
          </>
        )}
        {message ? <Text accessibilityRole="alert" style={s.hint}>{message}</Text> : null}
      </ScrollView>
    </View>
  );
}