import { Link } from "wouter";
import { Landmark, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLiveQuotes } from "@/hooks/use-live-quotes";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Bank Indonesia 7-Day Reverse Repo Rate (BI 7DRR) — manually pinned
// here as a display-only context anchor. We deliberately don't fetch
// it from BI's site (no public JSON feed, scraping is fragile) and we
// don't claim it's live. Update this number after each RDG-BI press
// release; the curated calendar in `api-server/src/lib/calendar.ts`
// surfaces those meetings so future-you sees the reminder.
//
// Source last updated: BI Board of Governors meeting, May 21 2026.
const BI_7DRR_PERCENT = 5.75;
const BI_RATE_AS_OF_LABEL = "May 21, 2026";

// USD/IDR loose-policy intervention range — Bank Indonesia generally
// signals discomfort outside the 16,000-17,000 band via triple
// intervention (spot, DNDF, SBN). These numbers are illustrative
// context, not a trading signal; the card labels them as such.
const IDR_BAND_LOW = 16000;
const IDR_BAND_HIGH = 17000;

function formatIdrPrice(price: number): string {
  return price.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

export function UsdIdrCard() {
  const { t } = useTranslation();
  const { data } = useLiveQuotes();
  const quote = data?.data.find((q) => q.instrument === "USD/IDR");

  const price = quote?.price ?? null;
  const inBand =
    price != null && price >= IDR_BAND_LOW && price <= IDR_BAND_HIGH;
  const aboveBand = price != null && price > IDR_BAND_HIGH;
  const isUp = quote?.direction === "up";

  return (
    <Link href="/analyze?instrument=USD%2FIDR">
      <Card
        className="p-4 cursor-pointer hover:border-primary/40 transition-colors"
        data-testid="usd-idr-card"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">USD/IDR</div>
              <div className="text-[10px] text-muted-foreground">
                {t.widgets.usd_idr_subtitle}
              </div>
            </div>
          </div>
          {price != null && (
            <div className="text-right">
              <div
                className="text-base font-bold text-foreground font-mono"
                data-testid="text-usd-idr-price"
              >
                Rp {formatIdrPrice(price)}
              </div>
              {quote?.changePercent && (
                <div
                  className={cn(
                    "text-[11px] font-medium flex items-center gap-1 justify-end",
                    isUp ? "text-red-500" : "text-emerald-500",
                  )}
                >
                  {isUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {quote.changePercent}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-muted/40 rounded-lg px-2.5 py-2">
            <div className="text-muted-foreground">
              {t.widgets.bi_7drr_label}
            </div>
            <div
              className="font-bold text-foreground mt-0.5"
              data-testid="text-bi-7drr"
            >
              {BI_7DRR_PERCENT.toFixed(2)}%
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {t.widgets.bi_rate_as_of} {BI_RATE_AS_OF_LABEL}
            </div>
          </div>
          <div className="bg-muted/40 rounded-lg px-2.5 py-2">
            <div className="text-muted-foreground">
              {t.widgets.bi_intervention_band}
            </div>
            <div className="font-bold text-foreground mt-0.5 font-mono">
              {formatIdrPrice(IDR_BAND_LOW)}–{formatIdrPrice(IDR_BAND_HIGH)}
            </div>
            <div
              className={cn(
                "text-[10px] mt-0.5 font-medium",
                inBand
                  ? "text-emerald-600 dark:text-emerald-400"
                  : aboveBand
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground",
              )}
              data-testid="text-band-status"
            >
              {price == null
                ? t.widgets.bi_band_unknown
                : inBand
                  ? t.widgets.bi_band_inside
                  : aboveBand
                    ? t.widgets.bi_band_above
                    : t.widgets.bi_band_below}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground mt-2.5 leading-relaxed">
          {t.widgets.bi_disclaimer}
        </p>
      </Card>
    </Link>
  );
}
