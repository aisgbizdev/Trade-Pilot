import { useTranslation } from "@/lib/i18n";
import {
  useLandingPreview,
  type LandingPreviewBias,
} from "@/hooks/use-landing-preview";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const r = 50;
const circumference = 2 * Math.PI * r;
const halfCirc = circumference / 2;

function GaugeArc({ score = 0, loading = false }: { score?: number; loading?: boolean }) {
  const safeScore = Math.max(0, Math.min(100, score));
  const scoreLength = (safeScore / 100) * halfCirc;

  // Use tailwind variables or hex. For our new theme:
  // primary is #FF7A00 (roughly). For positive/negative we keep red/green.
  const color = loading
    ? "hsl(var(--muted-foreground) / 0.3)"
    : safeScore >= 55
      ? "hsl(var(--primary))"
      : safeScore <= 45
        ? "hsl(var(--destructive))"
        : "hsl(var(--muted-foreground))";

  return (
    <div className="relative w-full max-w-[180px]">
      <svg viewBox="0 0 120 70" fill="none" className="w-full" aria-hidden="true">
        <circle
          cx="60" cy="62" r={r}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${halfCirc} ${circumference}`}
          transform="rotate(-180 60 62)"
          strokeLinecap="round"
          className="text-muted/30"
        />
        <circle
          cx="60" cy="62" r={r}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${scoreLength} ${circumference}`}
          transform="rotate(-180 60 62)"
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-1">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ color: loading ? 'hsl(var(--muted-foreground))' : color }}
        >
          {loading ? "—" : safeScore}
        </span>
      </div>
    </div>
  );
}

export function LandingProductPreview() {
  const { t, lang } = useTranslation();
  const l = t.landing;
  const { data, isPending, isError } = useLandingPreview();
  const loading = isPending && !data;
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
      className="px-4 pb-8 md:pb-10"
      data-testid="section-product-preview"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="border border-border/60 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-background/50 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{l.preview_instrument}</span>
          </div>
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${
              unavailable
                ? "bg-muted/50 border-border text-muted-foreground"
                : data?.isStale
                ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                : "bg-primary/10 border-primary/20 text-primary"
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
            className="px-6 py-12 text-center relative z-10"
            role="status"
            data-testid="landing-preview-error"
          >
            <p className="text-sm font-medium text-foreground">
              {l.preview_error_title}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {l.preview_error}
            </p>
          </div>
        ) : (
          <div className="relative z-10">
            <div
              className="px-5 pt-6 pb-4 flex flex-col items-center gap-2.5"
              aria-busy={loading}
            >
              <GaugeArc score={confidence} loading={loading} />

              <div className="flex flex-col items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {l.preview_signal_label}
                </span>
                <span className="text-lg font-bold text-foreground">
                  {loading ? l.preview_loading : biasLabel(data?.tradingBias)}
                </span>
              </div>
              <span
                className="text-[10px] text-muted-foreground/50 mt-1"
                data-testid="landing-preview-updated"
                aria-live="polite"
              >
                {statusLabel}
              </span>
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-xl border border-border/50 bg-background/80 p-4 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-border/30">
                  <span className="text-xs text-muted-foreground font-medium">
                    {l.preview_price_label}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {loading ? l.preview_loading : priceValue}
                  </span>
                </div>

                <div className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <LockKeyhole className="w-4 h-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {l.preview_setup_label}
                      </span>
                      <p className="mt-1 text-sm font-bold text-foreground">
                        {loading ? l.preview_loading : l.preview_locked_title}
                      </p>
                      {!loading && (
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {l.preview_locked_body}
                        </p>
                      )}
                    </div>
                  </div>
                  {!loading && (
                    <Link href="/login" className="block mt-5">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full h-10 rounded-lg btn-premium flex items-center justify-center gap-2 text-xs font-bold tracking-wide transition-all"
                        data-testid="landing-preview-login"
                      >
                        {l.preview_locked_cta}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-3 text-center text-xs text-muted-foreground/60 leading-relaxed max-w-sm mx-auto px-4"
      >
        {isError && !data ? l.preview_error : l.preview_caption_locked}
      </motion.p>
    </section>
  );
}
