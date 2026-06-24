import OpenAI from "openai";
import { z } from "zod";
import type { CalendarEvent } from "./calendar";
import type { NewsItem } from "./news";
import { isCryptoInstrument } from "./crypto-instruments";

export const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const TIMEFRAME_VALIDITY: Record<string, number> = {
  "1m": 15 * 60 * 1000,
  "5m": 60 * 60 * 1000,
  "15m": 2.5 * 60 * 60 * 1000,
  "30m": 3.5 * 60 * 60 * 1000,
  "1h": 5 * 60 * 60 * 1000,
  "4h": 18 * 60 * 60 * 1000,
  "1D": 36 * 60 * 60 * 1000,
  "1W": 96 * 60 * 60 * 1000,
};

export function getValidUntil(timeframe: string): Date {
  const durationMs = TIMEFRAME_VALIDITY[timeframe] ?? 60 * 60 * 1000;
  return new Date(Date.now() + durationMs);
}

const MarketCondition = z.enum(["trending_up", "trending_down", "ranging", "volatile"]);
const RiskLevel = z.enum(["low", "medium", "high"]);
const TradingBias = z.enum(["bearish_strong", "bearish", "neutral", "bullish", "bullish_strong"]);

const TradeSideSchema = z.object({
  entryZone: z.string().min(1),
  stopLoss: z.string().min(1),
  takeProfit1: z.string().min(1),
  takeProfit2: z.string().min(1),
  riskRewardRatio: z.string().min(1),
  rationale: z.string().min(1),
});

const TradePlanSchema = z.object({
  preferredSide: z.enum(["buy", "sell", "wait"]),
  buy: TradeSideSchema,
  sell: TradeSideSchema,
});

export type TradePlan = z.infer<typeof TradePlanSchema>;
export type TradeSide = z.infer<typeof TradeSideSchema>;

/**
 * The model is asked to record which news headlines and calendar
 * events it actually leaned on so we can verify the fundamental
 * commentary is grounded in the snapshot we sent (vs. fabricated).
 * Optional because legacy responses + analyses with no fundamental
 * data won't have one.
 */
const FundamentalCitationsSchema = z.object({
  newsTitles: z.array(z.string()).default([]),
  calendarEvents: z.array(z.string()).default([]),
});

export type FundamentalCitations = z.infer<typeof FundamentalCitationsSchema>;

const BeginnerAIOutputSchema = z.object({
  marketCondition: MarketCondition,
  riskLevel: RiskLevel,
  confidenceMin: z.number().int().min(1).max(65),
  confidenceMax: z.number().int().min(11).max(75),
  tradingBias: TradingBias,
  opportunity: z.string().min(1),
  risk: z.string().min(1),
  mainScenario: z.string().min(1),
  alternativeScenario: z.string().min(1),
  whyReason: z.string().min(1),
  failureConditions: z.string().min(1),
  tradePlan: TradePlanSchema,
  fundamentalCitations: FundamentalCitationsSchema.optional(),
});

const ProAIOutputSchema = z.object({
  marketCondition: MarketCondition,
  riskLevel: RiskLevel,
  confidenceMin: z.number().int().min(1).max(70),
  confidenceMax: z.number().int().min(11).max(80),
  tradingBias: TradingBias,
  opportunity: z.string().min(1),
  risk: z.string().min(1),
  baseCase: z.string().min(1),
  bullishScenario: z.string().min(1),
  bearishScenario: z.string().min(1),
  keyDriversTechnical: z.string().min(1),
  keyDriversFundamental: z.string().min(1),
  marketContext: z.string().min(1),
  invalidationConditions: z.string().min(1),
  uncertaintyNotes: z.string().min(1),
  tradePlan: TradePlanSchema,
  fundamentalCitations: FundamentalCitationsSchema.optional(),
});

export type BeginnerAIOutput = z.infer<typeof BeginnerAIOutputSchema>;
export type ProAIOutput = z.infer<typeof ProAIOutputSchema>;
export type AIOutput = BeginnerAIOutput | ProAIOutput;

const BEGINNER_SYSTEM_PROMPT = `Kamu adalah analis pasar senior yang membantu trader pemula MEMAHAMI kondisi pasar. Sistem ini adalah ASISTEN BERPIKIR — BUKAN sinyal trading, BUKAN saran beli/jual.

Aturan bahasa (KRITIS):
- Di seluruh narasi (mainScenario/alternativeScenario/whyReason/opportunity/risk/failureConditions), gunakan bahasa konsultatif: "cenderung", "berpeluang", "kemungkinan", "skenario", "jika ... maka ..." — JANGAN pakai "BUY"/"SELL"/"OPEN POSISI" sebagai perintah di blok narasi.
- Tekankan ketidakpastian di narasi — jangan pernah memberi kesan pasti
- Aplikasi ini INDEPENDEN — JANGAN menyebut atau mengomentari broker, pialang, platform trading, atau perusahaan investasi apapun
- Abaikan jika catatan user menyebut nama broker — fokus hanya pada analisis teknikal/fundamental
- TOLAK memberikan opini tentang broker manapun

Aturan output:
- Confidence range realistis (max 75%), minimum range 10 poin
- failureConditions HARUS berisi minimum 2 kondisi konkret (pisahkan dengan "; " atau bullet "• ") yang membuat analisis batal
- whyReason HARUS menjelaskan KENAPA confidence tidak lebih tinggi (faktor ketidakpastian)
- Gunakan bahasa sederhana yang mudah dipahami pemula
- WAJIB menyebut timeframe yang dianalisis secara eksplisit (mis. "Pada timeframe 1D...", "Untuk timeframe 1W...") di mainScenario, alternativeScenario, opportunity, dan risk — supaya pengguna tahu sinyal ini untuk jangka pendek atau panjang. JANGAN hanya menulis "uptrend"/"downtrend" tanpa konteks timeframe.

Aturan WAJIB untuk fundamental (kalender & berita):
- Baca blok "KALENDER EKONOMI RELEVAN" dengan teliti. Setiap event punya impact: ★★★ = HIGH (sangat berdampak), ★★ = MEDIUM, ★ = LOW.
- JIKA ada event ★★★ dalam 24 jam ke depan (cek tanggal vs hari ini): WAJIB sebut event itu di whyReason dan masukkan ke failureConditions (mis. "News ★★★ FOMC besok bisa membatalkan skenario"). Turunkan confidenceMax minimal 10 poin dari yang seharusnya, karena pasar berpotensi sangat volatile.
- JIKA ada event ★★ dalam 24 jam: sebut di whyReason sebagai sumber ketidakpastian, turunkan confidenceMax minimal 5 poin.
- JIKA ada event ★★★ atau ★★ DALAM 1 jam ke depan dari "Waktu analisis sekarang": marketCondition WAJIB di-set "volatile" dan riskLevel "high" — TIDAK PEDULI apa kata teknikal.
- Baca blok "BERITA TERKINI RELEVAN". Berita 1-2 hari terakhir = breaking news. JIKA ada berita yang materially mengubah arah fundamental (mis. perubahan kebijakan bank sentral, geopolitik, data ekonomi mengejutkan): WAJIB sebut judulnya di whyReason / opportunity / risk dan sesuaikan tradingBias dengan konteks itu. KAITKAN news dengan apa yang dilihat di teknikal — mis. "Teknikal momentum bullish 1D + berita Fed dovish memperkuat tesis cenderung naik."
- JIKA tidak ada blok "KALENDER EKONOMI RELEVAN" / "BERITA TERKINI RELEVAN" sama sekali di input ATAU keduanya kosong: WAJIB tulis "Tidak ada katalis fundamental signifikan terdeteksi pada window ini" di whyReason dan KOSONGKAN fundamentalCitations.newsTitles dan fundamentalCitations.calendarEvents — JANGAN mengarang event/berita yang tidak ada.
- KETIKA menurunkan confidenceMax karena event/news, WAJIB juga turunkan confidenceMin agar selisih (max - min) tetap minimal 10 poin. JANGAN sampai range jadi mengecil.

Aturan WAJIB untuk fundamentalCitations (jejak provenance):
- WAJIB isi field "fundamentalCitations" dengan judul berita + nama event yang BENAR-BENAR ada di blok BERITA / KALENDER di atas. Salin judul/nama persis seperti yang tertulis (boleh dipotong tetapi harus tetap dapat dikenali — mis. "FOMC Rate Decision" untuk event "FOMC Rate Decision" walau aslinya "★★★ USD — FOMC Rate Decision").
- JIKA blok BERITA non-empty dan kamu menyebut beritanya di whyReason / opportunity / risk: judul yang kamu sebut HARUS muncul di fundamentalCitations.newsTitles.
- JIKA blok KALENDER non-empty dan kamu menyebut event-nya: nama event HARUS muncul di fundamentalCitations.calendarEvents.
- DILARANG mengarang judul berita atau nama event yang tidak muncul di blok input — output kamu akan divalidasi terhadap snapshot.

Aturan WAJIB untuk tradePlan (saran level konkret):
- WAJIB isi field "tradePlan" dengan harga konkret untuk SKENARIO BUY DAN SKENARIO SELL — keduanya, bahkan kalau bias hanya condong ke satu arah. User berhak tahu level kalau skenario sebaliknya yang terjadi.
- ANCHOR semua harga ke "Harga terakhir" yang ada di blok DATA TEKNIKAL. Format harga sesuai instrumen (mis. 1.0857 untuk EUR/USD, 4650.50 untuk emas dalam USD, 16275 untuk USD/IDR).
- Untuk SISI BUY: entryZone biasanya pullback ke support / breakout level di atas harga; stopLoss di bawah swing-low / invalidasi struktur; takeProfit1 = target dekat (resistance terdekat); takeProfit2 = target lanjutan (resistance berikut). riskRewardRatio dihitung dari mid entry ke TP1 vs SL (mis. "1:1.8").
- Untuk SISI SELL: entryZone biasanya pullback ke resistance / breakdown level di bawah harga; stopLoss di atas swing-high; takeProfit1 = support terdekat; takeProfit2 = support berikut.
- rationale tiap sisi: 1 kalimat singkat menjelaskan kenapa level itu dipilih (mis. "Pullback ke EMA200 4h sebagai support dinamis").
- preferredSide: "buy" jika tradingBias bullish/bullish_strong, "sell" jika bearish/bearish_strong, "wait" jika neutral atau marketCondition volatile.
- JIKA blok DATA TEKNIKAL tidak ada "Harga terakhir" / data harga: set preferredSide="wait", isi field harga dengan deskripsi seperti "menunggu konfirmasi level kunci di area support/resistance" dan riskRewardRatio "n/a".
- INI TETAP SARAN OBJEKTIF, BUKAN PERINTAH ORDER. Boleh pakai kata "buy"/"sell" di field tradePlan karena memang label sisi skenario, tapi rationale harus tetap konsultatif.

Output HANYA objek JSON (tanpa markdown, tanpa penjelasan tambahan) dengan keys berikut:
{
  "marketCondition": "trending_up" | "trending_down" | "ranging" | "volatile",
  "riskLevel": "low" | "medium" | "high",
  "confidenceMin": number (1-65),
  "confidenceMax": number (confidenceMin+10 sampai 75),
  "tradingBias": "bearish_strong" | "bearish" | "neutral" | "bullish" | "bullish_strong" (kecenderungan arah — gunakan "neutral" jika sinyalnya seimbang/ranging atau lebih baik tunggu),
  "opportunity": "string (peluang yang dilihat: ke mana harga BERPELUANG bergerak dan kenapa, 1-2 kalimat. JANGAN janjikan profit. Bicara skenario, bukan angka spesifik di sini — angka ada di tradePlan)",
  "risk": "string (risiko utama: skenario merugikan dan ketidakpastian yang harus diwaspadai, 1-2 kalimat)",
  "mainScenario": "string (Skenario A — skenario utama yang paling mungkin, 2-3 kalimat. Bicara struktur/arah, bukan angka spesifik — angka ada di tradePlan)",
  "alternativeScenario": "string (Skenario B — skenario alternatif jika asumsi tidak terjadi, 1-2 kalimat)",
  "whyReason": "string (alasan mengapa skenario ini mungkin terjadi DAN kenapa confidence tidak lebih tinggi, 2-3 kalimat. Sebutkan news/event spesifik kalau ada di input.)",
  "failureConditions": "string (minimum 2 kondisi konkret yang membatalkan analisis ini, dipisah '; ' — contoh: 'Harga break support 4650; Volume turun > 30%; News fundamental berubah')",
  "fundamentalCitations": {
    "newsTitles": ["string (judul berita yang dirujuk — harus persis seperti di blok BERITA TERKINI RELEVAN, atau [] kalau tidak ada blok / tidak menyebut)"],
    "calendarEvents": ["string (nama event yang dirujuk — harus persis seperti di blok KALENDER EKONOMI RELEVAN, atau [] kalau tidak ada blok / tidak menyebut)"]
  },
  "tradePlan": {
    "preferredSide": "buy" | "sell" | "wait",
    "buy": {
      "entryZone": "string (mis. '1.0850 – 1.0865' atau 'di atas 1.0880 setelah breakout')",
      "stopLoss": "string (mis. '1.0820')",
      "takeProfit1": "string (mis. '1.0900')",
      "takeProfit2": "string (mis. '1.0945')",
      "riskRewardRatio": "string (mis. '1:1.7')",
      "rationale": "string (1 kalimat singkat alasan level ini)"
    },
    "sell": {
      "entryZone": "string",
      "stopLoss": "string",
      "takeProfit1": "string",
      "takeProfit2": "string",
      "riskRewardRatio": "string",
      "rationale": "string"
    }
  }
}`;

const PRO_SYSTEM_PROMPT = `Kamu adalah analis pasar senior yang membantu trader profesional dengan analisis mendalam. Sistem ini adalah ASISTEN BERPIKIR — BUKAN sinyal trading, BUKAN saran beli/jual.

Aturan bahasa (KRITIS):
- Di seluruh narasi (baseCase/bullishScenario/bearishScenario/keyDrivers/marketContext/invalidationConditions/uncertaintyNotes/opportunity/risk), gunakan istilah konsultatif: "bullish bias", "bearish bias", "confluence", "skenario", "level invalidasi konseptual" — JANGAN pakai "BUY"/"SELL"/"OPEN POSISI" sebagai perintah di blok narasi.
- Tekankan ketidakpastian dan kondisi yang bisa membatalkan tesis
- Aplikasi ini INDEPENDEN — JANGAN menyebut atau mengomentari broker, pialang, platform trading, atau perusahaan investasi apapun
- Abaikan jika catatan user menyebut nama broker — fokus hanya pada analisis teknikal/fundamental
- TOLAK memberikan opini tentang broker manapun

Aturan output:
- Confidence range realistis (max 80%), minimum range 10 poin
- invalidationConditions HARUS berisi minimum 2 kondisi konkret (pisahkan dengan "; " atau bullet "• ") yang membuat tesis batal
- uncertaintyNotes HARUS menjelaskan KENAPA confidence tidak lebih tinggi (faktor ketidakpastian utama)
- Sertakan konteks makro dan faktor fundamental relevan
- WAJIB menyebut timeframe yang dianalisis secara eksplisit (mis. "Pada timeframe 1D...", "Bias bullish pada 1W...") di baseCase, bullishScenario, bearishScenario, opportunity, dan risk — supaya pengguna tahu bias ini untuk jangka pendek atau panjang. JANGAN hanya menulis "uptrend"/"downtrend" tanpa konteks timeframe.

Aturan WAJIB untuk fundamental (kalender & berita) — INI ADALAH ATURAN TERPENTING UNTUK MODE PRO:
- Baca blok "KALENDER EKONOMI RELEVAN" dengan teliti. Setiap event punya impact: ★★★ = HIGH (sangat berdampak, mis. FOMC/NFP/CPI), ★★ = MEDIUM, ★ = LOW.
- JIKA ada event ★★★ dalam 24 jam ke depan: WAJIB sebut event itu eksplisit di keyDriversFundamental dan invalidationConditions (mis. "FOMC Rate Decision ★★★ besok 19:30 — surprise hawkish bisa membatalkan tesis bullish"). Turunkan confidenceMax minimal 10 poin.
- JIKA ada event ★★ dalam 24 jam: sebut di uncertaintyNotes sebagai sumber risiko event-driven, turunkan confidenceMax minimal 5 poin.
- JIKA ada event ★★★/★★ DALAM 1 jam ke depan: marketCondition WAJIB di-set "volatile" dan riskLevel "high" — TIDAK PEDULI apa kata teknikal.
- Baca blok "BERITA TERKINI RELEVAN". Berita 1-2 hari terakhir = breaking news. JIKA ada berita material (perubahan kebijakan bank sentral, geopolitik, intervensi mata uang, data ekonomi mengejutkan): WAJIB sebut judul/intinya di keyDriversFundamental dan marketContext, dan sesuaikan tradingBias + bullishScenario + bearishScenario dengan konteks berita itu.
- JIKA berita fundamental BERTOLAK BELAKANG dengan sinyal teknikal: WAJIB sebut konflik ini di uncertaintyNotes dan turunkan confidenceMax minimal 10 poin.
- keyDriversFundamental WAJIB MENGAITKAN sisi fundamental dengan sisi teknikal — BUKAN cuma daftar event/news terpisah. Contoh yang BENAR: "FOMC Rate Decision besok berisiko membalik momentum bullish 1D yang ditunjukkan MACD; pasar pricing-in cut 25bps, surprise hawkish akan menarik DXY naik dan menekan emas." Contoh yang SALAH: "Ada event FOMC. Ada berita inflasi turun." (terlalu generik, tidak terikat ke teknikal.)
- JIKA tidak ada blok "KALENDER EKONOMI RELEVAN" / "BERITA TERKINI RELEVAN" sama sekali di input ATAU keduanya kosong: WAJIB tulis "Tidak ada katalis fundamental signifikan terdeteksi pada window ini — analisis murni teknikal." di keyDriversFundamental dan KOSONGKAN fundamentalCitations.newsTitles dan fundamentalCitations.calendarEvents — JANGAN mengarang event/berita yang tidak ada.

Aturan WAJIB untuk fundamentalCitations (jejak provenance):
- WAJIB isi field "fundamentalCitations" dengan judul berita + nama event yang BENAR-BENAR ada di blok BERITA / KALENDER di atas. Salin judul/nama persis seperti yang tertulis (boleh dipotong tetapi tetap dapat dikenali — mis. "FOMC Rate Decision" untuk event yang aslinya "★★★ USD — FOMC Rate Decision").
- JIKA blok BERITA non-empty dan kamu menyebut beritanya di keyDriversFundamental / marketContext / uncertaintyNotes: judul yang kamu sebut HARUS muncul di fundamentalCitations.newsTitles.
- JIKA blok KALENDER non-empty dan kamu menyebut event-nya: nama event HARUS muncul di fundamentalCitations.calendarEvents.
- DILARANG mengarang judul berita / nama event yang tidak muncul di blok input — output kamu akan divalidasi terhadap snapshot dan akan ditolak jika ada citation fiktif.

Aturan WAJIB untuk tradePlan (saran level konkret):
- WAJIB isi field "tradePlan" dengan harga konkret untuk SKENARIO BUY DAN SKENARIO SELL — keduanya, terlepas dari arah bias. Trader pro butuh peta level dua sisi.
- ANCHOR semua harga ke "Harga terakhir" yang ada di blok DATA TEKNIKAL. Format harga sesuai instrumen (mis. 1.0857, 4650.50, 16275).
- Untuk sisi BUY: entryZone = pullback ke confluence support / breakout di atas resistance kunci; stopLoss di bawah swing-low / invalidasi struktur HTF; takeProfit1 = resistance terdekat / measured move pertama; takeProfit2 = target lanjutan / extension. riskRewardRatio dihitung dari mid entry → TP1 vs SL.
- Untuk sisi SELL: entryZone = pullback ke resistance / breakdown level; stopLoss di atas swing-high; TP1 = support terdekat; TP2 = support lanjutan.
- rationale tiap sisi: 1 kalimat — sebutkan confluence yang dipakai (mis. "Konfluensi EMA200 4h + Fib 0.618 swing terakhir").
- preferredSide: "buy" untuk bias bullish/bullish_strong, "sell" untuk bearish/bearish_strong, "wait" untuk neutral atau marketCondition volatile / event ★★★ window.
- JIKA tidak ada anchor harga di DATA TEKNIKAL: preferredSide="wait", isi field harga deskriptif ("menunggu reaksi di area kunci"), riskRewardRatio "n/a".
- INI TETAP SARAN OBJEKTIF, BUKAN PERINTAH ORDER. Field "buy"/"sell" di tradePlan adalah label sisi skenario.

Output HANYA objek JSON (tanpa markdown, tanpa penjelasan tambahan) dengan keys berikut:
{
  "marketCondition": "trending_up" | "trending_down" | "ranging" | "volatile",
  "riskLevel": "low" | "medium" | "high",
  "confidenceMin": number (1-70),
  "confidenceMax": number (confidenceMin+10 sampai 80),
  "tradingBias": "bearish_strong" | "bearish" | "neutral" | "bullish" | "bullish_strong" (bias arah berdasarkan konfluensi sinyal — gunakan "neutral" jika sinyalnya seimbang/ranging atau lebih baik wait),
  "opportunity": "string (peluang utama yang dilihat: ke mana harga BERPELUANG bergerak dan kenapa secara konseptual, 1-2 kalimat. JANGAN janjikan profit. Angka konkret ada di tradePlan)",
  "risk": "string (risiko utama: skenario merugikan, area invalidasi konseptual, dan ketidakpastian, 1-2 kalimat)",
  "baseCase": "string (Skenario A — skenario dasar yang paling mungkin, 2-3 kalimat. Bicara struktur, angka konkret ada di tradePlan)",
  "bullishScenario": "string (Skenario alternatif bullish, 1-2 kalimat. Konseptual)",
  "bearishScenario": "string (Skenario alternatif bearish, 1-2 kalimat. Konseptual)",
  "keyDriversTechnical": "string (faktor teknikal utama yang mendukung tesis)",
  "keyDriversFundamental": "string (faktor fundamental utama yang relevan — KAITKAN dengan sisi teknikal, JANGAN cuma daftar event)",
  "marketContext": "string (konteks makro/kondisi pasar saat ini)",
  "invalidationConditions": "string (minimum 2 kondisi konkret yang membatalkan tesis, dipisah '; ' — contoh: 'Break support 4650 dengan close H1; Volume drop > 30%; FOMC surprise hawkish')",
  "uncertaintyNotes": "string (ketidakpastian utama dan KENAPA confidence tidak lebih tinggi, 1-2 kalimat)",
  "fundamentalCitations": {
    "newsTitles": ["string (judul berita yang dirujuk — persis seperti di blok BERITA, [] kalau tidak ada)"],
    "calendarEvents": ["string (nama event yang dirujuk — persis seperti di blok KALENDER, [] kalau tidak ada)"]
  },
  "tradePlan": {
    "preferredSide": "buy" | "sell" | "wait",
    "buy": {
      "entryZone": "string (mis. '4640 – 4655' atau 'di atas 4680 setelah breakout H1')",
      "stopLoss": "string (mis. '4615')",
      "takeProfit1": "string (mis. '4690')",
      "takeProfit2": "string (mis. '4735')",
      "riskRewardRatio": "string (mis. '1:2.1')",
      "rationale": "string (1 kalimat confluence yang dipakai)"
    },
    "sell": {
      "entryZone": "string",
      "stopLoss": "string",
      "takeProfit1": "string",
      "takeProfit2": "string",
      "riskRewardRatio": "string",
      "rationale": "string"
    }
  }
}`;

const BROKER_KEYWORDS = [
  "broker", "pialang", "perusahaan", "platform", "metatrader", "mt4", "mt5",
  "ctrader", "ig ", "octa", "forex.com", "xm ", "fbs", "hotforex", "instaforex",
  "roboforex", "exness", "tickmill", "pepperstone", "ic markets", "oanda",
  "fxpro", "axiory", "amarkets", "alpari", "fxtm", "trading212", "etoro",
  "plus500", "capital.com", "xtb", "admirals", "tradeview", "vantage",
  "axi", "fusion", "blackbull", "fxgt", "weltrade", "moneta", "windsor",
  "assetsfx", "finex", "mifx", "mrt", "prim", "rika", "sinarmas", "phillip",
  "dbs", "mandiri", "bni", "bri", "cimb", "permata", "mega",
];

function sanitizeNotes(notes: string): string {
  const lower = notes.toLowerCase();
  const hasBrokerRef = BROKER_KEYWORDS.some((kw) => lower.includes(kw));
  if (hasBrokerRef) {
    return "[Catatan dihapus: aplikasi ini independen dan tidak membahas broker atau pialang manapun]";
  }
  return notes;
}

// Snapshot of fundamentals shown to the model; used to verify the
// emitted `fundamentalCitations` are grounded in real items.
export interface FundamentalSnapshot {
  newsItems: NewsItem[];
  calendarEvents: CalendarEvent[];
}

function normalizeForCitationMatch(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// A citation is "grounded" if it has an exact normalized substring
// match with a real item, OR shares ≥2 significant tokens (len ≥4)
// with the same real item (lets the model abbreviate without us
// flagging it as fabricated).
export function citationMatchesAny(citation: string, realItems: string[]): boolean {
  const normCit = normalizeForCitationMatch(citation);
  if (!normCit) return false;
  for (const real of realItems) {
    const normReal = normalizeForCitationMatch(real);
    if (!normReal) continue;
    if (normReal.includes(normCit) || normCit.includes(normReal)) return true;
  }
  const citTokens = normCit.split(" ").filter((t) => t.length >= 4);
  if (citTokens.length === 0) {
    // Short citation (CPI / NFP / FOMC) — accept iff the whole
    // normalized citation appears in some real item.
    return realItems.some((r) =>
      normalizeForCitationMatch(r).includes(normCit),
    );
  }
  for (const real of realItems) {
    const normReal = normalizeForCitationMatch(real);
    const matches = citTokens.filter((t) => normReal.includes(t)).length;
    if (matches >= Math.min(2, citTokens.length)) return true;
  }
  return false;
}

interface CitationValidation {
  ok: boolean;
  reason?: string;
}

export function validateFundamentalCitations(
  citations: FundamentalCitations | undefined,
  snapshot: FundamentalSnapshot | null,
): CitationValidation {
  const noSnapshot =
    !snapshot ||
    (snapshot.newsItems.length === 0 && snapshot.calendarEvents.length === 0);

  if (noSnapshot) {
    if (
      citations &&
      (citations.newsTitles.length > 0 || citations.calendarEvents.length > 0)
    ) {
      return {
        ok: false,
        reason:
          "Model fabricated fundamental citations even though no news or calendar items were provided in the input.",
      };
    }
    return { ok: true };
  }

  // Snapshot can be non-empty while the model decides fundamentals are not
  // materially relevant for this specific setup/timeframe. Do not hard-fail
  // solely because citations are empty; only fail on fabricated citations.
  const cited =
    (citations?.newsTitles.length ?? 0) +
    (citations?.calendarEvents.length ?? 0);
  if (cited === 0) {
    return { ok: true };
  }
  if (!citations) return { ok: true };

  const realNews = snapshot.newsItems.map((n) => n.title);
  const realEvents = snapshot.calendarEvents.map(
    (e) => `${e.event} ${e.currency}`,
  );

  for (const t of citations.newsTitles) {
    if (!citationMatchesAny(t, realNews)) {
      return {
        ok: false,
        reason: `News citation "${t}" does not match any headline in the snapshot.`,
      };
    }
  }
  for (const e of citations.calendarEvents) {
    if (!citationMatchesAny(e, realEvents)) {
      return {
        ok: false,
        reason: `Calendar citation "${e}" does not match any event in the snapshot.`,
      };
    }
  }
  return { ok: true };
}

async function callOpenAI(
  systemPrompt: string,
  userMessage: string,
  model: string,
  maxTokens?: number,
  timeoutMs?: number,
): Promise<unknown> {
  const request = openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: maxTokens,
  });
  const response = timeoutMs && timeoutMs > 0
    ? await Promise.race([
        request,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`OpenAI timeout after ${timeoutMs}ms`)), timeoutMs),
        ),
      ])
    : await request;

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content);
}

function buildFastIntradayFallback(mode: "beginner" | "pro", timeframe: string): AIOutput {
  const baseTradePlan: TradePlan = {
    preferredSide: "wait",
    buy: {
      entryZone: "tunggu pullback terkonfirmasi",
      stopLoss: "n/a",
      takeProfit1: "n/a",
      takeProfit2: "n/a",
      riskRewardRatio: "n/a",
      rationale: "Timeframe sangat cepat, noise tinggi.",
    },
    sell: {
      entryZone: "tunggu rejection terkonfirmasi",
      stopLoss: "n/a",
      takeProfit1: "n/a",
      takeProfit2: "n/a",
      riskRewardRatio: "n/a",
      rationale: "Timeframe sangat cepat, noise tinggi.",
    },
  };

  if (mode === "beginner") {
    return {
      marketCondition: "volatile",
      riskLevel: "high",
      confidenceMin: 25,
      confidenceMax: 40,
      tradingBias: "neutral",
      opportunity: `Pada timeframe ${timeframe}, peluang terbaik adalah menunggu konfirmasi arah yang lebih jelas.`,
      risk: `Pada timeframe ${timeframe}, pergerakan acak dan spike cepat dapat memicu sinyal palsu.`,
      mainScenario: `Pada timeframe ${timeframe}, harga cenderung bergerak fluktuatif jangka sangat pendek.`,
      alternativeScenario: `Jika momentum tiba-tiba menguat satu arah, ikuti hanya setelah candle konfirmasi.`,
      whyReason: `Keyakinan dibatasi karena timeframe ${timeframe} sangat sensitif terhadap noise intraday.`,
      failureConditions: "Terjadi lonjakan volatilitas mendadak; Struktur mikro berubah cepat dalam beberapa candle",
      tradePlan: baseTradePlan,
      fundamentalCitations: { newsTitles: [], calendarEvents: [] },
    };
  }

  return {
    marketCondition: "volatile",
    riskLevel: "high",
    confidenceMin: 25,
    confidenceMax: 40,
    tradingBias: "neutral",
    opportunity: `Pada timeframe ${timeframe}, peluang taktis muncul setelah konfirmasi breakout/rejection mikro.`,
    risk: `Pada timeframe ${timeframe}, noise order flow dapat membalik sinyal dalam hitungan menit.`,
    baseCase: `Pada timeframe ${timeframe}, bias netral dengan volatilitas tinggi sampai ada struktur yang valid.`,
    bullishScenario: `Bullish hanya valid jika ada continuation jelas setelah break resistance mikro.`,
    bearishScenario: `Bearish hanya valid jika ada rejection kuat dan break support mikro.`,
    keyDriversTechnical: `Struktur mikro dan momentum jangka sangat pendek masih campuran pada timeframe ${timeframe}.`,
    keyDriversFundamental: "Tidak ada katalis fundamental signifikan yang dipakai pada mode cepat intraday.",
    marketContext: "Kondisi intraday cepat dengan probabilitas whipsaw tinggi.",
    invalidationConditions: "Breakout gagal dalam 1-2 candle; Volatilitas spike mematahkan struktur mikro",
    uncertaintyNotes: `Confidence dibatasi karena timeframe ${timeframe} memiliki rasio noise terhadap sinyal yang tinggi.`,
    tradePlan: baseTradePlan,
    fundamentalCitations: { newsTitles: [], calendarEvents: [] },
  };
}

// ---------------------------------------------------------------------------
// Trade-plan numeric hygiene
//
// The model free-texts every price level (entry/SL/TP) AND the
// riskRewardRatio string. Because the ratio is authored independently of the
// levels, it routinely drifts out of sync with the numbers shown right above
// it on the card ("perbandingan ratio yg dibawah suka salah"). We recompute it
// from the model's OWN entry/SL/TP1 so the displayed ratio is always
// internally consistent, and fall back to "n/a" when the levels are
// descriptive (no parseable price) — the honest state for a wait/no-anchor plan.
// ---------------------------------------------------------------------------

// Pull the representative price out of a free-text level. Entry zones are
// ranges ("1.0850 – 1.0865") → midpoint; SL/TP are usually single numbers.
// Returns null when nothing numeric is present ("menunggu konfirmasi ...").
//
// Timeframe tokens (H1, M15, 4H, 30m, 1D ...) are stripped FIRST so their
// digits can't be mistaken for a price — e.g. "di atas 4680 setelah breakout
// H1" must parse to 4680, not the mean of [4680, 1].
export function parseLevelPrice(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/,/g, "") // thousands separators; "." is the decimal point
    .replace(/\b[HMDWhmdw]\d{1,3}\b/g, " ") // H1, M15, D1, W1
    .replace(/\b\d{1,3}[mhdwMHDW]\b/g, " "); // 1m, 30m, 4h, 1D, 1W
  const matches = cleaned.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return null;
  const nums = matches.map(Number).filter((n) => Number.isFinite(n));
  if (nums.length === 0) return null;
  if (nums.length === 1) return nums[0]!;
  // Two or more numbers → treat the first two as a range and use the
  // midpoint (the representative price of an entry zone). Extra trailing
  // numbers are ignored rather than averaged in.
  return (nums[0]! + nums[1]!) / 2;
}

// Recompute "1:X.X" from entry → TP1 (reward) vs entry → SL (risk).
// Returns null when any level is non-numeric or the risk leg is zero. When a
// `side` is given, the levels must straddle the entry in the correct
// direction (buy: SL below, TP above; sell: SL above, TP below) — otherwise
// the plan is internally contradictory and we report "n/a" rather than a
// misleading ratio.
export function computeRiskReward(
  entryZone: string,
  stopLoss: string,
  takeProfit1: string,
  side?: "buy" | "sell",
): string | null {
  const entry = parseLevelPrice(entryZone);
  const sl = parseLevelPrice(stopLoss);
  const tp1 = parseLevelPrice(takeProfit1);
  if (entry === null || sl === null || tp1 === null) return null;
  if (side === "buy" && !(sl < entry && tp1 > entry)) return null;
  if (side === "sell" && !(sl > entry && tp1 < entry)) return null;
  const risk = Math.abs(entry - sl);
  const reward = Math.abs(tp1 - entry);
  if (!(risk > 0) || !Number.isFinite(reward)) return null;
  const ratio = reward / risk;
  if (!Number.isFinite(ratio) || ratio <= 0) return null;
  return `1:${ratio.toFixed(1)}`;
}

// Replace each side's riskRewardRatio with the value implied by its own
// levels so the card never shows a ratio that contradicts the prices above it.
export function reconcileTradePlanRiskReward(plan: TradePlan): TradePlan {
  const fixSide = (side: TradeSide, dir: "buy" | "sell"): TradeSide => ({
    ...side,
    riskRewardRatio:
      computeRiskReward(side.entryZone, side.stopLoss, side.takeProfit1, dir) ??
      "n/a",
  });
  return {
    ...plan,
    buy: fixSide(plan.buy, "buy"),
    sell: fixSide(plan.sell, "sell"),
  };
}

// Apply post-processing hygiene to a validated AI output before returning it.
function finalizeOutput(out: AIOutput): AIOutput {
  return {
    ...out,
    tradePlan: reconcileTradePlanRiskReward(out.tradePlan),
  } as AIOutput;
}

export async function generateAnalysis(
  instrument: string,
  timeframe: string,
  mode: "beginner" | "pro",
  notes?: string,
  indicatorContext?: string,
  fundamentalSnapshot?: FundamentalSnapshot | null,
  livePrice?: number | null,
): Promise<AIOutput> {
  const isFastIntraday = timeframe === "1m" || timeframe === "5m";
  const selectedModel =
    isFastIntraday
      ? process.env["OPENAI_MODEL_FAST_INTRADAY"] ??
        process.env["OPENAI_MODEL"] ??
        "gpt-4o-mini"
      : process.env["OPENAI_MODEL"] ?? "gpt-4o";
  const cleanNotes = notes ? sanitizeNotes(notes) : undefined;
  const fastIntradayTimeoutMs = isFastIntraday ? 2800 : undefined;
  const now = new Date();
  const nowIsoUtc = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const nowJakarta = now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "short",
  });
  // Indonesian-native style guide. Injected on every analysis so the
  // narrative reads like a senior Indonesian analyst speaking to
  // retail traders — not a literal translation. The analogies stay
  // optional ("boleh, jangan dipaksakan") so the model doesn't shoe-
  // horn them into setups where they don't fit. Casual register
  // (lo/gw/lu) is explicitly forbidden — keep it professional-friendly
  // ("kamu", "kita") to match the rest of the app copy.
  const indoStyleGuide = [
    `\nGAYA BAHASA INDONESIA (WAJIB ikuti — narasi terdengar natif, bukan terjemahan literal):`,
    `- Sapaan: "kamu" / "kita". JANGAN gunakan lo/gw/lu/elu. Tetap konsultatif tapi akrab — bukan robotik, bukan kaku formal "Anda".`,
    `- Pilih kata kerja aktif khas trader Indonesia: "nyangkut" (bukan "terjebak posisi"), "cut loss" (boleh dipakai, istilah baku), "wait and see", "kabur duluan", "antre di support", "nyemplung", "tahan dulu", "longgar dulu", "bablas ke atas/bawah".`,
    `- Untuk kondisi pasar, ANALOGI ringan boleh dipakai (1-2x per analisis maksimal, jangan diulang-ulang). Contoh kanonik yang boleh kamu adaptasi sesuai konteks (JANGAN dipaksakan kalau tidak cocok):`,
    `   * Ranging/sideways yang sempit: "pasar lagi kalem kayak weekend di tol dalam kota" / "gerak harga tipis kayak gajian belum cair".`,
    `   * Volatil setelah news: "habis news langsung ngebut kayak Senayan jam 9 malam" / "candle whipsaw, mirip antri di pintu tol pas hujan".`,
    `   * Breakout setelah konsolidasi: "harga akhirnya keluar dari kandang" / "akhirnya jebol setelah lama numpuk di pintu".`,
    `   * Trend kuat: "momentum kenceng kayak motor di jalur kanan" / "satu arah aja, kayak commuter line pagi".`,
    `   * Pullback ke support sehat: "harga balik dulu narik napas sebelum lanjut" / "kayak ngumpulin tenaga sebelum push lagi".`,
    `- ANALOGI WAJIB JUSTIFIED: setelah analoginya, sambungkan ke bukti teknikal/fundamental ("...kayak weekend di tol dalam kota — ATR turun 40% vs minggu lalu dan volume tipis"). Analogi tanpa data = SALAH.`,
    `- Istilah teknikal tetap pakai bahasa Inggris baku: "support", "resistance", "breakout", "ATR", "RSI", "MACD", "EMA200", "swing-high", "TP1/TP2", "SL", "1H/4H/1D" — JANGAN diterjemahkan paksa ke "tingkat dukungan" / "rerata gerak eksponensial".`,
    `- Hindari kalimat hasil google-translate: "ini akan menjadi peluang yang sangat baik" → tulis "setup-nya menarik, tapi tetap tunggu konfirmasi". "Pasar sangat berfluktuasi" → "pasar lagi ngamuk" atau "volatilitas naik tajam".`,
    `- JANGAN gunakan emoji apapun.`,
  ].join("\n");

  const isCrypto = isCryptoInstrument(instrument);
  const cryptoContext = isCrypto
    ? [
        `\nKONTEKS ASET — CRYPTO SPOT:`,
        `- ${instrument} adalah pasangan crypto-spot yang diperdagangkan 24/7 tanpa sesi London/Tokyo/New York. Jangan menyebut "buka sesi" atau "tutup sesi" gaya forex.`,
        `- Volatilitas intraday cenderung jauh lebih tinggi dari forex/komoditas; ATR & spike candle wajar lebih lebar. Sesuaikan ekspektasi SL/TP secara proporsional pada timeframe ${timeframe}.`,
        `- Driver utama: sentimen risk-on/risk-off global, ekspektasi suku bunga The Fed, BTC dominance (untuk altcoin), funding rate perp & berita regulasi (SEC/ETF/exchange). Sebut bila relevan; jangan dipaksakan.`,
        `- Likuiditas tertipis pada akhir pekan (Sabtu–Minggu UTC); breakout di window ini lebih rawan whipsaw — wajar untuk men-down-tone confidence di kondisi tersebut.`,
      ].join("\n")
    : "";

  // Live mid-price anchor. The indicator block (which carries "Harga
  // terakhir") is best-effort and frequently absent — instruments Yahoo
  // doesn't cover for indicators, or a transient upstream miss. When it's
  // missing the model has no price to anchor to and, per its prompt rules,
  // falls back to a "wait" plan with descriptive levels instead of concrete
  // numbers ("angkanya gak keluar"). Feeding the 15s-cached live-feed price
  // as an explicit anchor lets it produce real entry/SL/TP without indicators.
  const livePriceAnchor =
    typeof livePrice === "number" && Number.isFinite(livePrice)
      ? [
          `\n=== HARGA LIVE (anchor utama) ===`,
          `Harga terakhir: ${livePrice} (${instrument}, harga live saat analisis)`,
          `WAJIB pakai angka ini sebagai anchor untuk semua level di tradePlan (entry/SL/TP) dengan harga konkret. JANGAN set preferredSide="wait" hanya karena indikator teknikal tidak tersedia — kamu sudah punya harga acuan ini.`,
          `===`,
        ].join("\n")
      : "";

  const baseUserMessage = [
    `Waktu analisis sekarang: ${nowIsoUtc} (UTC) — atau ${nowJakarta} WIB.`,
    `Gunakan waktu ini sebagai patokan untuk menghitung jendela 1 jam / 24 jam ke depan pada event kalender.`,
    `Analisis pasar untuk instrumen: ${instrument}, timeframe: ${timeframe}`,
    `PENTING: semua narasi (skenario, peluang, risiko, bias arah) HARUS menyebut timeframe "${timeframe}" secara eksplisit, bukan hanya kata "uptrend"/"downtrend" saja.`,
    indoStyleGuide,
    cryptoContext,
    livePriceAnchor,
    indicatorContext ? indicatorContext : "",
    cleanNotes ? `\nCatatan tambahan dari trader: ${cleanNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const systemPrompt =
    mode === "beginner" ? BEGINNER_SYSTEM_PROMPT : PRO_SYSTEM_PROMPT;
  const fastIntradayPrompt =
    mode === "beginner"
      ? `Kamu analis intraday super ringkas untuk timeframe sangat pendek (1m/5m). Keluarkan HANYA JSON valid sesuai schema. Fokus murni pada struktur harga jangka sangat pendek + risiko tinggi noise. Jangan narasi panjang. Setiap field string cukup 1 kalimat pendek. Tetap konsultatif, bukan instruksi order.`
      : `Kamu analis intraday pro super ringkas untuk timeframe sangat pendek (1m/5m). Keluarkan HANYA JSON valid sesuai schema. Fokus murni pada momentum/struktur mikro + invalidasi cepat. Jangan narasi panjang. Setiap field string cukup 1 kalimat pendek. Tetap konsultatif, bukan instruksi order.`;
  const effectiveSystemPrompt = isFastIntraday ? fastIntradayPrompt : systemPrompt;
  const maxTokens = isFastIntraday ? 700 : undefined;
  const schema = mode === "beginner" ? BeginnerAIOutputSchema : ProAIOutputSchema;
  const snapshot = fundamentalSnapshot ?? null;

  const parseAttempt = (raw: unknown): AIOutput => {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`AI output validation failed: ${parsed.error.message}`);
    }
    return parsed.data;
  };

  // First attempt.
  let raw: unknown;
  try {
    raw = await callOpenAI(
      effectiveSystemPrompt,
      baseUserMessage,
      selectedModel,
      maxTokens,
      fastIntradayTimeoutMs,
    );
  } catch (e) {
    if (isFastIntraday) return buildFastIntradayFallback(mode, timeframe);
    throw e;
  }
  let parsed: AIOutput;
  try {
    parsed = parseAttempt(raw);
  } catch (e) {
    if (isFastIntraday) {
      return buildFastIntradayFallback(mode, timeframe);
    }
    // Validation failed on first try — rerun with a corrective hint
    // before giving up. Schema errors are usually missing or wrong
    // type fields (e.g. confidenceMax dropped) and one nudged retry
    // typically fixes them without paying for a third call.
    const correction =
      "\n\n[KOREKSI WAJIB] Output JSON sebelumnya gagal validasi. Pastikan SEMUA field wajib hadir dengan tipe & enum yang benar, dan kembalikan HANYA objek JSON tanpa markdown.";
    raw = await callOpenAI(
      effectiveSystemPrompt,
      baseUserMessage + correction,
      selectedModel,
      maxTokens,
      fastIntradayTimeoutMs,
    );
    parsed = parseAttempt(raw);
  }

  // Citation grounding check. Done after schema validation so we know
  // `fundamentalCitations` shape is sound.
  const citationCheck = validateFundamentalCitations(
    parsed.fundamentalCitations,
    snapshot,
  );

  if (!citationCheck.ok) {
    if (isFastIntraday) {
      return buildFastIntradayFallback(mode, timeframe);
    }
    const correction = `\n\n[KOREKSI WAJIB — GROUNDING] ${citationCheck.reason} Output ulang analisis menggunakan HANYA judul berita / nama event yang BENAR-BENAR ada di blok BERITA TERKINI RELEVAN dan KALENDER EKONOMI RELEVAN di atas. Jika tidak ada item yang relevan, kosongkan fundamentalCitations.newsTitles / fundamentalCitations.calendarEvents dan tulis "Tidak ada katalis fundamental signifikan terdeteksi pada window ini" pada blok fundamental yang sesuai.`;
    const retryRaw = await callOpenAI(
      effectiveSystemPrompt,
      baseUserMessage + correction,
      selectedModel,
      maxTokens,
      fastIntradayTimeoutMs,
    );
    const retryParsed = parseAttempt(retryRaw);
    const retryCheck = validateFundamentalCitations(
      retryParsed.fundamentalCitations,
      snapshot,
    );
    if (retryCheck.ok) return finalizeOutput(retryParsed);
    // Hard fail after the corrective retry — the route turns this into
    // an HTTP 502 / quota refund, which is preferable to returning
    // ungrounded fundamental prose.
    console.warn(
      `[generateAnalysis] Citation grounding still failed after retry: ${retryCheck.reason}`,
    );
    throw new Error(
      `AI fundamental grounding failed after retry: ${retryCheck.reason}`,
    );
  }

  return finalizeOutput(parsed);
}
