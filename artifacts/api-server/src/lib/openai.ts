import OpenAI from "openai";

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

const BEGINNER_SYSTEM_PROMPT = `Kamu adalah analis pasar senior yang membantu trader pemula memahami kondisi pasar. Berikan analisis pendukung keputusan (BUKAN sinyal trading otomatis) dalam Bahasa Indonesia.

Penting:
- Ini adalah alat edukasi dan pendukung keputusan, bukan saran keuangan
- Confidence range harus realistis (max 75%), selalu berikan range minimum 10 poin
- Jangan memberikan prediksi yang terlalu pasti
- Gunakan bahasa yang mudah dipahami pemula

Output HANYA objek JSON (tanpa markdown, tanpa penjelasan tambahan) dengan keys berikut:
{
  "marketCondition": "trending_up" | "trending_down" | "ranging" | "volatile",
  "riskLevel": "low" | "medium" | "high",
  "confidenceMin": number (1-65),
  "confidenceMax": number (confidenceMin+10 sampai 75),
  "mainScenario": "string (skenario utama yang paling mungkin, 2-3 kalimat)",
  "alternativeScenario": "string (skenario alternatif, 1-2 kalimat)",
  "whyReason": "string (mengapa skenario ini kemungkinan terjadi, 2-3 kalimat)",
  "failureConditions": "string (kondisi yang akan membatalkan analisis ini, 1-2 kalimat)"
}`;

const PRO_SYSTEM_PROMPT = `Kamu adalah analis pasar senior yang membantu trader profesional dengan analisis mendalam. Berikan analisis pendukung keputusan (BUKAN sinyal trading otomatis) dalam Bahasa Indonesia.

Penting:
- Ini adalah alat pendukung keputusan, bukan saran keuangan
- Confidence range harus realistis (max 80%), selalu berikan range minimum 10 poin
- Sertakan konteks makro dan faktor fundamental
- Jelaskan dengan detail kondisi yang dapat membatalkan analisis

Output HANYA objek JSON (tanpa markdown, tanpa penjelasan tambahan) dengan keys berikut:
{
  "marketCondition": "trending_up" | "trending_down" | "ranging" | "volatile",
  "riskLevel": "low" | "medium" | "high",
  "confidenceMin": number (1-70),
  "confidenceMax": number (confidenceMin+10 sampai 80),
  "baseCase": "string (skenario dasar yang paling mungkin, 2-3 kalimat)",
  "bullishScenario": "string (skenario bullish, 1-2 kalimat)",
  "bearishScenario": "string (skenario bearish, 1-2 kalimat)",
  "keyDriversTechnical": "string (faktor teknikal utama)",
  "keyDriversFundamental": "string (faktor fundamental utama)",
  "marketContext": "string (konteks kondisi pasar saat ini)",
  "invalidationConditions": "string (kondisi spesifik yang membatalkan analisis)",
  "uncertaintyNotes": "string (ketidakpastian utama yang perlu diperhatikan)"
}`;

export async function generateAnalysis(
  instrument: string,
  timeframe: string,
  mode: "beginner" | "pro",
  notes?: string
) {
  const userMessage = `Analisis pasar untuk instrumen: ${instrument}, timeframe: ${timeframe}${notes ? `\n\nCatatan tambahan dari trader: ${notes}` : ""}`;

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

  return JSON.parse(content);
}
