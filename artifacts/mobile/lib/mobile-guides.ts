// A focused mobile reading path using IDs from the existing progression guide catalog.
export const MOBILE_GUIDES = [
  {
    id: "analysis-workflow",
    title: { en: "A disciplined analysis workflow", id: "Alur analisis yang disiplin" },
    paragraphs: {
      en: [
        "Start by choosing the market and timeframe you actually intend to study. Check whether you understand the current context and whether major news could change it.",
        "Before requesting an analysis, define how much risk you can accept. Review the invalidation point and ask whether you can wait for confirmation instead of chasing a move.",
        "Treat the AI output as a scenario, not an order. Compare its assumptions with the latest market conditions; if the conditions do not hold, staying out is a valid decision.",
      ],
      id: [
        "Mulai dengan memilih market dan timeframe yang memang ingin kamu amati. Pastikan konteksnya jelas dan cek apakah ada berita besar yang bisa mengubahnya.",
        "Sebelum meminta analisis, tentukan risiko yang sanggup kamu terima. Tinjau titik invalidation dan tanyakan apakah kamu bisa menunggu konfirmasi, bukan mengejar harga.",
        "Anggap hasil AI sebagai skenario, bukan perintah entry. Cocokkan asumsi dengan kondisi market terbaru; kalau syaratnya tidak terpenuhi, tidak entry juga keputusan yang valid.",
      ],
    },
  },
  {
    id: "standard-plan",
    title: { en: "Understanding a standard plan", id: "Memahami standard plan" },
    paragraphs: {
      en: [
        "A prediction says where price might go. A plan says what you will do if price moves in different ways. No analysis can guarantee a market outcome.",
        "A useful plan has conditions for entry, a point where the idea is invalid, and a clear decision to wait when conditions are missing. The stop-loss is part of the plan, not a promise that every exit fills at that price.",
        "When new information contradicts the original scenario, reconsider the plan rather than defending a forecast. Judge your discipline by your process, not by one trade's profit or loss.",
      ],
      id: [
        "Prediksi menebak ke mana harga bergerak. Plan menjelaskan apa yang akan kamu lakukan dalam berbagai kondisi. Tidak ada analisis yang bisa menjamin hasil market.",
        "Plan yang berguna punya syarat entry, titik saat ide itu gugur, serta keputusan menunggu bila syarat belum lengkap. Stop-loss adalah bagian dari plan, bukan jaminan exit selalu tepat di harga itu.",
        "Saat informasi baru membantah skenario awal, evaluasi ulang plan, jangan memaksakan prediksi. Nilai disiplinmu dari proses, bukan profit atau loss satu trade.",
      ],
    },
  },
  {
    id: "validity-confidence",
    title: { en: "Validity and confidence", id: "Masa berlaku dan confidence" },
    paragraphs: {
      en: [
        "The validity window tells you when the analysis was made and how long its assumptions may remain useful. Once the window ends, review the market again before relying on the plan.",
        "Confidence describes uncertainty in a scenario, not a probability that a trade will profit. Even a high-confidence view can be invalidated by new market information.",
        "If price has moved away from the entry conditions or the market has changed, wait for a fresh assessment. Do not stretch an old scenario to fit a new market.",
      ],
      id: [
        "Masa berlaku menunjukkan kapan analisis dibuat dan sampai kapan asumsi di dalamnya mungkin masih relevan. Setelah lewat, cek ulang market sebelum mengandalkan plan.",
        "Confidence menggambarkan ketidakpastian skenario, bukan peluang pasti untuk profit. Bahkan analisis dengan confidence tinggi bisa gugur karena informasi market baru.",
        "Kalau harga menjauh dari syarat entry atau kondisi market berubah, tunggu penilaian baru. Jangan memaksakan skenario lama pada market yang sudah berbeda.",
      ],
    },
  },
] as const;