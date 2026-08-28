import { useState } from "react";
import { ChevronDown, ChevronUp, CircleAlert, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import { getAdaptiveStandardRuleCode } from "@/lib/adaptive-position-plan";
import { useGetStandardTradingRules } from "@workspace/api-client-react";

export function StandardTradingRulesCard({ instrument }: { instrument: string }) {
  const { t, lang } = useTranslation();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useGetStandardTradingRules({
    query: { queryKey: ["/api/trading-rules/standard"], staleTime: 5 * 60_000 },
  });
  const code = getAdaptiveStandardRuleCode(instrument);
  const rule = data?.instruments.find((item) => item.code === code);
  const locale = lang === "id" ? "id-ID" : "en-US";
  const money = (value: number) => `USD ${value.toLocaleString("en-US", { minimumFractionDigits: value % 1 ? 1 : 0 })}`;

  if (!code) return null;
  if (isLoading) return <Card className="p-3 border-primary/20" data-testid="card-standard-trading-rules-loading"><p className="text-xs text-muted-foreground">{t.analyze.standard_rules_loading}</p></Card>;
  if (isError || !data || !rule) return <Card className="p-3 border-amber-500/30 bg-amber-500/[0.03]" data-testid="card-standard-trading-rules-error"><p className="text-xs text-amber-700 dark:text-amber-300">{t.analyze.standard_rules_error}</p></Card>;

  const detailRows: Array<[string, string]> = [
    [t.analyze.standard_rules_fixed_rate, data.fixedRate.label],
    [t.analyze.standard_rules_contract_size, `${rule.contractSize.toLocaleString(locale)} ${rule.contractUnit}`],
    [t.analyze.standard_rules_session, `${rule.tradingDays} · ${t.analyze.standard_rules_summer}: ${rule.tradingHours.summer} · ${t.analyze.standard_rules_winter}: ${rule.tradingHours.winter}`],
    [t.analyze.standard_rules_margin, `${money(rule.initialMarginUsdPerLot)} / ${data.account.minimumLot.toFixed(2)} lot · Mini (${data.fixedRate.label})`],
    [t.analyze.standard_rules_fee, rule.facilityFeeUsdPerLotPerSide == null ? "—" : `${money(rule.facilityFeeUsdPerLotPerSide)} / lot / side + VAT ${rule.vatPercent}%`],
    [t.analyze.standard_rules_rollover, `${money(rule.rolloverUsdPerLotPerNight)} / lot / night + VAT ${rule.vatPercent}%`],
    [t.analyze.standard_rules_spread, `${t.analyze.standard_rules_min}: ${rule.minimumSpread} · ${t.analyze.standard_rules_max}: ${rule.maximumSpread}`],
    [t.analyze.standard_rules_hectic_spread, rule.hecticSpread],
    [t.analyze.standard_rules_movement, rule.minimumPriceMovement],
    [t.analyze.standard_rules_limit_stop, rule.limitStopRange],
    [t.analyze.standard_rules_price_source, `${rule.priceSource} · ${rule.priceGuidance}`],
    [t.analyze.standard_rules_settlement, rule.deliveryBy],
  ];

  return (
    <Card className="overflow-hidden border-primary/25 bg-primary/[0.02]" data-testid="card-standard-trading-rules">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-start justify-between gap-3 p-3 text-left" aria-expanded={open} data-testid="button-toggle-standard-trading-rules">
        <span className="flex min-w-0 items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span><span className="block text-xs font-bold text-foreground">{t.analyze.standard_rules_title}</span><span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">{rule.code} · {rule.product} · {t.analyze.standard_rules_version} {data.version} · {new Date(`${data.effectiveDate}T00:00:00`).toLocaleDateString(locale, { month: "short", year: "numeric" })}</span></span>
        </span>
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
      </button>
      {open && (
        <div className="space-y-3 border-t border-border/60 px-3 pb-3 pt-3" data-testid="section-standard-trading-rules-details">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-2.5 text-[11px]">
            <div><span className="block text-muted-foreground">{t.analyze.standard_rules_lot_range}</span><strong className="text-foreground">{data.account.minimumLot}–{data.account.maximumLot} lot</strong></div>
            <div><span className="block text-muted-foreground">{t.analyze.standard_rules_minimum_deposit}</span><strong className="text-foreground">{money(data.account.minimumDepositUsd)}</strong></div>
          </div>
          <dl className="space-y-2">{detailRows.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-3 text-[11px] leading-snug"><dt className="text-muted-foreground">{label}</dt><dd className="max-w-[62%] text-right font-medium text-foreground">{value}</dd></div>)}</dl>
          <div className="space-y-1.5 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-2.5 text-[11px] leading-relaxed">
            <p className="flex items-start gap-1.5 font-semibold text-amber-800 dark:text-amber-200"><CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{t.analyze.standard_rules_margin_controls}</p>
            <p className="text-amber-900/80 dark:text-amber-100/80">{t.analyze.standard_rules_margin_controls_desc.replace("{maintenance}", String(data.account.maintenanceMarginPercent)).replace("{call}", String(data.account.marginCallBelowPercent)).replace("{restore}", String(data.account.marginCallRestorePercent)).replace("{liquidation}", String(data.account.autoLiquidationAtOrBelowPercent))}</p>
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">{t.analyze.standard_rules_source}: {data.sourceDocument}</p>
          <p className="text-[10px] leading-relaxed text-muted-foreground">{t.analyze.standard_rules_formula}: {data.transactionFormula}</p>
          <p className="border-t border-border/60 pt-2 text-[10px] leading-relaxed text-muted-foreground">{data.disclaimer[lang]}</p>
          <p className="text-[10px] leading-relaxed text-muted-foreground">{data.relationshipDisclosure[lang]}</p>
        </div>
      )}
    </Card>
  );
}