import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldAlert, Clock3, Repeat, MoonStar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import {
  useAntiPatternSignals,
  type GuardrailSignal,
  type GuardrailKind,
} from "@/hooks/use-anti-pattern-signals";
import { useRecordGuardrailTelemetry, useWaitGuardrail } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetProgressionSummaryQueryKey, getGetProgressionCatalogQueryKey, getGetProgressionHistoryQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

// Anti-pattern guardrails (task #163). Soft warnings shown above the
// Analyse button. Three signal cards (revenge / overtrading /
// high-risk window) and an opt-in cooling-off countdown.
//
// Telemetry: each unique (kind, instrument) pair is logged once when
// it first appears. When the parent reports a submit click via the
// imperative `markProceeded()` ref we re-log each active signal with
// `proceeded: true` so analytics can compute an override rate.

const ICONS: Record<GuardrailKind, typeof AlertTriangle> = {
  revenge: Repeat,
  overtrading: ShieldAlert,
  high_risk_window: AlertTriangle,
  unusual_hour: MoonStar,
  cooling_off: Clock3,
};

function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : `{${k}}`,
  );
}

function signalKey(s: GuardrailSignal): string {
  return s.kind === "overtrading" ? `overtrading:${s.scope}` : s.kind;
}

function getSignalMetadata(s: GuardrailSignal) {
  if (s.kind === "overtrading") return { scope: s.scope, count: s.count, limit: s.limit };
  if (s.kind === "high_risk_window") return { event: s.event.name, minutesUntil: s.minutesUntil };
  if (s.kind === "revenge") return { minutesSinceLoss: s.minutesSinceLoss };
  if (s.kind === "unusual_hour") return { hourUtc: s.hourUtc, sampleSize: s.sampleSize };
  if (s.kind === "cooling_off") return { minutesRemaining: s.minutesRemaining };
  return {};
}

import { Button } from "@/components/ui/button";

interface AntiPatternGuardrailsProps {
  instrument: string;
  proceedHandleRef?: { current: (() => void) | null };
  onCoolingOffChange?: (active: boolean) => void;
  onSafeWait?: () => void;
}

export function AntiPatternGuardrails({
  instrument,
  proceedHandleRef,
  onCoolingOffChange,
  onSafeWait
}: AntiPatternGuardrailsProps) {
  const { t, lang } = useTranslation();
  const { data } = useAntiPatternSignals(instrument);
  const logEvent = useRecordGuardrailTelemetry();
  const waitEvent = useWaitGuardrail();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const telemetryIdsRef = useRef<Map<string, number>>(new Map());

  // 1-second tick so cooling-off countdown stays current without
  // refetching the API.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const signals = data?.signals ?? [];
  // Filter cooling-off in render time too; the server already filtered
  // expired but our local tick may have passed `untilEpochMs`.
  const visible = signals.filter((s) =>
    s.kind === "cooling_off" ? s.untilEpochMs > now : true,
  );
  const coolingOffActive = visible.some((s) => s.kind === "cooling_off");
  useEffect(() => {
    onCoolingOffChange?.(coolingOffActive);
  }, [coolingOffActive, onCoolingOffChange]);

  // Track which (kind+instrument) pairs we've already logged so the
  // telemetry endpoint sees one row per appearance per session, not one
  // per re-render.
  const loggedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const activeKeys = new Set(visible.map((s) => `${signalKey(s)}|${instrument}`));
    // Prune entries for signals that are no longer visible so that if the
    // same (kind,instrument) reappears later in the session we log it again.
    for (const k of loggedRef.current) {
      if (!activeKeys.has(k)) loggedRef.current.delete(k);
    }
    for (const s of visible) {
      const k = `${signalKey(s)}|${instrument}`;
      if (loggedRef.current.has(k)) continue;
      loggedRef.current.add(k);
      logEvent.mutate({
        data: {
          kind: s.kind,
          instrument,
          proceeded: false,
          metadata: getSignalMetadata(s)
        }
      }, {
        onSuccess: (res) => {
          if (res?.id) {
            telemetryIdsRef.current.set(k, res.id);
          }
        }
      });
    }
    // We intentionally key the effect on visible.length + the joined
    // keys so we don't refire when only counter values tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.map(signalKey).join("|"), instrument]);

  // Expose imperative "user clicked submit" to the parent.
  useEffect(() => {
    if (!proceedHandleRef) return;
    proceedHandleRef.current = () => {
      for (const s of visible) {
        logEvent.mutate({
          data: {
            kind: s.kind,
            instrument,
            proceeded: true,
            metadata: {
              explicitProceed: true,
              ...getSignalMetadata(s)
            }
          }
        });
      }
    };
    return () => {
      if (proceedHandleRef) proceedHandleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.map(signalKey).join("|"), instrument]);

  if (visible.length === 0) return null;

  return (
    <Card
      className="p-3 border-amber-500/40 bg-amber-500/[0.05] space-y-2"
      data-testid="anti-pattern-guardrails"
    >
      <div className="flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <h3 className="text-xs font-bold text-foreground">
          {t.analyze.guardrails_title}
        </h3>
      </div>
      <ul className="space-y-1.5">
        {visible.map((s) => {
          const Icon = ICONS[s.kind];
          let body = "";
          let testId = `guardrail-${s.kind}`;
          if (s.kind === "revenge") {
            body = format(t.analyze.guardrail_revenge_body, {
              minutes: s.minutesSinceLoss,
              instrument: s.instrument,
            });
          } else if (s.kind === "overtrading") {
            const template =
              s.scope === "hour"
                ? t.analyze.guardrail_overtrading_hour_body
                : t.analyze.guardrail_overtrading_day_body;
            body = format(template, { count: s.count, limit: s.limit });
            testId = `guardrail-overtrading-${s.scope}`;
          } else if (s.kind === "high_risk_window") {
            body = format(t.analyze.guardrail_high_risk_body, {
              event: s.event.name,
              minutes: s.minutesUntil,
            });
          } else if (s.kind === "unusual_hour") {
            body = format(t.analyze.guardrail_unusual_hour_body, {
              hour: s.hourUtc,
              freq: s.pastFrequencyPct,
            });
          } else {
            // cooling_off — recompute remaining minutes against `now`
            // so the countdown ticks down smoothly.
            const remaining = Math.max(
              0,
              Math.ceil((s.untilEpochMs - now) / 60_000),
            );
            body = format(t.analyze.guardrail_cooling_off_body, {
              minutes: remaining,
              loss: s.lossPnlPercent ?? "",
            });
          }
          return (
            <li
              key={signalKey(s)}
              className="flex items-start gap-2 text-[11px] leading-snug"
              data-testid={testId}
            >
              <Icon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="text-foreground">{body}</span>
            </li>
          );
        })}
      </ul>
      <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between">
        <p
          className={cn(
            "text-[10px] italic",
            lang === "id" ? "text-amber-700 dark:text-amber-300" : "text-amber-700 dark:text-amber-300",
          )}
        >
          {t.analyze.guardrails_hint}
        </p>
        {onSafeWait && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const hrSignal = visible.find((s) => s.kind === "high_risk_window");
              if (!hrSignal) return;
              const k = `${signalKey(hrSignal)}|${instrument}`;
              const id = telemetryIdsRef.current.get(k);

              if (!id) {
                toast({ variant: "destructive", title: "Error", description: "Telemetry ID not found. Cannot safe wait." });
                return;
              }

              waitEvent.mutate({ id }, {
                onSuccess: (res) => {
                  queryClient.invalidateQueries({ queryKey: getGetProgressionSummaryQueryKey() });
                  queryClient.invalidateQueries({ queryKey: getGetProgressionCatalogQueryKey() });
                  queryClient.invalidateQueries({ queryKey: getGetProgressionHistoryQueryKey() });

                  if (res.awarded) {
                    toast({
                      title: t.progression.activity_awarded.replace("{xp}", String(res.xp)).replace("{reason}", t.progression.reason_risk_warning_wait || "Safe Wait")
                    });
                  } else {
                    toast({ title: t.progression.safe_wait_action, description: t.progression.safe_wait_tooltip });
                  }
                  onSafeWait();
                },
                onError: () => {
                  toast({ variant: "destructive", title: "Gagal memproses aksi tunggu" });
                }
              });
            }}
            className="h-7 text-[10px] px-3 font-bold border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
            title={t.progression.safe_wait_tooltip}
          >
            {t.progression.safe_wait_action}
          </Button>
        )}
      </div>
    </Card>
  );
}
