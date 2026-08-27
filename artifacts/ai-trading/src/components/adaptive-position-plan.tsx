import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Calculator, ChevronDown, ChevronRight, Info, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TradePlan } from "@workspace/api-client-react";
import type { Translations } from "@/locales/en";
import {
  buildAdaptivePositionPlan,
  type AccountTier,
  type AdaptivePositionPlanResult,
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
  equity: string;
  freeMargin: string;
  existingExposure: string;
  marginPerLot: string;
  initialLot: string;
  levels: string;
  maxCycleLossPercent: string;
  accountTier: AccountTier;
}

const DEFAULT_FORM: FormState = {
  equity: "",
  freeMargin: "",
  existingExposure: "0",
  marginPerLot: "",
  initialLot: "0.01",
  levels: "3",
  maxCycleLossPercent: "2",
  accountTier: "micro",
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

function AdaptiveInput({
  label,
  value,
  onChange,
  placeholder,
  testId,
  step = "any",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  testId: string;
  step?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <Input
        type="number"
        min="0"
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 text-xs"
        data-testid={testId}
      />
    </label>
  );
}

function PlanSide({
  plan,
  lang,
  copy,
}: {
  plan: AdaptiveSidePositionPlan;
  lang: "en" | "id";
  copy: AdaptiveCopy;
}) {
  const isBuy = plan.side === "buy";
  return (
    <div
      className={`rounded-md border-l-4 p-3 space-y-3 bg-muted/20 ${
        isBuy ? "border-l-emerald-500" : "border-l-red-500"
      }`}
      data-testid={`adaptive-plan-${plan.side}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className={`text-sm font-bold flex items-center gap-1.5 ${isBuy ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
          {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isBuy ? copy.adaptive_buy : copy.adaptive_sell}
        </h4>
        <Badge variant="outline" className="text-[10px]">
          {formatNumber(plan.totalLots, lang)} {copy.adaptive_lot}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-foreground">{copy.adaptive_entry}</span>
        <span className="text-right font-semibold tabular-nums">{formatNumber(plan.entry, lang, 4)}</span>
        <span className="text-muted-foreground">{copy.adaptive_stop}</span>
        <span className="text-right font-semibold text-red-600 dark:text-red-400 tabular-nums">{formatNumber(plan.stopLoss, lang, 4)}</span>
        <span className="text-muted-foreground">{copy.adaptive_cycle_loss}</span>
        <span className="text-right font-semibold tabular-nums">{formatNumber(plan.estimatedCycleLoss, lang)}</span>
        <span className="text-muted-foreground">{copy.adaptive_margin_required}</span>
        <span className="text-right font-semibold tabular-nums">{formatNumber(plan.marginRequired, lang)}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="text-muted-foreground border-b border-border/70">
            <tr>
              <th className="text-left py-1 font-medium">{copy.adaptive_level}</th>
              <th className="text-right py-1 font-medium">{copy.adaptive_price}</th>
              <th className="text-right py-1 font-medium">{copy.adaptive_lot}</th>
              <th className="text-right py-1 font-medium">{copy.adaptive_cumulative}</th>
            </tr>
          </thead>
          <tbody>
            {plan.ladder.map((level) => (
              <tr key={`${plan.side}-${level.level}`} className="border-b border-border/40 last:border-0 align-top">
                <td className="py-1.5 pr-2 font-semibold">{level.level === 0 ? copy.adaptive_initial : `L${level.level}`}</td>
                <td className="py-1.5 text-right tabular-nums">{formatNumber(level.price, lang, 4)}</td>
                <td className="py-1.5 text-right tabular-nums">{formatNumber(level.lot, lang)}</td>
                <td className="py-1.5 text-right tabular-nums">{formatNumber(level.cumulativeLots, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-1.5">
        {plan.ladder.map((level) => (
          <p key={`reason-${plan.side}-${level.level}`} className="text-[10px] text-muted-foreground leading-snug">
            <span className="font-semibold text-foreground/80">{level.level === 0 ? copy.adaptive_initial : `L${level.level}`}:</span>{" "}
            {level.reason}
          </p>
        ))}
      </div>
    </div>
  );
}

export function AdaptivePositionPlan({ analysisId, instrument, tradePlan, lang, copy }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<AdaptivePositionPlanResult | null>(null);

  useEffect(() => {
    setForm(DEFAULT_FORM);
    setResult(null);
    try {
      const stored = localStorage.getItem(storageKey(analysisId));
      if (!stored) return;
      const parsed = JSON.parse(stored) as { form?: Partial<FormState>; result?: AdaptivePositionPlanResult };
      if (parsed.form) setForm({ ...DEFAULT_FORM, ...parsed.form });
      if (parsed.result) setResult(parsed.result);
    } catch {
      // A malformed local draft should not block Standard Analysis.
    }
  }, [analysisId]);

  const input = useMemo(
    () => ({
      instrument,
      tradePlan,
      equity: numberValue(form.equity),
      freeMargin: numberValue(form.freeMargin),
      existingExposure: numberValue(form.existingExposure),
      marginPerLot: numberValue(form.marginPerLot),
      initialLot: numberValue(form.initialLot),
      accountTier: form.accountTier,
      levels: Number(form.levels),
      maxCycleLossPercent: Number(form.maxCycleLossPercent),
    }),
    [form, instrument, tradePlan],
  );

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setResult(null);
  };

  const calculate = () => {
    const next = buildAdaptivePositionPlan(input);
    setResult(next);
    localStorage.setItem(storageKey(analysisId), JSON.stringify({ form, result: next }));
  };

  const reset = () => {
    setForm(DEFAULT_FORM);
    setResult(null);
    localStorage.removeItem(storageKey(analysisId));
  };

  return (
    <Card className="overflow-hidden" data-testid="card-adaptive-position-plan">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
        data-testid="button-toggle-adaptive-plan"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 min-w-0">
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-primary" />
              {copy.adaptive_title}
            </span>
            <span className="block text-[11px] text-muted-foreground mt-0.5">{copy.adaptive_subtitle}</span>
          </span>
        </span>
        <Badge variant="outline" className="text-[10px] shrink-0">{copy.adaptive_opt_in}</Badge>
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-4" data-testid="adaptive-plan-content">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md p-3 space-y-1.5">
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{copy.adaptive_description}</p>
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">{copy.adaptive_standard_unchanged}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.adaptive_account_inputs}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <AdaptiveInput label={copy.adaptive_equity} value={form.equity} onChange={(value) => updateField("equity", value)} placeholder="0" testId="input-adaptive-equity" />
              <AdaptiveInput label={copy.adaptive_free_margin} value={form.freeMargin} onChange={(value) => updateField("freeMargin", value)} placeholder="0" testId="input-adaptive-free-margin" />
              <AdaptiveInput label={copy.adaptive_existing_exposure} value={form.existingExposure} onChange={(value) => updateField("existingExposure", value)} placeholder="0" testId="input-adaptive-existing-exposure" />
              <AdaptiveInput label={copy.adaptive_margin_per_lot} value={form.marginPerLot} onChange={(value) => updateField("marginPerLot", value)} placeholder="0" testId="input-adaptive-margin-per-lot" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <AdaptiveInput label={copy.adaptive_initial_lot} value={form.initialLot} onChange={(value) => updateField("initialLot", value)} step="0.01" testId="input-adaptive-initial-lot" />
              <AdaptiveInput label={copy.adaptive_levels} value={form.levels} onChange={(value) => updateField("levels", value)} step="1" testId="input-adaptive-levels" />
              <AdaptiveInput label={copy.adaptive_max_cycle_loss} value={form.maxCycleLossPercent} onChange={(value) => updateField("maxCycleLossPercent", value)} step="0.1" testId="input-adaptive-max-loss" />
              <label className="space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">{copy.adaptive_account_tier}</span>
                <select
                  value={form.accountTier}
                  onChange={(event) => updateField("accountTier", event.target.value as AccountTier)}
                  className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs"
                  data-testid="select-adaptive-account-tier"
                >
                  <option value="micro">{copy.adaptive_tier_micro}</option>
                  <option value="mini">{copy.adaptive_tier_mini}</option>
                  <option value="regular">{copy.adaptive_tier_regular}</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" size="sm" onClick={calculate} data-testid="button-calculate-adaptive-plan">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {copy.adaptive_calculate}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={reset} data-testid="button-reset-adaptive-plan">
              {copy.adaptive_reset}
            </Button>
          </div>

          {!result && (
            <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              {copy.adaptive_ready}
            </p>
          )}

          {result && !result.valid && (
            <div className="border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-md p-3 space-y-2" data-testid="adaptive-plan-invalid">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {copy.adaptive_invalid_title}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-800 dark:text-amber-300">
                {result.errors.map((error) => <li key={error}>{error}</li>)}
              </ul>
            </div>
          )}

          {result?.valid && result.buy && result.sell && (
            <div className="space-y-3" data-testid="adaptive-plan-valid">
              <Badge className="bg-emerald-600 hover:bg-emerald-600">{copy.adaptive_valid}</Badge>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PlanSide plan={result.buy} lang={lang} copy={copy} />
                <PlanSide plan={result.sell} lang={lang} copy={copy} />
              </div>
              <div className="space-y-1.5 rounded-md border border-border p-3">
                <p className="text-xs font-bold text-foreground">{copy.adaptive_assumptions}</p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-muted-foreground">
                  {result.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
                </ul>
              </div>
              <div className="flex items-start gap-2 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                  {copy.adaptive_external_liquidation} {copy.adaptive_manual_only}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}