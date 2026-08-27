import { useTranslation } from "@/lib/i18n";

const r = 50;
const circumference = 2 * Math.PI * r;
const halfCirc = circumference / 2;

function GaugeArc({ score = 72 }: { score?: number }) {
  const scoreLength = (score / 100) * halfCirc;
  const color = score >= 55 ? "#f59e0b" : score <= 45 ? "#ef4444" : "#94a3b8";

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
        {score}
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
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <section
      className="px-4 pb-10"
      data-testid="section-product-preview"
    >
      <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
          <span className="text-xs font-semibold text-foreground">{l.preview_instrument}</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-500">
            {l.preview_tag}
          </span>
        </div>

        <div className="px-4 pt-4 pb-3 flex flex-col items-center gap-1">
          <GaugeArc score={72} />
          <div className="flex items-center gap-1.5 -mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <span className="text-[11px] text-muted-foreground">
              {l.preview_signal_label}
              {" · "}
              <span className="font-semibold text-amber-400">{l.preview_signal_direction}</span>
            </span>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-xl border border-border bg-background/60 px-3 py-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {l.preview_preferred_side}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                {l.preview_preferred_side}
              </span>
            </div>

            <LevelRow label={l.preview_entry_label} value={l.preview_entry_value} accent />
            <LevelRow label={l.preview_sl_label} value={l.preview_sl_value} dim />
            <LevelRow label={l.preview_tp1_label} value={l.preview_tp1_value} />
            <LevelRow label={l.preview_tp2_label} value={l.preview_tp2_value} />

            <div className="mt-2 flex items-center justify-between rounded-lg bg-amber-400/8 border border-amber-400/20 px-2.5 py-1.5">
              <span className="text-[10px] text-amber-500/80">{l.preview_rr_label}</span>
              <span className="text-[11px] font-bold text-amber-400">{l.preview_rr_value}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-2.5 text-center text-[11px] text-muted-foreground/70 leading-snug px-2">
        {l.preview_caption}
      </p>
    </section>
  );
}
