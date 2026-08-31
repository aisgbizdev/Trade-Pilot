import type { AutoscaleInfoProvider } from "lightweight-charts";

const LEVEL_RANGE_PADDING_RATIO = 0.2;
const LEVEL_RANGE_MIN_SPAN_RATIO = 0.0025;
const LEVEL_RANGE_MARGIN_PX = 28;

/**
 * Keep the rendered recommendation levels as the chart's vertical focus.
 * The candle feed is already anchored to the live quote server-side, so the
 * latest close supplies current-price context without another request.
 */
export function createLevelAwareAutoscaleInfoProvider(
  levelPrices: number[],
  latestClose: number | null,
): AutoscaleInfoProvider {
  const validLevels = levelPrices.filter(
    (price) => Number.isFinite(price) && price > 0,
  );

  return (baseImplementation) => {
    const base = baseImplementation();
    if (validLevels.length === 0) return base;

    const focusPrices = [...validLevels];
    if (
      latestClose != null
      && Number.isFinite(latestClose)
      && latestClose > 0
    ) {
      focusPrices.push(latestClose);
    }

    let minValue = Math.min(...focusPrices);
    let maxValue = Math.max(...focusPrices);
    const center = (minValue + maxValue) / 2;
    const minimumSpan = Math.max(
      Math.abs(center) * LEVEL_RANGE_MIN_SPAN_RATIO,
      Number.EPSILON,
    );
    const focusSpan = Math.max(maxValue - minValue, minimumSpan);
    minValue = center - focusSpan / 2;
    maxValue = center + focusSpan / 2;
    const padding = focusSpan * LEVEL_RANGE_PADDING_RATIO;

    return {
      priceRange: {
        minValue: minValue - padding,
        maxValue: maxValue + padding,
      },
      margins: {
        above: Math.max(base?.margins?.above ?? 0, LEVEL_RANGE_MARGIN_PX),
        below: Math.max(base?.margins?.below ?? 0, LEVEL_RANGE_MARGIN_PX),
      },
    };
  };
}