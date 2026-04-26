import OpenAI from "openai";
import { z } from "zod";

export const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const TIMEFRAME_VALIDITY: Record<string, number> = {
  "1m": 15 * 60 * 1000,
  "5m": 60 * 60 * 1000,
  "15m": 2.5 * 60 * 60 * 1000,
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
});

export type BeginnerAIOutput = z.infer<typeof BeginnerAIOutputSchema>;
export type ProAIOutput = z.infer<typeof ProAIOutputSchema>;
export type AIOutput = BeginnerAIOutput | ProAIOutput;

const BEGINNER_SYSTEM_PROMPT = `Kamu adalah analis pasar senior yang membantu trader pemula MEMAHAMI kondisi pasar. Sistem ini adalah ASISTEN BERPIKIR — BUKAN sinyal trading, BUKAN saran beli/jual.

Aturan bahasa (KRITIS):
- DILARANG menggunakan kata "BUY", "SELL", "BELI", "JUAL", "ENTRY SEKARANG", "OPEN POSISI", atau perintah eksekusi lainnya
- DILARANG menyebutkan angka spesifik untuk entry, stop loss, take profit, atau target harga
- Gunakan bahasa konsultatif: "cenderung", "berpeluang", "kemungkinan", "skenario", "jika ... maka ..."
- Tekankan ketidakpastian — jangan pernah memberi kesan pasti
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
- Baca blok "BERITA TERKINI RELEVAN". Berita 1-2 hari terakhir = breaking news. JIKA ada berita yang materially mengubah arah fundamental (mis. perubahan kebijakan bank sentral, geopolitik, data ekonomi mengejutkan): WAJIB sebut judulnya di whyReason dan sesuaikan tradingBias + opportunity + risk dengan konteks itu.
- JIKA tidak ada blok kalender/berita di input: sebut "tidak ada katalis fundamental terdeteksi" di whyReason — JANGAN mengarang event yang tidak ada.
- KETIKA menurunkan confidenceMax karena event/news, WAJIB juga turunkan confidenceMin agar selisih (max - min) tetap minimal 10 poin. JANGAN sampai range jadi mengecil.

Output HANYA objek JSON (tanpa markdown, tanpa penjelasan tambahan) dengan keys berikut:
{
  "marketCondition": "trending_up" | "trending_down" | "ranging" | "volatile",
  "riskLevel": "low" | "medium" | "high",
  "confidenceMin": number (1-65),
  "confidenceMax": number (confidenceMin+10 sampai 75),
  "tradingBias": "bearish_strong" | "bearish" | "neutral" | "bullish" | "bullish_strong" (kecenderungan arah — gunakan "neutral" jika sinyalnya seimbang/ranging atau lebih baik tunggu),
  "opportunity": "string (peluang yang dilihat: ke mana harga BERPELUANG bergerak dan kenapa, 1-2 kalimat. JANGAN janjikan profit, JANGAN sebut angka spesifik)",
  "risk": "string (risiko utama: skenario merugikan dan ketidakpastian yang harus diwaspadai, 1-2 kalimat)",
  "mainScenario": "string (Skenario A — skenario utama yang paling mungkin, 2-3 kalimat. JANGAN sebut harga entry/SL/TP)",
  "alternativeScenario": "string (Skenario B — skenario alternatif jika asumsi tidak terjadi, 1-2 kalimat)",
  "whyReason": "string (alasan mengapa skenario ini mungkin terjadi DAN kenapa confidence tidak lebih tinggi, 2-3 kalimat)",
  "failureConditions": "string (minimum 2 kondisi konkret yang membatalkan analisis ini, dipisah '; ' — contoh: 'Harga break support 4650; Volume turun > 30%; News fundamental berubah')"
}`;

const PRO_SYSTEM_PROMPT = `Kamu adalah analis pasar senior yang membantu trader profesional dengan analisis mendalam. Sistem ini adalah ASISTEN BERPIKIR — BUKAN sinyal trading, BUKAN saran beli/jual.

Aturan bahasa (KRITIS):
- DILARANG menggunakan kata "BUY", "SELL", "BELI", "JUAL", "ENTRY SEKARANG", "OPEN POSISI", atau perintah eksekusi lainnya
- DILARANG menyebutkan angka spesifik untuk entry, stop loss, take profit, atau target harga
- Gunakan istilah konsultatif: "bullish bias", "bearish bias", "confluence", "skenario", "level invalidasi konseptual"
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

Aturan WAJIB untuk fundamental (kalender & berita):
- Baca blok "KALENDER EKONOMI RELEVAN" dengan teliti. Setiap event punya impact: ★★★ = HIGH (sangat berdampak, mis. FOMC/NFP/CPI), ★★ = MEDIUM, ★ = LOW.
- JIKA ada event ★★★ dalam 24 jam ke depan (cek tanggal vs hari ini): WAJIB sebut event itu eksplisit di keyDriversFundamental dan invalidationConditions (mis. "FOMC Rate Decision ★★★ besok 19:30 — surprise hawkish bisa membatalkan tesis bullish"). Turunkan confidenceMax minimal 10 poin dari yang seharusnya, karena pasar berpotensi sangat volatile dan tesis bisa di-overrule oleh news.
- JIKA ada event ★★ dalam 24 jam: sebut di uncertaintyNotes sebagai sumber risiko event-driven, turunkan confidenceMax minimal 5 poin.
- JIKA ada event ★★★/★★ DALAM 1 jam ke depan: marketCondition WAJIB di-set "volatile" dan riskLevel "high" — TIDAK PEDULI apa kata teknikal.
- Baca blok "BERITA TERKINI RELEVAN". Berita 1-2 hari terakhir = breaking news. JIKA ada berita yang materially mengubah arah fundamental (mis. perubahan kebijakan bank sentral, geopolitik, intervensi mata uang, data ekonomi mengejutkan): WAJIB sebut judul/intinya di keyDriversFundamental dan marketContext, dan sesuaikan tradingBias + bullishScenario + bearishScenario dengan konteks berita itu.
- JIKA berita fundamental BERTOLAK BELAKANG dengan sinyal teknikal (mis. teknikal bullish tapi news bearish dovish-shock): WAJIB sebut konflik ini di uncertaintyNotes dan turunkan confidenceMax minimal 10 poin — JANGAN pura-pura keduanya selaras.
- JIKA tidak ada blok kalender/berita di input: sebut "tidak ada katalis fundamental terdeteksi pada window ini" di marketContext — JANGAN mengarang event yang tidak ada.

Output HANYA objek JSON (tanpa markdown, tanpa penjelasan tambahan) dengan keys berikut:
{
  "marketCondition": "trending_up" | "trending_down" | "ranging" | "volatile",
  "riskLevel": "low" | "medium" | "high",
  "confidenceMin": number (1-70),
  "confidenceMax": number (confidenceMin+10 sampai 80),
  "tradingBias": "bearish_strong" | "bearish" | "neutral" | "bullish" | "bullish_strong" (bias arah berdasarkan konfluensi sinyal — gunakan "neutral" jika sinyalnya seimbang/ranging atau lebih baik wait),
  "opportunity": "string (peluang utama yang dilihat: ke mana harga BERPELUANG bergerak dan kenapa secara konseptual, 1-2 kalimat. JANGAN janjikan profit, JANGAN sebut angka entry/target spesifik)",
  "risk": "string (risiko utama: skenario merugikan, area invalidasi konseptual, dan ketidakpastian, 1-2 kalimat)",
  "baseCase": "string (Skenario A — skenario dasar yang paling mungkin, 2-3 kalimat. JANGAN sebut harga entry/SL/TP)",
  "bullishScenario": "string (Skenario alternatif bullish, 1-2 kalimat. Konseptual saja)",
  "bearishScenario": "string (Skenario alternatif bearish, 1-2 kalimat. Konseptual saja)",
  "keyDriversTechnical": "string (faktor teknikal utama yang mendukung tesis)",
  "keyDriversFundamental": "string (faktor fundamental utama yang relevan)",
  "marketContext": "string (konteks makro/kondisi pasar saat ini)",
  "invalidationConditions": "string (minimum 2 kondisi konkret yang membatalkan tesis, dipisah '; ' — contoh: 'Break support 4650 dengan close H1; Volume drop > 30%; FOMC surprise hawkish')",
  "uncertaintyNotes": "string (ketidakpastian utama dan KENAPA confidence tidak lebih tinggi, 1-2 kalimat)"
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

export async function generateAnalysis(
  instrument: string,
  timeframe: string,
  mode: "beginner" | "pro",
  notes?: string,
  indicatorContext?: string
): Promise<AIOutput> {
  const cleanNotes = notes ? sanitizeNotes(notes) : undefined;
  const now = new Date();
  const nowIsoUtc = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const nowJakarta = now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "short",
  });
  const userMessage = [
    `Waktu analisis sekarang: ${nowIsoUtc} (UTC) — atau ${nowJakarta} WIB.`,
    `Gunakan waktu ini sebagai patokan untuk menghitung jendela 1 jam / 24 jam ke depan pada event kalender.`,
    `Analisis pasar untuk instrumen: ${instrument}, timeframe: ${timeframe}`,
    `PENTING: semua narasi (skenario, peluang, risiko, bias arah) HARUS menyebut timeframe "${timeframe}" secara eksplisit, bukan hanya kata "uptrend"/"downtrend" saja.`,
    indicatorContext ? indicatorContext : "",
    cleanNotes ? `\nCatatan tambahan dari trader: ${cleanNotes}` : "",
  ].filter(Boolean).join("\n");

  const systemPrompt =
    mode === "beginner" ? BEGINNER_SYSTEM_PROMPT : PRO_SYSTEM_PROMPT;

  const response = await openai.chat.completions.create({
    model: process.env["OPENAI_MODEL"] ?? "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  const raw: unknown = JSON.parse(content);

  const schema = mode === "beginner" ? BeginnerAIOutputSchema : ProAIOutputSchema;
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`AI output validation failed: ${parsed.error.message}`);
  }

  return parsed.data;
}
