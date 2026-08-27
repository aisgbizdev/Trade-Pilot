// Bilingual fundamental-event explainer dictionary.
//
// Source of truth for "why this event matters" copy surfaced in the
// calendar widgets and pre-trade warning. Keyed off normalized
// substrings of the upstream event name so the same entry covers
// "US Non-Farm Payrolls", "Non Farm Payrolls (NFP)", etc.
//
// The dictionary is intentionally *not* exhaustive — it covers the
// ★★★/★★ macro releases that move FX & metals. Anything not matched
// returns null and the UI falls back to the existing whyTraderCare
// field from the upstream feed (or simply omits the explainer).

export interface EventExplainer {
  // Short headline used as the expander label.
  headline_en: string;
  headline_id: string;
  // 1-2 sentence plain-language explanation of what the release is.
  what_en: string;
  what_id: string;
  // Scenario hints: what tends to happen if actual > forecast vs <.
  // Kept short — full trade plan still comes from the AI analysis.
  if_higher_en: string;
  if_higher_id: string;
  if_lower_en: string;
  if_lower_id: string;
}

// Match patterns are case-insensitive substrings tried in order. First
// match wins, so put more specific keys first (e.g. "Core CPI" before
// "CPI", "FOMC Minutes" before "FOMC").
const ENTRIES: Array<{ patterns: string[]; data: EventExplainer }> = [
  {
    patterns: ["non-farm payroll", "nonfarm payroll", "non farm payroll", "nfp"],
    data: {
      headline_en: "Monthly US jobs report",
      headline_id: "Laporan tenaga kerja AS bulanan",
      what_en:
        "How many jobs the US economy added last month, excluding farm work. The single biggest scheduled mover for USD pairs and gold.",
      what_id:
        "Berapa banyak lapangan kerja baru di AS bulan lalu (di luar sektor pertanian). Rilis terjadwal paling berdampak ke pair USD dan emas.",
      if_higher_en:
        "Stronger jobs → market expects the Fed to stay tight → USD tends up, gold tends down.",
      if_higher_id:
        "Jobs lebih kuat → pasar mengira The Fed tahan suku bunga lebih lama → USD cenderung naik, emas cenderung turun.",
      if_lower_en:
        "Weaker jobs → rate-cut bets rise → USD tends down, gold tends up.",
      if_lower_id:
        "Jobs lebih lemah → ekspektasi rate cut naik → USD cenderung turun, emas cenderung naik.",
    },
  },
  {
    patterns: ["core cpi", "core consumer price"],
    data: {
      headline_en: "Inflation, food & energy stripped out",
      headline_id: "Inflasi inti, tanpa makanan & energi",
      what_en:
        "The Fed's preferred sticky-inflation gauge. Watched more closely than headline CPI for rate-decision implications.",
      what_id:
        "Ukuran inflasi 'lengket' yang paling dipantau The Fed untuk keputusan suku bunga, lebih penting dari CPI headline.",
      if_higher_en:
        "Hotter than forecast → hawkish Fed pricing → USD up, gold mixed (real-yield driven).",
      if_higher_id:
        "Lebih panas dari forecast → ekspektasi Fed hawkish → USD naik, emas campur (tergantung real yield).",
      if_lower_en:
        "Cooler than forecast → dovish pricing → USD down, gold and stocks tend up.",
      if_lower_id:
        "Lebih dingin dari forecast → ekspektasi dovish → USD turun, emas dan saham cenderung naik.",
    },
  },
  {
    patterns: ["cpi", "consumer price index"],
    data: {
      headline_en: "Headline inflation",
      headline_id: "Inflasi headline",
      what_en:
        "How much consumer prices changed year-over-year. Drives central-bank rate expectations directly.",
      what_id:
        "Perubahan harga konsumen year-over-year. Langsung menggerakkan ekspektasi suku bunga bank sentral.",
      if_higher_en: "Higher inflation → currency up on hike bets, gold mixed.",
      if_higher_id: "Inflasi lebih tinggi → mata uang naik karena ekspektasi rate hike, emas campur.",
      if_lower_en: "Lower inflation → currency down on cut bets, gold tends up.",
      if_lower_id: "Inflasi lebih rendah → mata uang turun karena ekspektasi rate cut, emas cenderung naik.",
    },
  },
  {
    patterns: ["pce price", "core pce"],
    data: {
      headline_en: "Fed's preferred inflation gauge",
      headline_id: "Ukuran inflasi favorit The Fed",
      what_en:
        "Personal Consumption Expenditures — the inflation series the Fed actually targets at 2%. Hits harder than CPI for USD.",
      what_id:
        "PCE adalah ukuran inflasi yang ditarget The Fed di 2%. Reaksi USD biasanya lebih tajam dari CPI.",
      if_higher_en: "Above forecast → hawkish Fed pricing → USD up.",
      if_higher_id: "Di atas forecast → Fed pricing hawkish → USD naik.",
      if_lower_en: "Below forecast → dovish pricing → USD down, gold up.",
      if_lower_id: "Di bawah forecast → pricing dovish → USD turun, emas naik.",
    },
  },
  {
    patterns: ["fomc minutes", "fomc meeting minutes"],
    data: {
      headline_en: "Detailed notes from last Fed meeting",
      headline_id: "Catatan rinci rapat Fed terakhir",
      what_en:
        "Released 3 weeks after each Fed meeting. Reveals how split the committee was on rates — surprises can re-price the whole curve.",
      what_id:
        "Dirilis 3 minggu setelah rapat Fed. Memperlihatkan seberapa terbelah komite soal suku bunga — kejutan bisa repricing kurva.",
      if_higher_en: "More hawkish than expected → USD up, gold down, stocks down.",
      if_higher_id: "Lebih hawkish dari ekspektasi → USD naik, emas turun, saham turun.",
      if_lower_en: "More dovish than expected → USD down, gold up, stocks up.",
      if_lower_id: "Lebih dovish dari ekspektasi → USD turun, emas naik, saham naik.",
    },
  },
  {
    patterns: ["fomc", "fed funds rate", "federal funds rate", "fed interest rate"],
    data: {
      headline_en: "Fed rate decision",
      headline_id: "Keputusan suku bunga The Fed",
      what_en:
        "The headline US monetary policy event. The decision itself is usually priced in — markets trade the Powell press conference 30 min later.",
      what_id:
        "Event kebijakan moneter AS paling penting. Keputusan biasanya sudah priced in — pasar bereaksi ke konferensi pers Powell 30 menit kemudian.",
      if_higher_en: "Hawkish surprise / dot-plot higher → USD up sharply, gold down.",
      if_higher_id: "Kejutan hawkish / dot-plot naik → USD melesat, emas anjlok.",
      if_lower_en: "Dovish surprise / cuts brought forward → USD down, gold up.",
      if_lower_id: "Kejutan dovish / cut dimajukan → USD turun, emas naik.",
    },
  },
  {
    patterns: ["ecb interest rate", "ecb rate decision", "ecb main refinanc"],
    data: {
      headline_en: "ECB rate decision",
      headline_id: "Keputusan suku bunga ECB",
      what_en:
        "Eurozone monetary policy. Market reaction is dominated by the Lagarde press conference and updated inflation projections.",
      what_id:
        "Kebijakan moneter zona Euro. Reaksi pasar didominasi konferensi pers Lagarde dan proyeksi inflasi baru.",
      if_higher_en: "Hawkish ECB → EUR up vs USD, JPY.",
      if_higher_id: "ECB hawkish → EUR naik vs USD, JPY.",
      if_lower_en: "Dovish ECB → EUR down vs USD, JPY.",
      if_lower_id: "ECB dovish → EUR turun vs USD, JPY.",
    },
  },
  {
    patterns: ["boj", "bank of japan", "japan rate"],
    data: {
      headline_en: "Bank of Japan decision",
      headline_id: "Keputusan Bank of Japan",
      what_en:
        "BoJ has been the world's most-watched dovish outlier. Any hint of policy normalization triggers violent JPY moves.",
      what_id:
        "BoJ jadi sorotan utama karena paling dovish di dunia. Sinyal kecil arah normalisasi bisa memicu pergerakan JPY tajam.",
      if_higher_en: "Hawkish shift → JPY up hard (USD/JPY down).",
      if_higher_id: "Pergeseran hawkish → JPY menguat tajam (USD/JPY turun).",
      if_lower_en: "Stay dovish → JPY down vs USD, EUR.",
      if_lower_id: "Tetap dovish → JPY melemah vs USD, EUR.",
    },
  },
  {
    patterns: ["unemployment rate"],
    data: {
      headline_en: "Share of workforce without a job",
      headline_id: "Persentase angkatan kerja yang menganggur",
      what_en:
        "Lagging indicator but politically loaded. Pairs with payrolls — a divergence (jobs up, unemployment up) usually signals labor-force shifts.",
      what_id:
        "Indikator lagging tapi punya bobot politik. Dipadukan dengan payrolls — divergensi (jobs naik, unemployment naik) biasanya tanda pergeseran angkatan kerja.",
      if_higher_en:
        "Higher than forecast → economy cooling → rate-cut bets rise → currency tends down, gold up.",
      if_higher_id:
        "Lebih tinggi dari forecast → ekonomi mendingin → ekspektasi rate cut naik → mata uang cenderung turun, emas naik.",
      if_lower_en:
        "Lower than forecast → tight labor market → currency up, gold down.",
      if_lower_id:
        "Lebih rendah dari forecast → pasar tenaga kerja ketat → mata uang naik, emas turun.",
    },
  },
  {
    patterns: ["retail sales"],
    data: {
      headline_en: "How much consumers spent last month",
      headline_id: "Belanja konsumen bulan lalu",
      what_en:
        "Real-time read on consumer demand — 2/3 of US GDP. Drives both growth and inflation expectations.",
      what_id:
        "Indikator real-time permintaan konsumen — 2/3 dari PDB AS. Mempengaruhi ekspektasi pertumbuhan dan inflasi.",
      if_higher_en: "Stronger sales → growth ok, hawkish read → USD up.",
      if_higher_id: "Penjualan lebih kuat → pertumbuhan ok, baca hawkish → USD naik.",
      if_lower_en: "Weaker sales → recession fear → USD down, gold up.",
      if_lower_id: "Penjualan lemah → kekhawatiran resesi → USD turun, emas naik.",
    },
  },
  {
    patterns: ["gdp", "gross domestic product"],
    data: {
      headline_en: "Total economic output",
      headline_id: "Total output ekonomi",
      what_en:
        "Quarterly snapshot of how fast the economy is growing. Revisions matter as much as the first print.",
      what_id:
        "Snapshot kuartalan kecepatan pertumbuhan ekonomi. Revisi sama pentingnya dengan rilis pertama.",
      if_higher_en: "Faster growth → currency up, equities up.",
      if_higher_id: "Pertumbuhan lebih cepat → mata uang naik, saham naik.",
      if_lower_en: "Slower growth → currency down, safe havens (gold, JPY) up.",
      if_lower_id: "Pertumbuhan lebih lambat → mata uang turun, safe haven (emas, JPY) naik.",
    },
  },
  {
    patterns: ["ppi", "producer price"],
    data: {
      headline_en: "Wholesale price inflation",
      headline_id: "Inflasi harga grosir",
      what_en:
        "Inflation at the factory gate — leading indicator for CPI. Watched as an early warning a few days before CPI.",
      what_id:
        "Inflasi di tingkat produsen — indikator leading untuk CPI. Jadi peringatan awal beberapa hari sebelum CPI.",
      if_higher_en: "Hotter PPI → flags hotter CPI later → currency up.",
      if_higher_id: "PPI lebih panas → sinyal CPI akan panas → mata uang naik.",
      if_lower_en: "Cooler PPI → flags cooler CPI → currency down, gold up.",
      if_lower_id: "PPI lebih dingin → sinyal CPI akan dingin → mata uang turun, emas naik.",
    },
  },
  {
    patterns: ["jobless claims", "initial claims", "unemployment claims"],
    data: {
      headline_en: "Weekly first-time jobless filings",
      headline_id: "Klaim pengangguran mingguan",
      what_en:
        "Highest-frequency labor-market signal — released every Thursday. A sudden 4-week trend break gets noticed.",
      what_id:
        "Sinyal pasar tenaga kerja frekuensi tertinggi — rilis tiap Kamis. Patahan tren 4 minggu langsung diperhatikan.",
      if_higher_en: "More claims → labor weakening → USD down, gold up.",
      if_higher_id: "Klaim naik → tenaga kerja melemah → USD turun, emas naik.",
      if_lower_en: "Fewer claims → labor tight → USD up.",
      if_lower_id: "Klaim turun → tenaga kerja ketat → USD naik.",
    },
  },
  {
    patterns: ["ism manufacturing", "ism services", "pmi"],
    data: {
      headline_en: "Business activity survey",
      headline_id: "Survei aktivitas bisnis",
      what_en:
        "Above 50 = expansion, below 50 = contraction. The forward-looking new-orders sub-index moves markets even when the headline is steady.",
      what_id:
        "Di atas 50 = ekspansi, di bawah 50 = kontraksi. Sub-indeks new-orders yang forward-looking sering menggerakkan pasar walau headline stabil.",
      if_higher_en: "Above 50 / beat → growth on, currency up.",
      if_higher_id: "Di atas 50 / beat → pertumbuhan ok, mata uang naik.",
      if_lower_en: "Below 50 / miss → contraction risk, currency down, gold up.",
      if_lower_id: "Di bawah 50 / miss → risiko kontraksi, mata uang turun, emas naik.",
    },
  },
  {
    patterns: ["crude oil inventories", "crude oil stocks", "eia crude"],
    data: {
      headline_en: "US weekly crude stockpiles",
      headline_id: "Stok minyak mentah AS mingguan",
      what_en:
        "A surprise build = more supply than demand → oil down. A surprise draw = tight supply → oil up. Affects CAD and energy stocks too.",
      what_id:
        "Build (stok naik) tak terduga = supply lebih dari demand → minyak turun. Draw (stok turun) = supply ketat → minyak naik. Pengaruhi CAD dan saham energi juga.",
      if_higher_en: "Build (stockpile up) → oil down, CAD down.",
      if_higher_id: "Build (stok naik) → minyak turun, CAD turun.",
      if_lower_en: "Draw (stockpile down) → oil up, CAD up.",
      if_lower_id: "Draw (stok turun) → minyak naik, CAD naik.",
    },
  },
];

function normalizeName(raw: string): string {
  return raw.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function lookupExplainer(eventName: string): EventExplainer | null {
  if (!eventName) return null;
  const normalized = normalizeName(eventName);
  for (const { patterns, data } of ENTRIES) {
    for (const p of patterns) {
      if (normalized.includes(p)) return data;
    }
  }
  return null;
}

export function explainerFor(
  eventName: string,
  lang: "en" | "id",
): {
  headline: string;
  what: string;
  if_higher: string;
  if_lower: string;
} | null {
  const e = lookupExplainer(eventName);
  if (!e) return null;
  if (lang === "id") {
    return {
      headline: e.headline_id,
      what: e.what_id,
      if_higher: e.if_higher_id,
      if_lower: e.if_lower_id,
    };
  }
  return {
    headline: e.headline_en,
    what: e.what_en,
    if_higher: e.if_higher_en,
    if_lower: e.if_lower_en,
  };
}
