import { useEffect, useState } from "react";
import { AlertTriangle, Calculator, ChevronDown, ChevronRight, Info, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TradePlan } from "@workspace/api-client-react";
import type { Translations } from "@/locales/en";
import {
  buildAdaptivePlanRecommendation,
  type AdaptivePlanRecommendation,
  type AdaptiveRiskPreference,
  type AdaptiveSidePositionPlan,
} from "@/lib/adaptive-position-plan";

type AdaptiveCopy = Translations["analysis_detail"];

interface Props {
  analysisId: number;
  instrument: string;
  tradePlan: TradePlan;
  lang: "en" | "id";
  copy: AdaptiveCopy;
}

interface FormState {
  availableMargin: string;
  preference: AdaptiveRiskPreference;
}

const DEFAULT_FORM: FormState = {
  availableMargin: "",
  preference: "safe",
};

function storageKey(analysisId: number): string {
  return `trade-pilot:adaptive-plan:${analysisId}`;
}

function numberValue(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number | null | undefined, lang: "en" | "id", maximumFractionDigits = 2): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", {
    maximumFractionDigits,
  }).format(value);
}

function PlanSide({ plan, lang, copy }: { plan: AdaptiveSidePositionPlan; lang: "en" | "id"; copy: AdaptiveCopy }) {
  const isBuy = plan.side === "buy";
  return (
    <div className={`rounded-md border-l-4 p-3 space-y-3 bg-muted/20 ${isBuy ? "border-l-emerald-500" : "border-l-red-500"}`} data-testid={`adaptive-plan-${plan.side}`}>
      <div className="flex items-center justify-between gap-2">
        <h4 className={`text-sm font-bold flex items-center gap-1.5 ${isBuy ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isBuy ? copy.adaptive_buy : copy.adaptive_sell}
        </h4>
        <Badge variant="outline" className="text-[10px]">{formatNumber(plan.totalLots, lang)} {copy.adaptive_lot}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-foreground">{copy.adaptive_entry}</span><span className="text-right font-semibold tabular-nums">{formatNumber(plan.entry, lang, 4)}</span>
        <span className="text-muted-foreground">{copy.adaptive_stop}</span><span className="text-right font-semibold text-red-600 dark:text-red-400 tabular-nums">{formatNumber(plan.stopLoss, lang, 4)}</span>
        <span className="text-muted-foreground">{copy.adaptive_cycle_loss}</span><span className="text-right font-semibold tabular-nums">{formatNumber(plan.estimatedCycleLoss, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_margin_required}</span><span className="text-right font-semibold tabular-nums">{formatNumber(plan.marginRequired, lang)}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="text-muted-foreground border-b border-border/70"><tr><th className="text-left py-1 font-medium">{copy.adaptive_level}</th><th className="text-right py-1 font-medium">{copy.adaptive_price}</th><th className="text-right py-1 font-medium">{copy.adaptive_lot}</th><th className="text-right py-1 font-medium">{copy.adaptive_cumulative}</th></tr></thead>
          <tbody>{plan.ladder.map((level) => (
            <tr key={`${plan.side}-${level.level}`} className="border-b border-border/40 last:border-0 align-top">
              <td className="py-1.5 pr-2 font-semibold">{level.level === 0 ? copy.adaptive_initial : `L${level.level}`}</td>
              <td className="py-1.5 text-right tabular-nums">{formatNumber(level.price, lang, 4)}</td>
              <td className="py-1.5 text-right tabular-nums">{formatNumber(level.lot, lang)}</td>
              <td className="py-1.5 text-right tabular-nums">{formatNumber(level.cumulativeLots, lang)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

export function AdaptivePositionPlan({ analysisId, instrument, tradePlan, lang, copy }: Props) {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [recommendation, setRecommendation] = useState<AdaptivePlanRecommendation | null>(null);
  const marginPerLot = 100;

  useEffect(() => {
    setForm(DEFAULT_FORM);
    setRecommendation(null);
    try {
      const stored = localStorage.getItem(storageKey(analysisId));
      if (!stored) return;
      const parsed = JSON.parse(stored) as { form?: Partial<FormState>; recommendation?: AdaptivePlanRecommendation };
      if (parsed.form) setForm({ ...DEFAULT_FORM, ...parsed.form });
      if (parsed.recommendation) setRecommendation(parsed.recommendation);
    } catch {
      // A malformed local draft should not block Standard Analysis.
    }
  }, [analysisId]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setRecommendation(null);
  };
  const calculate = () => {
    const next = buildAdaptivePlanRecommendation({
      instrument,
      tradePlan,
      availableMargin: numberValue(form.availableMargin),
      marginPerLot,
      preference: form.preference,
    });
    setRecommendation(next);
    localStorage.setItem(storageKey(analysisId), JSON.stringify({ form, recommendation: next }));
  };
  const reset = () => {
    setForm(DEFAULT_FORM);
    setRecommendation(null);
    localStorage.removeItem(storageKey(analysisId));
  };
  const selected = recommendation?.recommendation;

  return (
    <Card className="overflow-hidden" data-testid="card-adaptive-position-plan">
      <button type="button" onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/50 transition-colors" data-testid="button-toggle-adaptive-plan" aria-expanded={open}>
        <span className="flex items-center gap-2 min-w-0">
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          <span className="min-w-0"><span className="block text-sm font-bold text-foreground flex items-center gap-1.5"><Calculator className="w-4 h-4 text-primary" />{copy.adaptive_title}</span><span className="block text-[11px] text-muted-foreground mt-0.5">{copy.adaptive_subtitle}</span></span>
        </span>
      </button>
      {open && <div className="border-t border-border p-4 space-y-4" data-testid="adaptive-plan-content">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md p-3 space-y-1.5">
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{copy.adaptive_description}</p>
          <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">{copy.adaptive_standard_unchanged}</p>
        </div>
        <div className="space-y-2">
          <label className="block max-w-sm space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground">{copy.adaptive_available_margin}</span>
            <Input type="number" min="0" step="any" value={form.availableMargin} placeholder="0" onChange={(event) => updateField("availableMargin", event.target.value)} className="h-9 text-sm" data-testid="input-adaptive-available-margin" />
            <span className="block text-[10px] leading-relaxed text-muted-foreground">{copy.adaptive_available_margin_help}</span>
          </label>
          {marginPerLot != null && <p className="text-[11px] text-muted-foreground">{copy.adaptive_margin_rule.replace("{amount}", formatNumber(marginPerLot, lang))}</p>}
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.adaptive_preference_title}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={copy.adaptive_preference_title}>
            {(["safe", "balanced", "active"] as const).map((preference) => {
              const labels = {
                safe: [copy.adaptive_preference_safe, copy.adaptive_preference_safe_desc],
                balanced: [copy.adaptive_preference_balanced, copy.adaptive_preference_balanced_desc],
                active: [copy.adaptive_preference_active, copy.adaptive_preference_active_desc],
              } as const;
              const selectedPreference = form.preference === preference;
              return <button key={preference} type="button" role="radio" aria-checked={selectedPreference} onClick={() => updateField("preference", preference)} className={`rounded-md border p-3 text-left transition-colors ${selectedPreference ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-muted/50"}`} data-testid={`button-adaptive-preference-${preference}`}>
                <span className="block text-xs font-bold text-foreground">{labels[preference][0]}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{labels[preference][1]}</span>
              </button>;
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={calculate} data-testid="button-calculate-adaptive-plan"><ShieldCheck className="w-4 h-4 mr-1.5" />{copy.adaptive_calculate}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset} data-testid="button-reset-adaptive-plan">{copy.adaptive_reset}</Button>
        </div>
        {!recommendation && <p className="text-[11px] text-muted-foreground flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />{copy.adaptive_ready}</p>}
        {recommendation && !recommendation.result.valid && <div className="border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-md p-3 space-y-2" data-testid="adaptive-plan-invalid">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" />{copy.adaptive_invalid_title}</p>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">{copy.adaptive_invalid_description}</p>
        </div>}
        {recommendation?.result.valid && recommendation.result.buy && recommendation.result.sell && selected && <div className="space-y-3" data-testid="adaptive-plan-valid">
          <Badge className="bg-emerald-600 hover:bg-emerald-600">{copy.adaptive_valid}</Badge>
          <div className="rounded-md border border-primary/20 bg-primary/[0.03] p-3 space-y-1"><p className="text-xs font-bold text-foreground">{copy.adaptive_recommendation_title}</p><p className="text-[11px] leading-relaxed text-muted-foreground">{copy.adaptive_recommendation_summary.replace("{lot}", formatNumber(selected.initialLot, lang, 2)).replace("{levels}", String(selected.levels)).replace("{loss}", formatNumber(selected.maximumLoss, lang))}</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><PlanSide plan={recommendation.result.buy} lang={lang} copy={copy} /><PlanSide plan={recommendation.result.sell} lang={lang} copy={copy} /></div>
          <div className="space-y-1.5 rounded-md border border-border p-3"><p className="text-xs font-bold text-foreground">{copy.adaptive_how_to_use}</p><ol className="list-decimal pl-5 space-y-1 text-[11px] leading-relaxed text-muted-foreground"><li>{copy.adaptive_step_choose}</li><li>{copy.adaptive_step_entry}</li><li>{copy.adaptive_step_add}</li><li>{copy.adaptive_step_stop}</li></ol></div>
          <div className="flex items-start gap-2 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3"><AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" /><p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">{copy.adaptive_external_liquidation} {copy.adaptive_manual_only}</p></div>
        </div>}
      </div>}
    </Card>
  );
}