/**
 * Contract value for ONE minimum-size position at each account tier.
 * Mini and Regular are transcribed from the broker tables. Micro is explicitly
 * an estimate (one tenth of Mini), not a documented broker contract.
 *
 * Only Mini belongs in the Standard Trading Rules API response.
 */
export const BROKER_CONTRACT_TIERS = {
  XUL10: {
    unit: "troy ounce",
    micro: { size: 1, source: "micro_assumption" },
    mini: { size: 10, source: "broker_document" },
    regular: { size: 100, source: "broker_document" },
  },
  BCO10_BBJ: {
    unit: "barrel",
    micro: { size: 10, source: "micro_assumption" },
    mini: { size: 100, source: "broker_document" },
    regular: { size: 1_000, source: "broker_document" },
  },
  HKK50_BBJ: {
    unit: "USD/point",
    micro: { size: 0.5, source: "micro_assumption" },
    mini: { size: 5, source: "broker_document" },
    regular: { size: 5, source: "broker_document" },
  },
  JPK50_BBJ: {
    unit: "USD/point",
    micro: { size: 0.5, source: "micro_assumption" },
    mini: { size: 5, source: "broker_document" },
    regular: { size: 5, source: "broker_document" },
  },
} as const;

export type BrokerContractCode = keyof typeof BROKER_CONTRACT_TIERS;
export type BrokerAccountTier = "micro" | "mini" | "regular";