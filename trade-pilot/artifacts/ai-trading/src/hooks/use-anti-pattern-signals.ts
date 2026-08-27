import { useQuery, useMutation } from "@tanstack/react-query";

// Anti-pattern guardrail signals (task #163). Plain-fetch hook — the
// endpoint is read by a single component (the Analyse-page warning
// card), so we skip the OpenAPI round-trip and keep the response shape
// inline. Telemetry uses the same plain-fetch path and intentionally
// stays fire-and-forget so a flaky network never blocks the analyse
// submit.

export type GuardrailKind =
  | "revenge"
  | "overtrading"
  | "high_risk_window"
  | "unusual_hour"
  | "cooling_off";

export interface RevengeSignal {
  kind: "revenge";
  instrument: string;
  minutesSinceLoss: number;
  lossPnlPercent: string | null;
}

export interface OvertradingSignal {
  kind: "overtrading";
  scope: "hour" | "day";
  count: number;
  limit: number;
  personalized: boolean;
}

export interface UnusualHourSignal {
  kind: "unusual_hour";
  hourUtc: number;
  pastFrequencyPct: number;
  sampleSize: number;
}

export interface HighRiskSignal {
  kind: "high_risk_window";
  event: {
    name: string;
    currency: string;
    impact: string | null;
    epochMs: number;
  };
  minutesUntil: number;
}

export interface CoolingOffSignal {
  kind: "cooling_off";
  untilEpochMs: number;
  minutesRemaining: number;
  lossPnlPercent: string | null;
  thresholdPct: number;
}

export type GuardrailSignal =
  | RevengeSignal
  | OvertradingSignal
  | HighRiskSignal
  | UnusualHourSignal
  | CoolingOffSignal;

export interface GuardrailPrefs {
  revenge: boolean;
  overtrading: boolean;
  highRisk: boolean;
  coolingOff: boolean;
}

export interface GuardrailResponse {
  signals: GuardrailSignal[];
  prefs: GuardrailPrefs;
}

async function fetchGuardrails(instrument: string): Promise<GuardrailResponse> {
  const params = new URLSearchParams({ instrument });
  const res = await fetch(`/api/analyses/guardrails?${params.toString()}`);
  if (!res.ok) throw new Error("Gagal mengambil sinyal guardrail");
  return res.json();
}

export function useAntiPatternSignals(instrument: string | null | undefined) {
  return useQuery({
    queryKey: ["guardrails", instrument],
    queryFn: () => fetchGuardrails(instrument!),
    enabled: !!instrument,
    // Short stale-time: signals are time-sensitive (revenge window is
    // 5 min, imminent event window is 30 min). Refetch on focus so a
    // user who tabs away and back gets a fresh read.
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

interface TelemetryBody {
  kind: GuardrailKind;
  instrument?: string;
  proceeded?: boolean;
  metadata?: Record<string, unknown>;
}

async function postTelemetry(body: TelemetryBody): Promise<void> {
  const res = await fetch(`/api/analyses/guardrails/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Gagal kirim telemetri guardrail");
}

export function useLogGuardrailEvent() {
  return useMutation({
    mutationFn: (body: TelemetryBody) => postTelemetry(body),
    // Fire-and-forget: a failed telemetry beacon must not block the
    // user's analyse flow.
    retry: 0,
  });
}
