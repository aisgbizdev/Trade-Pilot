import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { refreshProgression } from "@/lib/progression-queries";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useRecordProgressionActivity,
  useStartProgressionEvidence,
  type ProgressionEvidenceSession,
} from "@workspace/api-client-react";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function PreAnalysisChecklist({ instrument, timeframe }: { instrument: string | null; timeframe: string | null }) {
  const { t } = useLang();
  const { user } = useAuth();
  const colors = useColors();
  const queryClient = useQueryClient();
  const start = useStartProgressionEvidence();
  const record = useRecordProgressionActivity();
  const [session, setSession] = useState<ProgressionEvidenceSession | null>(null);
  const [context, setContext] = useState("");
  const [checked, setChecked] = useState<number[]>([]);
  const [now, setNow] = useState(Date.now());
  const [message, setMessage] = useState("");
  const [restoring, setRestoring] = useState(true);
  const key = `${instrument}:${timeframe}`;
  const storageKey = user?.id == null || !instrument || !timeframe
    ? null : `@trade_pilot_checklist:${user.id}:${key}`;
  const active = session && context === key ? session : null;

  useEffect(() => {
    let mounted = true;
    setSession(null);
    setContext("");
    setChecked([]);
    setMessage("");
    setRestoring(true);
    if (storageKey) {
      void AsyncStorage.getItem(storageKey).then((value) => {
        if (!mounted || !value) return;
        try {
          const saved = JSON.parse(value) as ProgressionEvidenceSession;
          if (typeof saved.token === "string" && saved.subject && saved.minimumCompleteAt) {
            setSession(saved);
            setContext(key);
          }
        } catch {
          void AsyncStorage.removeItem(storageKey);
        }
      }).catch(() => { if (mounted) setMessage(t.activities.save_error); })
        .finally(() => { if (mounted) setRestoring(false); });
    } else {
      setRestoring(false);
    }
    return () => { mounted = false; };
  }, [storageKey]);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);

  const begin = async () => {
    if (!instrument || !timeframe || !storageKey || restoring || start.isPending) return;
    setMessage("");
    try {
      const result = await start.mutateAsync({
        data: { source: "pre_analysis_checklist", checklist: { instrument, timeframe } },
      });
      setContext(key);
      setSession(result);
      setChecked([]);
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(result));
      } catch {
        setMessage(t.activities.storage_error);
      }
    } catch {
      setMessage(t.activities.checklist_unavailable);
    }
  };

  const complete = async () => {
    if (!active || checked.length !== 4 || Date.parse(active.minimumCompleteAt) > now || record.isPending) return;
    try {
      const result = await record.mutateAsync({ data: { token: active.token } });
      setSession(null);
      if (storageKey) void AsyncStorage.removeItem(storageKey).catch(() => {});
      setMessage(result.awarded
        ? t.activities.awarded.replace("{xp}", String(result.xp))
        : t.activities.no_xp);
      refreshProgression(queryClient);
    } catch {
      setMessage(t.activities.save_error);
    }
  };

  const s = StyleSheet.create({
    card: { marginTop: 20, padding: 16, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
    title: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground, marginBottom: 8 },
    hint: { fontSize: 12, lineHeight: 18, color: colors.mutedForeground, marginBottom: 12 },
    row: { minHeight: 48, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 10 },
    box: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: colors.primary, alignItems: "center", justifyContent: "center", backgroundColor: colors.card },
    label: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.foreground },
    button: { minHeight: 44, borderRadius: colors.radius, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", padding: 10 },
    buttonText: { color: colors.primaryForeground, fontFamily: "Inter_600SemiBold", fontSize: 13 },
    message: { marginTop: 10, color: colors.foreground, fontSize: 12 },
  });
  const wait = active ? Math.max(0, Math.ceil((Date.parse(active.minimumCompleteAt) - now) / 1000)) : 0;
  return (
    <View style={s.card}>
      <Text style={s.title}>{t.activities.checklist_title}</Text>
      <Text style={s.hint}>{t.activities.checklist_hint}</Text>
      {active ? (
        <>
          {t.activities.checklist_items.map((item, index) => (
            <Pressable key={index} testID={`checklist-item-${index}`} accessibilityRole="checkbox"
              accessibilityState={{ checked: checked.includes(index) }}
              onPress={() => setChecked((current) => current.includes(index) ? current.filter((x) => x !== index) : [...current, index])}
              style={s.row}>
              <View style={s.box}><Text style={{ color: colors.primary }}>{checked.includes(index) ? "✓" : ""}</Text></View>
              <Text style={s.label}>{item}</Text>
            </Pressable>
          ))}
          <Pressable testID="checklist-complete" accessibilityRole="button"
            disabled={checked.length !== 4 || wait > 0 || record.isPending} onPress={() => void complete()}
            style={[s.button, (checked.length !== 4 || wait > 0 || record.isPending) && { opacity: 0.5 }]}>
            <Text style={s.buttonText}>{wait > 0 ? t.activities.wait.replace("{seconds}", String(wait)) : t.activities.checklist_complete}</Text>
          </Pressable>
        </>
      ) : (
        <Pressable testID="checklist-start" accessibilityRole="button" disabled={!instrument || !timeframe || restoring || start.isPending}
          onPress={() => void begin()} style={[s.button, (!instrument || !timeframe || restoring || start.isPending) && { opacity: 0.5 }]}>
          <Text style={s.buttonText}>{t.activities.checklist_start}</Text>
        </Pressable>
      )}
      {message ? <Text accessibilityRole="alert" style={s.message}>{message}</Text> : null}
    </View>
  );
}