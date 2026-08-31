import { useTranslation } from "@/lib/i18n";
import {
  useLandingPreview,
  type LandingPreviewBias,
} from "@/hooks/use-landing-preview";

const r = 50;
const circumference = 2 * Math.PI * r;
const halfCirc = circumference / 2;

function GaugeArc({ score = 0, loading = false }: { score?: number; loading?: boolean }) {
  const safeScore = Math.max(0, Math.min(100, score));
  const scoreLength = (safeScore / 100) * halfCirc;
  const color = loading
    ? "#94a3b8"
    : safeScore >= 55
      ? "#f59e0b"
      : safeScore <= 45
        ? "#ef4444"
        : "#94a3b8";

  return (
    <svg viewBox="0 0 120 70" fill="none" className="w-full max-w-[180px]" aria-hidden="true">
      <circle
        cx="60" cy="62" r={r}
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        strokeDasharray={`${halfCirc} ${circumference}`}
        transform="rotate(-180 60 62)"
        strokeLinecap="round"
        className="text-muted/30"
      />
      <circle
        cx="60" cy="62" r={r}
        stroke={color}
        strokeWidth="10"
        fill="none"
        strokeDasharray={`${scoreLength} ${circumference}`}
        transform="rotate(-180 60 62)"
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x="60" y="56"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="18"
        fontWeight="700"
        fill={color}
      >
        {loading ? "—" : safeScore}
      </text>
    </svg>
  );
}

function LevelRow({
  label,
  value,
  accent = false,
  dim = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  dim?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
      <span className={`text-[11px] ${dim ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
        {label}
      </span>
      <span
        className={`text-[11px] font-semibold tabular-nums ${
          accent ? "text-amber-400" : dim ? "text-foreground/50" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function LandingProductPreview() {
  const { t, lang } = useTranslation();
  const l = t.landing;
  const { data, isPending, isError } = useLandingPreview();
  const loading = isPending && !data;
  const selectedPlan = data?.levels ?? null;
  const confidence = data
    ? Math.round((data.confidenceMin + data.confidenceMax) / 2)
    : 0;

  const biasLabel = (bias: LandingPreviewBias | undefined): string => {
    switch (bias) {
      case "bullish_strong":
        return l.preview_bias_bullish_strong;
      case "bullish":
        return l.preview_bias_bullish;
      case "bearish_strong":
        return l.preview_bias_bearish_strong;
      case "bearish":
        return l.preview_bias_bearish;
      default:
        return l.preview_bias_neutral;
    }
  };

  const sideLabel = (side: "buy" | "sell" | "wait" | undefined): string => {
    switch (side) {
      case "buy":
        return l.preview_side_buy;
      case "sell":
        return l.preview_side_sell;
      default:
        return l.preview_side_wait;
    }
  };

  const levelValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return l.preview_unavailable;
    }
    return String(value);
  };

  const priceValue =
    typeof data?.price === "number" && Number.isFinite(data.price)
      ? data.price.toLocaleString(lang === "id" ? "id-ID" : "en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : l.preview_unavailable;

  const updatedValue = data
    ? new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
        timeZone: "Asia/Jakarta",
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(data.generatedAt))
    : null;
  const updatedLabel = updatedValue
    ? l.preview_updated_at.replace("{time}", updatedValue)
    : l.preview_loading;
  const unavailable = isError && !data;
  const statusLabel = unavailable
    ? l.preview_error
    : data?.isStale
      ? l.preview_stale
      : updatedLabel;

  return (
    <section
      className="px-4 pb-10"
      data-testid="section-product-preview"
    >
      <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-foreground">{l.preview_instrument}</span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
              unavailable
                ? "bg-muted border-border text-muted-foreground"
                : data?.isStale
                ? "bg-orange-400/15 border-orange-400/30 text-orange-500"
                : "bg-amber-400/15 border-amber-400/30 text-amber-500"
            }`}
            data-testid="landing-preview-status"
          >
            {unavailable
              ? l.preview_unavailable_tag
              : data?.isStale
                ? l.preview_stale_tag
                : l.preview_tag}
          </span>
        </div>

        {unavailable ? (
          <div
            className="px-5 py-8 text-center"
            role="status"
            data-testid="landing-preview-error"
          >
            <p className="text-sm font-medium text-foreground">
              {l.preview_error_title}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {l.preview_error}
            </p>
          </div>
        ) : (
          <>
            <div
              className="px-4 pt-4 pb-3 flex flex-col items-center gap-1"
              aria-busy={loading}
            >
              <GaugeArc score={confidence} loading={loading} />
              <div className="flex items-center gap-1.5 -mt-1">
                <span className="w-1.5 h-1.5 rounded-full inline-block bg-amber-400" />
                <span className="text-[11px] text-muted-foreground">
                  {l.preview_signal_label}
                  {" · "}
                  <span className="font-semibold text-amber-400">
                    {loading ? l.preview_loading : biasLabel(data?.tradingBias)}
                  </span>
                </span>
              </div>
              <span
                className="text-[10px] text-muted-foreground/70"
                data-testid="landing-preview-updated"
                aria-live="polite"
              >
                {statusLabel}
              </span>
            </div>

            <div className="px-4 pb-4">
              <div className="rounded-xl border border-border bg-background/60 px-3 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {l.preview_preferred_side}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    data?.preferredSide === "sell"
                      ? "bg-red-500/15 border-red-500/30 text-red-400"
                      : data?.preferredSide === "wait"
                        ? "bg-muted border-border text-muted-foreground"
                        : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  }`}>
                    {loading ? l.preview_loading : sideLabel(data?.preferredSide)}
                  </span>
                </div>

                <LevelRow label={l.preview_price_label} value={loading ? l.preview_loading : priceValue} />
                <LevelRow label={l.preview_entry_label} value={loading ? l.preview_loading : levelValue(selectedPlan?.entryZone)} accent />
                <LevelRow label={l.preview_sl_label} value={loading ? l.preview_loading : levelValue(selectedPlan?.stopLoss)} dim />
                <LevelRow label={l.preview_tp1_label} value={loading ? l.preview_loading : levelValue(selectedPlan?.takeProfit1)} />
                <LevelRow label={l.preview_tp2_label} value={loading ? l.preview_loading : levelValue(selectedPlan?.takeProfit2)} />

                <div className="mt-2 flex items-center justify-between rounded-lg bg-amber-400/8 border border-amber-400/20 px-2.5 py-1.5">
                  <span className="text-[10px] text-amber-500/80">{l.preview_rr_label}</span>
                  <span className="text-[11px] font-bold text-amber-400">
                    {loading ? l.preview_loading : levelValue(selectedPlan?.riskRewardRatio)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="mt-2.5 text-center text-[11px] text-muted-foreground/70 leading-snug px-2">
        {isError && !data ? l.preview_error : l.preview_caption}
      </p>
    </section>
  );
}
