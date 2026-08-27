export type StandardTradingRuleInstrument = {
  code: "XUL10" | "BCO10_BBJ";
  product: string;
  contractSize: number;
  contractUnit: "troy ounce" | "barrel";
  tradingDays: string;
  tradingHours: { summer: string; winter: string };
  initialMarginUsdPerLot: number;
  facilityFeeUsdPerLotPerSide: number;
  vatPercent: number;
  rolloverUsdPerLotPerNight: number;
  priceSource: string;
  priceGuidance: string;
  minimumSpread: string;
  maximumSpread: string;
  hecticSpread: string;
  minimumPriceMovement: string;
  limitStopRange: string;
  deliveryBy: string;
};

export type LocalizedTradingRuleText = {
  id: string;
  en: string;
};

export type StandardTradingRules = {
  name: "TP Standard Trading Rules";
  version: string;
  effectiveDate: string;
  sourceDocument: string;
  fixedRate: { usd: number; idr: number; label: string };
  account: {
    minimumDepositUsd: number;
    minimumLot: number;
    maximumLot: number;
    maintenanceMarginPercent: number;
    marginCallBelowPercent: number;
    marginCallRestorePercent: number;
    autoLiquidationAtOrBelowPercent: number;
    equityReviewThresholdUsd: number;
    equityReviewThresholdIdr: number;
  };
  transactionFormula: string;
  instruments: StandardTradingRuleInstrument[];
  disclaimer: LocalizedTradingRuleText;
  relationshipDisclosure: LocalizedTradingRuleText;
};

/** Single broker-neutral ruleset used by Trade Pilot's standard TP estimates. */
export const STANDARD_TRADING_RULES: StandardTradingRules = {
  name: "TP Standard Trading Rules",
  version: "2026.02",
  effectiveDate: "2026-02-01",
  sourceDocument: "Solid Gold / Royal Assetindo Mini Account Trading Rules (Feb 2026)",
  fixedRate: { usd: 1, idr: 10_000, label: "USD 1 = IDR 10.000" },
  account: {
    minimumDepositUsd: 500,
    minimumLot: 0.1,
    maximumLot: 0.9,
    maintenanceMarginPercent: 70,
    marginCallBelowPercent: 70,
    marginCallRestorePercent: 100,
    autoLiquidationAtOrBelowPercent: 30,
    equityReviewThresholdUsd: 2_500,
    equityReviewThresholdIdr: 25_000_000,
  },
  transactionFormula:
    "P/L = [(Selling Price - Buying Price) × Contract Size × n lot] - [(Facility Fee + VAT) × n lot]",
  instruments: [
    {
      code: "XUL10",
      product: "Gold (Loco London)",
      contractSize: 10,
      contractUnit: "troy ounce",
      tradingDays: "Monday–Friday",
      tradingHours: { summer: "06:00–03:30 WIB", winter: "06:00–04:30 WIB" },
      initialMarginUsdPerLot: 100,
      facilityFeeUsdPerLotPerSide: 1.5,
      vatPercent: 11,
      rolloverUsdPerLotPerNight: 0.5,
      priceSource: "Telequote",
      priceGuidance: "Last Trade",
      minimumSpread: "USD 0.40 / troy ounce / side",
      maximumSpread: "USD 1.00 / troy ounce / side",
      hecticSpread: "Based on market conditions",
      minimumPriceMovement: "USD 0.01 / troy ounce",
      limitStopRange: "USD 6–USD 20",
      deliveryBy: "Cash settlement",
    },
    {
      code: "BCO10_BBJ",
      product: "Brent Crude Oil",
      contractSize: 100,
      contractUnit: "barrel",
      tradingDays: "Monday–Friday",
      tradingHours: { summer: "07:00–03:45 WIB", winter: "08:00–03:45 WIB" },
      initialMarginUsdPerLot: 100,
      facilityFeeUsdPerLotPerSide: 1.5,
      vatPercent: 11,
      rolloverUsdPerLotPerNight: 0.5,
      priceSource: "Telequote",
      priceGuidance: "Last Trade",
      minimumSpread: "USD 0.10 / pip / barrel / side",
      maximumSpread: "USD 0.30 / pip / barrel / side",
      hecticSpread: "Based on market conditions",
      minimumPriceMovement: "USD 0.01 / barrel",
      limitStopRange: "USD 1–USD 20",
      deliveryBy: "Cash settlement",
    },
  ],
  disclaimer: {
    id: "Estimasi biaya dan level yang memakai aturan ini berlaku untuk TP Standard Trading Rules. Ketentuan, spread, biaya, jam, dan likuidasi dapat berbeda dari broker atau penyedia layanan lain.",
    en: "Cost and level estimates using these rules apply to TP Standard Trading Rules. Terms, spreads, fees, sessions, and liquidation may differ at other brokers or service providers.",
  },
  relationshipDisclosure: {
    id: "Dokumen sumber menjelaskan kerja sama PT Solid Gold Berjangka sebagai pialang peserta SPA dan PT Royal Assetindo sebagai penyelenggara SPA. Hubungan ini ditampilkan sebagai konteks sumber, bukan pilihan broker atau rekomendasi.",
    en: "The source document describes PT Solid Gold Berjangka as the SPA participating broker and PT Royal Assetindo as the SPA organizer. This relationship is disclosed as source context, not as a broker choice or recommendation.",
  },
};