// The root API artifact is the canonical rules source. This mirrored artifact
// deliberately re-exports it so TP parameters cannot drift between previews.
export {
  STANDARD_TRADING_RULES,
} from "../../../../../artifacts/api-server/src/lib/standard-trading-rules";
export type {
  LocalizedTradingRuleText,
  StandardTradingRuleInstrument,
  StandardTradingRules,
} from "../../../../../artifacts/api-server/src/lib/standard-trading-rules";