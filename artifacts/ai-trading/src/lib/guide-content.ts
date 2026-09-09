import { MINDSET_MODULES } from "./mindset-modules";
import { Brain, Shield, Book, Lightbulb, ChartCandlestick, type LucideIcon } from "lucide-react";

export type GuideBlock = 
  | { type: "p"; val: string }
  | { type: "h"; val: string }
  | { type: "list"; val: string[] }
  | { type: "callout"; val: string };

export type GuideArticle = {
  id: string;
  title_en: string;
  title_id: string;
  content_en: GuideBlock[];
  content_id: GuideBlock[];
  keywords: string[];
  relatedArticleId?: string;
};

export type GuideCategory = {
  id: string;
  icon: LucideIcon;
  title_en: string;
  title_id: string;
  articles: GuideArticle[];
};

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: "getting-started",
    icon: Lightbulb,
    title_en: "Getting Started & Features",
    title_id: "Panduan Awal & Fitur",
    articles: [
      {
        id: "how-ai-works",
        title_en: "How the AI Analysis Works",
        title_id: "Cara Kerja Analisis AI",
        content_en: [
          { type: "p", val: "TradePilot scans technical indicators (RSI, MACD, Bollinger Bands, moving averages) and combines them with real-time news and economic calendar data." },
          { type: "p", val: "The result is a structured trade plan — entry zone, stop-loss, and up to 3 take-profit levels — with a bias gauge and plain-English market summary." }
        ],
        content_id: [
          { type: "p", val: "TradePilot memindai indikator teknikal (RSI, MACD, Bollinger Bands, moving averages) dan menggabungkannya dengan berita terkini serta data kalender ekonomi." },
          { type: "p", val: "Hasilnya adalah trade plan terstruktur — zona entry, stop-loss, dan hingga 3 level take profit — beserta gauge bias dan ringkasan market." }
        ],
        keywords: ["AI analysis", "analisis AI", "data", "technical", "fundamental"]
      },
      {
        id: "feature-map",
        title_en: "What Each TradePilot.id Feature Does",
        title_id: "Fungsi Setiap Fitur TradePilot.id",
        content_en: [
          { type: "h", val: "Analyze" },
          { type: "p", val: "Creates a fresh market analysis for your chosen instrument and timeframe. Your optional context is treated as additional input, not as an instruction that overrides market data." },
          { type: "h", val: "History & Performance" },
          { type: "p", val: "Stores your past analyses and summarizes how completed plans performed by instrument and timeframe. Use it to review patterns, not to guarantee future results." },
          { type: "h", val: "Trade Journal" },
          { type: "p", val: "Records trades you actually took, including outcome, mood, and notes. This separates your execution from the AI plan itself." },
          { type: "h", val: "Trader Mirror" },
          { type: "p", val: "Turns your journal activity into personal behavior insights, helping you spot habits such as overtrading or inconsistent execution." },
          { type: "h", val: "Alerts and Daily Briefing" },
          { type: "p", val: "Alerts watch specific price levels. Daily Briefing summarizes selected market context and does not replace a fresh analysis." }
        ],
        content_id: [
          { type: "h", val: "Analisis" },
          { type: "p", val: "Membuat analisis market terbaru untuk instrumen dan timeframe yang kamu pilih. Konteks tambahan dari kamu dipakai sebagai input pendukung, bukan perintah yang mengalahkan data market." },
          { type: "h", val: "Riwayat & Performa" },
          { type: "p", val: "Menyimpan analisis sebelumnya dan merangkum performa plan yang sudah selesai berdasarkan instrumen dan timeframe. Gunakan untuk review pola, bukan sebagai jaminan hasil berikutnya." },
          { type: "h", val: "Jurnal Trading" },
          { type: "p", val: "Mencatat trade yang benar-benar kamu ambil, termasuk hasil, emosi, dan catatan. Ini memisahkan kualitas eksekusi kamu dari plan AI." },
          { type: "h", val: "Trader Mirror" },
          { type: "p", val: "Mengubah aktivitas jurnal menjadi insight perilaku pribadi agar kebiasaan seperti overtrading atau eksekusi yang tidak konsisten lebih mudah terlihat." },
          { type: "h", val: "Alert dan Ringkasan Harian" },
          { type: "p", val: "Alert memantau level harga tertentu. Ringkasan Harian merangkum konteks market terpilih dan tidak menggantikan analisis terbaru." }
        ],
        keywords: ["features", "fitur", "analyze", "analisis"]
      },
      {
        id: "history-performance",
        title_en: "Using History & Performance",
        title_id: "Menggunakan Riwayat & Performa",
        content_en: [
          { type: "h", val: "Summary and History tabs" },
          { type: "p", val: "Summary turns your completed analysis records into an overview by instrument and timeframe. History shows the original analysis cards so you can review the exact instrument, date, timeframe, and outcome behind the numbers." },
          { type: "h", val: "Search, filters, and presets" },
          { type: "p", val: "Use search for a remembered instrument, note, or phrase. Open Filters to combine instruments, timeframes, dates, and outcomes. Save a useful combination as a preset when you want to repeat the same review later." },
          { type: "h", val: "Instruments and Other Instruments" },
          { type: "p", val: "XAU/USD, BRENT, HSI, and NIKKEI are shown as the four primary choices. Other Instruments groups every other market for filtering and performance summaries, while each History card still displays its original name, such as EUR/USD." },
          { type: "h", val: "Reading outcomes and statistics" },
          { type: "list", val: [
            "TP1 Hit and TP2 Hit count as completed wins; SL Hit counts as a completed loss.",
            "Expired means the plan ended without TP or SL being recorded. Pending or still-valid analyses are not treated as wins.",
            "Win rate compares recorded TP outcomes with recorded TP plus SL outcomes. Completion rate also includes expired outcomes.",
            "Open an instrument card in Summary to compare its timeframes, or open its History to inspect the underlying records."
          ] },
          { type: "h", val: "Why minimum sample matters" },
          { type: "p", val: "Small samples can exaggerate a streak. When there are not enough completed records, the progress indicator shows how many more samples are needed before that breakdown is presented as meaningful." },
          { type: "callout", val: "Use performance as a review tool, not a prediction. A strong historical percentage does not guarantee the next analysis." }
        ],
        content_id: [
          { type: "h", val: "Tab Ringkasan dan Riwayat" },
          { type: "p", val: "Ringkasan mengubah catatan analisis yang selesai menjadi gambaran performa berdasarkan instrumen dan timeframe. Riwayat menampilkan kartu analisis asli agar kamu bisa mengecek instrumen, tanggal, timeframe, dan outcome di balik angkanya." },
          { type: "h", val: "Pencarian, filter, dan preset" },
          { type: "p", val: "Gunakan pencarian untuk menemukan instrumen, catatan, atau frasa yang kamu ingat. Buka Filter untuk menggabungkan instrumen, timeframe, tanggal, dan outcome. Simpan kombinasi yang berguna sebagai preset jika ingin mengulang review yang sama." },
          { type: "h", val: "Instrumen dan Instrumen Lainnya" },
          { type: "p", val: "XAU/USD, BRENT, HSI, dan NIKKEI ditampilkan sebagai empat pilihan utama. Instrumen Lainnya menggabungkan semua market lain untuk kebutuhan filter dan ringkasan performa, tetapi setiap kartu Riwayat tetap menampilkan nama aslinya, misalnya EUR/USD." },
          { type: "h", val: "Membaca outcome dan statistik" },
          { type: "list", val: [
            "TP1 Hit dan TP2 Hit dihitung sebagai win yang selesai; SL Hit dihitung sebagai loss yang selesai.",
            "Expired berarti masa plan berakhir tanpa TP atau SL yang tercatat. Analisis Pending atau masih valid tidak dianggap win.",
            "Win rate membandingkan outcome TP dengan total outcome TP plus SL. Completion rate juga memasukkan outcome expired.",
            "Buka kartu instrumen di Ringkasan untuk membandingkan timeframe, atau buka Riwayatnya untuk memeriksa catatan sumber."
          ] },
          { type: "h", val: "Kenapa minimum sample penting" },
          { type: "p", val: "Sample kecil bisa membuat streak terlihat berlebihan. Saat catatan yang selesai belum cukup, indikator progres menunjukkan berapa sample tambahan yang dibutuhkan sebelum breakdown dianggap lebih bermakna." },
          { type: "callout", val: "Gunakan performa untuk review, bukan prediksi. Persentase historis yang tinggi tidak menjamin analisis berikutnya." }
        ],
        keywords: ["history", "riwayat", "performance", "performa", "summary", "ringkasan", "search", "pencarian", "filter", "preset", "outcome", "minimum sample", "instrumen lainnya", "other instruments", "win rate", "completion rate"],
        relatedArticleId: "analysis-workflow"
      },
      {
        id: "reading-analysis",
        title_en: "Reading an Analysis Output",
        title_id: "Membaca Hasil Analisis",
        content_en: [
          { type: "h", val: "Signal Strength & Bias" },
          { type: "p", val: "The gauge shows the overall bias (Bullish, Bearish, or Neutral). It's a combination of technical counts and fundamental news." },
          { type: "h", val: "Entry Zone & SL/TP" },
          { type: "p", val: "The entry zone provides a recommended price range to open your position. Stop Loss (SL) is strictly placed to manage risk, and Take Profit (TP) levels give you scale-out targets." },
          { type: "callout", val: "Always confirm with your own chart and price action before blindly following the entry zone." }
        ],
        content_id: [
          { type: "h", val: "Kekuatan Sinyal & Bias" },
          { type: "p", val: "Gauge menunjukkan bias keseluruhan (Bullish, Bearish, atau Netral). Ini adalah kombinasi hitungan teknikal dan berita fundamental." },
          { type: "h", val: "Zona Entry & SL/TP" },
          { type: "p", val: "Zona entry memberikan rentang harga yang disarankan untuk membuka posisi. Stop Loss (SL) ditempatkan ketat untuk menjaga risiko, dan Take Profit (TP) memberi target bertahap." },
          { type: "callout", val: "Selalu konfirmasi dengan chart dan price action kamu sendiri sebelum masuk ke zona entry." }
        ],
        keywords: ["output", "hasil", "signal strength", "entry", "SL", "TP"]
      },
      {
        id: "validity-confidence",
        title_en: "Confidence, Validity, and Invalidation",
        title_id: "Confidence, Masa Berlaku, dan Invalidation",
        content_en: [
          { type: "h", val: "Confidence" },
          { type: "p", val: "Confidence indicates how strongly the available evidence supports the scenario. It is not the probability that a trade will win." },
          { type: "h", val: "Validity" },
          { type: "p", val: "Every analysis has a validity window tied to its timeframe. Once expired, analyze again instead of relying on old levels." },
          { type: "h", val: "Invalidation" },
          { type: "p", val: "Invalidation describes the market condition that cancels the scenario. If it occurs, the original reasoning no longer applies even if the validity timer remains." },
          { type: "callout", val: "A valid analysis can still lose. Valid means the scenario is still current, not certain." }
        ],
        content_id: [
          { type: "h", val: "Confidence" },
          { type: "p", val: "Confidence menunjukkan seberapa kuat bukti yang tersedia mendukung skenario. Angka ini bukan probabilitas pasti bahwa trade akan profit." },
          { type: "h", val: "Masa Berlaku" },
          { type: "p", val: "Setiap analisis memiliki masa berlaku sesuai timeframe. Setelah expired, lakukan analisis baru dan jangan mengandalkan level lama." },
          { type: "h", val: "Invalidation" },
          { type: "p", val: "Invalidation menjelaskan kondisi market yang membatalkan skenario. Jika terjadi, alasan awal tidak lagi berlaku walaupun timer analisis belum habis." },
          { type: "callout", val: "Analisis yang masih valid tetap bisa loss. Valid berarti skenarionya masih aktual, bukan pasti benar." }
        ],
        keywords: ["confidence", "validity", "valid", "expired", "invalidation"]
      },
      {
        id: "adaptive-plan",
        title_en: "Standard and Adaptive Position Plans",
        title_id: "Standard dan Adaptive Position Plan",
        content_en: [
          { type: "p", val: "The Standard Plan presents the analysis levels directly. The Adaptive Position Plan translates a supported analysis into account-aware position checkpoints and risk limits." },
          { type: "p", val: "Adaptive calculations currently apply only to XAU/USD, BRENT, HSI, and NIKKEI analyses. Other instruments still receive the regular analysis and Standard Plan." },
          { type: "list", val: [
            "Choose the account type and enter current available funds accurately.",
            "Treat every additional layer as a manual checkpoint, never an automatic instruction.",
            "Add only when the saved scenario is still aligned, no invalidation has occurred, and no new fundamental risk changes the setup.",
            "Price moving against the position by itself is not a reason to add."
          ] },
          { type: "callout", val: "Position plans are decision-support calculations, not execution commands or profit guarantees." }
        ],
        content_id: [
          { type: "p", val: "Standard Plan menampilkan level analisis secara langsung. Adaptive Position Plan menerjemahkan analisis yang didukung menjadi checkpoint posisi dan batas risiko sesuai kondisi akun." },
          { type: "p", val: "Kalkulasi Adaptive saat ini hanya berlaku untuk analisis XAU/USD, BRENT, HSI, dan NIKKEI. Instrumen lain tetap memperoleh analisis reguler dan Standard Plan." },
          { type: "list", val: [
            "Pilih jenis akun dan masukkan dana tersedia saat ini dengan akurat.",
            "Perlakukan setiap layer tambahan sebagai checkpoint manual, bukan instruksi otomatis.",
            "Tambah hanya jika skenario tersimpan masih searah, belum ada invalidation, dan tidak ada risiko fundamental baru yang mengubah setup.",
            "Harga bergerak melawan posisi saja bukan alasan untuk menambah posisi."
          ] },
          { type: "callout", val: "Position plan adalah kalkulasi pendukung keputusan, bukan perintah eksekusi atau jaminan profit." }
        ],
        keywords: ["standard plan", "adaptive position plan", "layer", "account", "akun"]
      },
      {
        id: "personal-progression",
        title_en: "Levels, Ranks, Mastery & Achievement Badges",
        title_id: "Level, Rank, Mastery & Achievement Badge",
        content_en: [
          { type: "h", val: "What personal progression measures" },
          { type: "p", val: "Progression is your private record of preparation, reflection, emotional control, and consistency. XP is not awarded for profit, account size, win rate, trade count, or the number of analyses you generate." },
          { type: "h", val: "How XP is earned" },
          { type: "p", val: "Verified activities can include a quality journal reflection, an analysis evaluation, a completed pre-analysis checklist, completing guide material, maintaining a discipline streak, and explicitly choosing to wait when a risk warning appears. Duplicate submissions do not repeatedly award XP, and eligible sources can have daily limits." },
          { type: "h", val: "Levels, ranks, and Mastery" },
          { type: "p", val: "XP advances levels 1–100 across ten evolving ranks. After level 100, continued discipline advances Mastery without creating a public competition." },
          { type: "h", val: "Badges, streaks, and history" },
          { type: "p", val: "Achievement badges mark specific discipline milestones. Current and longest streaks summarize consistent active days, while XP History shows the verified events behind your total. Progress is private: there is no leaderboard or public profile." },
          { type: "callout", val: "Progression rewards process, not trading outcomes. A higher level never promises better returns or removes market risk." }
        ],
        content_id: [
          { type: "h", val: "Apa yang diukur progression pribadi" },
          { type: "p", val: "Progression adalah catatan pribadi tentang persiapan, refleksi, kontrol emosi, dan konsistensi kamu. XP tidak diberikan dari profit, besar modal, win rate, jumlah trade, atau banyaknya analisis yang dibuat." },
          { type: "h", val: "Cara mendapatkan XP" },
          { type: "p", val: "Aktivitas terverifikasi dapat mencakup refleksi jurnal berkualitas, evaluasi analisis, checklist pra-analisis yang selesai, menuntaskan materi panduan, menjaga streak disiplin, dan memilih menunggu secara eksplisit saat peringatan risiko muncul. Pengiriman duplikat tidak memberi XP berulang, dan sumber tertentu dapat memiliki batas harian." },
          { type: "h", val: "Level, rank, dan Mastery" },
          { type: "p", val: "XP menaikkan level 1–100 melalui sepuluh rank yang terus berevolusi. Setelah level 100, disiplin berikutnya menaikkan Mastery tanpa menjadikannya kompetisi publik." },
          { type: "h", val: "Badge, streak, dan riwayat" },
          { type: "p", val: "Achievement badge menandai milestone disiplin tertentu. Streak aktif dan streak terpanjang merangkum konsistensi hari aktif, sedangkan Riwayat XP menunjukkan event terverifikasi yang membentuk total XP. Progres ini bersifat pribadi: tidak ada leaderboard atau profil publik." },
          { type: "callout", val: "Progression menghargai proses, bukan hasil trading. Level tinggi tidak menjanjikan return lebih baik dan tidak menghilangkan risiko market." }
        ],
        keywords: ["progression", "XP", "level", "rank", "Mastery", "achievement", "badge", "streak", "riwayat XP", "XP history", "daily limit", "batas harian", "private", "pribadi", "leaderboard"]
      }
    ]
  },
  {
    id: "analysis-manual",
    icon: ChartCandlestick,
    title_en: "Analysis Manual",
    title_id: "Manual Analisis",
    articles: [
      {
        id: "analysis-workflow",
        title_en: "From Instrument Selection to a Usable Analysis",
        title_id: "Dari Memilih Instrumen sampai Memakai Hasil",
        keywords: ["instrument", "instrumen", "timeframe", "context", "konteks", "analyze", "analisis", "loading", "quota"],
        content_en: [
          { type: "h", val: "Meaning and purpose" },
          { type: "p", val: "An analysis is a time-bound market scenario for one instrument and timeframe. It organizes available technical data, market structure, news, and scheduled economic events into a decision-support result." },
          { type: "h", val: "How the result is obtained" },
          { type: "p", val: "Choose the instrument and timeframe. Optional chart or news context adds your observation; it does not override market evidence. TradePilot checks the available categories of data, synthesizes agreements and conflicts, then returns a bias, confidence range, reasoning, risks, and a plan when the evidence supports one." },
          { type: "h", val: "How to use it" },
          { type: "list", val: ["Confirm the instrument and quoted price are the ones you intend to trade.", "Match the timeframe to your holding horizon; a 15m view and D1 view answer different questions.", "Read the reasoning and invalidation before looking at entry levels.", "Re-analyze when the validity period expires or the market context materially changes."] },
          { type: "h", val: "Simple example" },
          { type: "p", val: "If you choose XAU/USD and D1, the result describes a daily scenario. It is not a promise about every intraday move." },
          { type: "h", val: "Limits and common mistakes" },
          { type: "p", val: "Data availability and freshness vary by source and instrument. Do not assume every item is real-time, mix levels from different analyses, or treat loading messages as proof that a particular factor produced the final result." },
          { type: "callout", val: "TradePilot supports your decision; it does not execute trades or guarantee profit." },
        ],
        content_id: [
          { type: "h", val: "Arti dan tujuan" },
          { type: "p", val: "Analisis adalah skenario market berbatas waktu untuk satu instrumen dan timeframe. Fitur ini merapikan data teknikal yang tersedia, struktur market, berita, dan agenda ekonomi menjadi hasil pendukung keputusan." },
          { type: "h", val: "Bagaimana hasil didapat" },
          { type: "p", val: "Pilih instrumen dan timeframe. Konteks chart atau berita yang kamu tulis menjadi observasi tambahan, bukan pengganti bukti market. TradePilot memeriksa kategori data yang tersedia, menyatukan bagian yang searah maupun bertentangan, lalu menyajikan bias, rentang confidence, alasan, risiko, dan plan saat buktinya memadai." },
          { type: "h", val: "Cara memakai" },
          { type: "list", val: ["Pastikan instrumen dan harga acuannya memang yang ingin kamu trade.", "Sesuaikan timeframe dengan durasi posisi; pembacaan 15m dan D1 menjawab pertanyaan yang berbeda.", "Baca alasan dan invalidation sebelum melihat level entry.", "Analisis ulang saat masa berlaku habis atau konteks market berubah signifikan."] },
          { type: "h", val: "Contoh sederhana" },
          { type: "p", val: "Jika kamu memilih XAU/USD dan D1, hasilnya menjelaskan skenario harian. Hasil itu bukan janji untuk setiap pergerakan intraday." },
          { type: "h", val: "Batasan dan kesalahan umum" },
          { type: "p", val: "Ketersediaan dan kesegaran data berbeda menurut sumber dan instrumen. Jangan menganggap semua data selalu real-time, mencampur level dari analisis berbeda, atau mengira teks loading membuktikan faktor tertentu pasti menentukan hasil akhir." },
          { type: "callout", val: "TradePilot mendukung keputusanmu; bukan eksekutor trade dan bukan jaminan profit." },
        ],
      },
      {
        id: "bias-confidence-validity",
        title_en: "Bias, Signal Strength, Confidence, Validity & Invalidation",
        title_id: "Bias, Signal Strength, Confidence, Validity & Invalidation",
        keywords: ["bias", "bias arah", "bias direction", "gauge", "needle", "jarum", "bullish", "bearish", "neutral", "netral", "signal strength", "kekuatan sinyal", "confidence", "validity", "masa berlaku", "expired", "invalidation", "invalid"],
        content_en: [
          { type: "h", val: "Meaning" },
          { type: "p", val: "Bias is the direction currently favored by the combined evidence. Signal strength summarizes how clearly directional factors lean. Confidence shows how strongly the available evidence supports the stated scenario. Validity is the time window in which the snapshot remains intended for use. Invalidation is a market condition that cancels the scenario." },
          { type: "h", val: "How to read them together" },
          { type: "p", val: "On the Bias Direction half-gauge, the left side represents stronger bearish evidence, the center represents neutral or wait, and the right side represents stronger bullish evidence. The needle shows the current lean. Always use the written label as the precise reference rather than relying on color alone." },
          { type: "p", val: "Strong Bullish can coexist with a moderate confidence range when direction agrees but data quality, event risk, or conflicting evidence reduces certainty. Neutral means there is no sufficiently clear directional edge; it does not mean price will stay still." },
          { type: "h", val: "How results are obtained" },
          { type: "p", val: "TradePilot synthesizes available technical and fundamental evidence for the selected timeframe. Confidence reflects the quality, consistency, and conflicts in that evidence—not a historical win probability." },
          { type: "h", val: "Example and action" },
          { type: "p", val: "A Bullish analysis valid for several hours may still be cancelled immediately if its invalidation condition occurs. Stop using the original setup even when its timer has not expired." },
          { type: "h", val: "Common mistakes" },
          { type: "list", val: ["Reading 80% confidence as an 80% chance of profit.", "Treating valid as guaranteed correct.", "Ignoring invalidation because price later returns.", "Trading a Neutral result as a weak Buy or Sell."] },
          { type: "callout", val: "Confidence is evidence strength, not certainty or guaranteed win probability." },
        ],
        content_id: [
          { type: "h", val: "Arti" },
          { type: "p", val: "Bias adalah arah yang saat ini lebih didukung bukti gabungan. Signal strength merangkum seberapa jelas faktor arah condong. Confidence menunjukkan seberapa kuat bukti yang tersedia mendukung skenario. Validity adalah jendela waktu penggunaan snapshot. Invalidation adalah kondisi market yang membatalkan skenario." },
          { type: "h", val: "Cara membacanya bersama" },
          { type: "p", val: "Pada gauge setengah lingkaran Bias Arah, sisi kiri menunjukkan bukti bearish yang makin kuat, bagian tengah berarti netral atau tunggu, dan sisi kanan menunjukkan bukti bullish yang makin kuat. Jarum menunjukkan kecenderungan saat ini. Tetap jadikan label teks sebagai acuan yang presisi, bukan warna saja." },
          { type: "p", val: "Bullish Kuat bisa muncul bersama rentang confidence sedang ketika arahnya sejalan, tetapi kualitas data, risiko event, atau bukti yang bertentangan mengurangi keyakinan. Netral berarti belum ada keunggulan arah yang cukup jelas; bukan berarti harga akan diam." },
          { type: "h", val: "Bagaimana hasil didapat" },
          { type: "p", val: "TradePilot menyintesis bukti teknikal dan fundamental yang tersedia untuk timeframe pilihan. Confidence mencerminkan kualitas, konsistensi, dan konflik bukti tersebut—bukan statistik peluang menang." },
          { type: "h", val: "Contoh dan tindakan" },
          { type: "p", val: "Analisis Bullish yang masih berlaku beberapa jam dapat langsung batal ketika kondisi invalidation terjadi. Hentikan penggunaan setup awal walaupun timer belum habis." },
          { type: "h", val: "Kesalahan umum" },
          { type: "list", val: ["Membaca confidence 80% sebagai peluang profit 80%.", "Menganggap status valid berarti pasti benar.", "Mengabaikan invalidation karena harga kemudian kembali.", "Memaksa hasil Netral menjadi Buy atau Sell lemah."] },
          { type: "callout", val: "Confidence adalah kekuatan bukti, bukan kepastian atau peluang menang yang dijamin." },
        ],
      },
      {
        id: "levels-chart",
        title_en: "Entry, Stop Loss, Take Profit, R:R, Support, Resistance & Chart",
        title_id: "Entry, Stop Loss, Take Profit, R:R, Support, Resistance & Chart",
        keywords: ["entry", "entry zone", "zona entry", "SL", "stop loss", "TP", "take profit", "TP1", "TP2", "risk reward", "R:R", "RR", "support", "resistance", "chart", "candlestick", "BUY", "SELL", "both", "keduanya", "running price", "zoom", "reset", "B-SL", "S-SL"],
        content_en: [
          { type: "h", val: "Meaning and purpose" },
          { type: "p", val: "The entry zone is an area for considering execution, not a mandatory exact price. Stop Loss (SL) limits the setup's planned downside. Take Profit (TP1/TP2) marks staged objectives. Risk:Reward (R:R) compares planned risk with potential reward. Support and resistance are reaction areas, not guaranteed turning points." },
          { type: "h", val: "How levels are obtained" },
          { type: "p", val: "Levels are derived from the selected side, timeframe, available market structure, volatility, and scenario logic. They belong together as one plan; moving only the SL or entry changes the original R:R." },
          { type: "h", val: "Reading the chart" },
          { type: "p", val: "Use BUY, SELL, or Both to show only the scenario you need. BUY entry is cyan and all BUY levels are solid. SELL entry is amber and all SELL levels are dashed. SL stays red, TP stays green, and the dotted gold line is the running price." },
          { type: "p", val: "In Both mode, B-SL/B-TP labels belong to BUY and S-SL/S-TP labels belong to SELL. The latest candle has intentional space on its right so price labels remain readable. Use minus, RESET, and plus to change candle spacing; RESET restores the default view." },
          { type: "h", val: "Example" },
          { type: "p", val: "For a Buy plan, entry 100, SL 98, and TP 104 risks 2 units for 4 units of potential reward, or roughly 1:2 before fees and slippage." },
          { type: "h", val: "Limits and mistakes" },
          { type: "list", val: ["Entering after price has already run far beyond the zone.", "Widening SL to avoid a loss without recalculating risk.", "Assuming a displayed line guarantees an order fill.", "Ignoring spread, fees, slippage, gaps, and broker rules."] },
        ],
        content_id: [
          { type: "h", val: "Arti dan tujuan" },
          { type: "p", val: "Zona entry adalah area untuk mempertimbangkan eksekusi, bukan harga wajib yang presisi. Stop Loss (SL) membatasi risiko rencana. Take Profit (TP1/TP2) adalah target bertahap. Risk:Reward (R:R) membandingkan risiko rencana dengan potensi reward. Support dan resistance adalah area reaksi, bukan titik balik yang dijamin." },
          { type: "h", val: "Bagaimana level didapat" },
          { type: "p", val: "Level disusun dari sisi pilihan, timeframe, struktur market yang tersedia, volatilitas, dan logika skenario. Semua level adalah satu paket plan; menggeser SL atau entry saja akan mengubah R:R awal." },
          { type: "h", val: "Membaca chart" },
          { type: "p", val: "Gunakan BUY, SELL, atau Keduanya untuk menampilkan skenario yang dibutuhkan. Entry BUY berwarna cyan dan seluruh level BUY memakai garis solid. Entry SELL berwarna amber dan seluruh level SELL memakai garis putus-putus. SL tetap merah, TP tetap hijau, sedangkan garis gold bertitik adalah running price." },
          { type: "p", val: "Dalam mode Keduanya, label B-SL/B-TP adalah milik BUY dan S-SL/S-TP adalah milik SELL. Di kanan candle terakhir sengaja tersedia ruang agar label harga mudah dibaca. Gunakan minus, RESET, dan plus untuk mengubah jarak candle; RESET mengembalikan tampilan awal." },
          { type: "h", val: "Contoh" },
          { type: "p", val: "Pada plan Buy dengan entry 100, SL 98, dan TP 104, risikonya 2 unit untuk potensi reward 4 unit, kira-kira 1:2 sebelum fee dan slippage." },
          { type: "h", val: "Batasan dan kesalahan" },
          { type: "list", val: ["Entry setelah harga sudah jauh meninggalkan zona.", "Melebarkan SL supaya tidak loss tanpa menghitung ulang risiko.", "Menganggap garis di chart menjamin order terisi.", "Mengabaikan spread, fee, slippage, gap, dan aturan broker."] },
        ],
      },
      {
        id: "timeframe-risk-map",
        title_en: "Comparing Risk Across Timeframes",
        title_id: "Membandingkan Risiko Antar-Timeframe",
        keywords: ["timeframe risk map", "risk map", "Peta Risiko Timeframe", "Bandingkan Risiko", "relative risk", "risiko relatif", "Gunakan dan Analisis", "XAU/USD", "BRENT", "HSI", "NIKKEI"],
        content_en: [
          { type: "h", val: "Meaning and location" },
          { type: "p", val: "On an Analysis Detail page, open Compare Risk beside the timeframe choices to compare the same instrument across available timeframes. The feature currently supports the official XAU/USD, BRENT, HSI, and NIKKEI instruments." },
          { type: "h", val: "How to read the map" },
          { type: "p", val: "The map compares relative technical risk between the scanned timeframes. Lower relative risk means the available conditions look more orderly compared with the other options; it does not mean safe, guaranteed, or suitable for every trader." },
          { type: "h", val: "Using a timeframe" },
          { type: "p", val: "Choose Use & Analyze {timeframe} to switch and request a fresh analysis for that timeframe. The comparison itself does not silently replace the active analysis." },
          { type: "h", val: "Insufficient or mixed data" },
          { type: "p", val: "A timeframe with insufficient data is not treated as low risk. When no option is clearly actionable, compare the visible factors and match the timeframe to your intended holding horizon instead of forcing a recommendation." },
          { type: "callout", val: "Relative risk is a comparison among available snapshots—not a prediction of loss, a guarantee of profit, or permission to ignore invalidation." }
        ],
        content_id: [
          { type: "h", val: "Arti dan lokasi" },
          { type: "p", val: "Di halaman Detail Analisis, buka Bandingkan Risiko yang berada di samping pilihan timeframe untuk membandingkan instrumen yang sama pada beberapa timeframe. Fitur ini saat ini tersedia untuk instrumen resmi XAU/USD, BRENT, HSI, dan NIKKEI." },
          { type: "h", val: "Cara membaca peta" },
          { type: "p", val: "Peta membandingkan risiko teknikal relatif antar-timeframe yang dipindai. Risiko relatif lebih rendah berarti kondisi yang tersedia tampak lebih tertata dibanding pilihan lain; bukan berarti aman, pasti, atau cocok untuk setiap trader." },
          { type: "h", val: "Menggunakan timeframe" },
          { type: "p", val: "Pilih Gunakan & Analisis {timeframe} untuk berpindah dan meminta analisis baru pada timeframe tersebut. Membuka perbandingan saja tidak diam-diam mengganti analisis aktif." },
          { type: "h", val: "Data tidak cukup atau hasil campuran" },
          { type: "p", val: "Timeframe dengan data tidak cukup tidak dianggap berisiko rendah. Saat tidak ada opsi yang jelas actionable, bandingkan faktor yang terlihat dan sesuaikan timeframe dengan durasi posisi kamu—jangan memaksa rekomendasi." },
          { type: "callout", val: "Risiko relatif adalah perbandingan antar-snapshot yang tersedia—bukan prediksi kerugian, jaminan profit, atau izin mengabaikan invalidation." }
        ]
      },
      {
        id: "technical-fundamental",
        title_en: "Technical and Fundamental Context",
        title_id: "Konteks Teknikal dan Fundamental",
        keywords: ["technical", "teknikal", "indicator", "indikator", "indicator value", "nilai indikator", "oscillator", "moving average", "RSI", "MACD", "Bollinger", "Beli", "Jual", "Netral", "fundamental", "news", "berita", "calendar", "kalender ekonomi", "citation", "source", "refresh"],
        content_en: [
          { type: "h", val: "Meaning and purpose" },
          { type: "p", val: "Technical context describes price, trend, momentum, volatility, and indicator readings. Fundamental context adds relevant news and scheduled economic events that may affect direction, volatility, or execution risk." },
          { type: "h", val: "How synthesis works" },
          { type: "p", val: "No single indicator or headline automatically decides the result. TradePilot looks for alignment and conflict across available categories, then explains which scenario is better supported. Citations connect narrative claims to the saved news and calendar snapshot." },
          { type: "h", val: "How to read and use it" },
          { type: "list", val: ["On each technical card, the number is the indicator's reading; the bar and Buy/Sell/Neutral label summarize its directional interpretation.", "Never treat one RSI, MACD, Bollinger, or moving-average card as the final bias—the result synthesizes alignment and conflict across available evidence.", "Compare the combined technical lean with the stated bias.", "Open cited sources and distinguish reported facts from market interpretation.", "Treat high-impact calendar events as volatility risk, especially near release time.", "Use Refresh Fundamentals to inspect newer context; refreshing does not rerun or rewrite the original AI analysis."] },
          { type: "h", val: "Example" },
          { type: "p", val: "Bullish momentum with a high-impact central-bank decision ahead may support the direction while still lowering confidence or making waiting preferable." },
          { type: "h", val: "Limits" },
          { type: "p", val: "Sources update on different schedules and can be delayed, revised, incomplete, or unavailable. An empty card means no qualifying saved items were available; it does not prove that no relevant event exists." },
        ],
        content_id: [
          { type: "h", val: "Arti dan tujuan" },
          { type: "p", val: "Konteks teknikal menjelaskan harga, tren, momentum, volatilitas, dan pembacaan indikator. Konteks fundamental menambahkan berita serta agenda ekonomi relevan yang dapat memengaruhi arah, volatilitas, atau risiko eksekusi." },
          { type: "h", val: "Cara sintesis bekerja" },
          { type: "p", val: "Tidak ada satu indikator atau headline yang otomatis menentukan hasil. TradePilot mencari keselarasan dan konflik antar-kategori yang tersedia, lalu menjelaskan skenario mana yang lebih didukung. Sitasi menghubungkan narasi dengan snapshot berita dan kalender yang tersimpan." },
          { type: "h", val: "Cara membaca dan memakai" },
          { type: "list", val: ["Pada setiap kartu teknikal, angka adalah nilai pembacaan indikator; bar dan label Beli/Jual/Netral merangkum interpretasi arahnya.", "Jangan jadikan satu kartu RSI, MACD, Bollinger, atau moving average sebagai bias akhir—hasil utama menyintesis keselarasan dan konflik seluruh bukti yang tersedia.", "Bandingkan kecenderungan teknikal gabungan dengan bias akhir.", "Buka sumber sitasi dan bedakan fakta laporan dari interpretasi market.", "Perlakukan event berdampak tinggi sebagai risiko volatilitas, terutama mendekati waktu rilis.", "Gunakan Refresh Fundamental untuk melihat konteks yang lebih baru; refresh tidak menjalankan ulang atau menulis ulang analisis AI awal."] },
          { type: "h", val: "Contoh" },
          { type: "p", val: "Momentum bullish menjelang keputusan bank sentral dapat mendukung arah, tetapi sekaligus menurunkan confidence atau membuat opsi menunggu lebih masuk akal." },
          { type: "h", val: "Batasan" },
          { type: "p", val: "Setiap sumber punya jadwal pembaruan berbeda dan bisa terlambat, direvisi, tidak lengkap, atau tidak tersedia. Kartu kosong berarti tidak ada item tersimpan yang memenuhi syarat; bukan bukti bahwa tidak ada event relevan." },
        ],
      },
      {
        id: "standard-plan",
        title_en: "Using the Standard Plan",
        title_id: "Menggunakan Standard Plan",
        keywords: ["standard plan", "trade plan", "preferred side", "buy", "sell", "wait", "rationale", "entry", "SL", "TP", "R:R"],
        content_en: [
          { type: "h", val: "Meaning and purpose" },
          { type: "p", val: "The Standard Plan presents Buy and Sell scenarios with a preferred side—Buy, Sell, or Wait. It keeps entry, SL, TP, R:R, and rationale together so you can judge the whole setup." },
          { type: "h", val: "How it is obtained" },
          { type: "p", val: "The preferred side follows the analysis synthesis and validity checks. Wait means current evidence does not support immediate execution; pending levels are intentionally unavailable rather than invented." },
          { type: "h", val: "How to use it" },
          { type: "list", val: ["Start with the preferred side and rationale.", "Confirm entry has not been missed and invalidation has not occurred.", "Size the position from your own risk limit and actual broker contract terms.", "Use the opposite scenario as context, not permission to hold both directions without a plan."] },
          { type: "h", val: "Example and mistakes" },
          { type: "p", val: "If the preferred side is Wait, do not turn the nearest Buy level into an instruction. A common mistake is copying the levels while ignoring rationale, validity, spread, or account risk." },
        ],
        content_id: [
          { type: "h", val: "Arti dan tujuan" },
          { type: "p", val: "Standard Plan menampilkan skenario Buy dan Sell dengan sisi pilihan—Buy, Sell, atau Tunggu. Entry, SL, TP, R:R, dan alasan dijaga sebagai satu paket agar kamu menilai setup secara utuh." },
          { type: "h", val: "Bagaimana plan didapat" },
          { type: "p", val: "Sisi pilihan mengikuti sintesis analisis dan pemeriksaan validitas. Tunggu berarti bukti saat ini belum mendukung eksekusi segera; level pending sengaja tidak diada-adakan." },
          { type: "h", val: "Cara memakai" },
          { type: "list", val: ["Mulai dari sisi pilihan dan alasannya.", "Pastikan entry belum terlewat dan invalidation belum terjadi.", "Tentukan ukuran posisi dari batas risiko pribadi dan aturan kontrak broker yang benar-benar kamu pakai.", "Gunakan skenario lawan sebagai konteks, bukan izin menahan dua arah tanpa plan."] },
          { type: "h", val: "Contoh dan kesalahan" },
          { type: "p", val: "Jika sisi pilihan adalah Tunggu, jangan mengubah level Buy terdekat menjadi instruksi. Kesalahan umum adalah menyalin level sambil mengabaikan alasan, validity, spread, atau risiko akun." },
        ],
      },
      {
        id: "adaptive-position-plan",
        title_en: "Using the Adaptive Position Plan",
        title_id: "Menggunakan Adaptive Position Plan",
        keywords: ["adaptive", "adaptive position plan", "position size", "lot", "layer", "scaling", "risk style", "funds", "available funds", "dana tersedia", "account tier"],
        content_en: [
          { type: "h", val: "Meaning and purpose" },
          { type: "p", val: "The Adaptive Position Plan converts a supported analysis into account-aware position checkpoints. It helps constrain lots and staged additions; it does not change the underlying analysis or place orders." },
          { type: "h", val: "Inputs and origin" },
          { type: "p", val: "Select the actual account type, current available trading funds, and risk style. The plan combines those inputs with the saved analysis direction, confidence, levels, invalidation, instrument movement rules, and supported account constraints." },
          { type: "h", val: "How to read it" },
          { type: "list", val: ["Eligible means a checkpoint passed the displayed safeguards, not that execution is required.", "Each layer is a fresh manual decision.", "Add only while the saved scenario remains complete, directionally aligned, and not invalidated.", "Rejected, capped, or unavailable output is a risk control—not an error to work around."] },
          { type: "h", val: "Example" },
          { type: "p", val: "If price reaches a later layer but confidence has weakened or new fundamental risk contradicts the setup, skip the addition even though the price checkpoint was reached." },
          { type: "h", val: "Limits and mistakes" },
          { type: "p", val: "Supported instruments and account rules can vary. Do not enter total wealth instead of available trading funds, select an account type based on deposit size, or average down only because price moved against you." },
          { type: "callout", val: "A staged plan is not martingale and never guarantees recovery or profit." },
        ],
        content_id: [
          { type: "h", val: "Arti dan tujuan" },
          { type: "p", val: "Adaptive Position Plan menerjemahkan analisis yang didukung menjadi checkpoint posisi sesuai kondisi akun. Fitur ini membantu membatasi lot dan penambahan bertahap; tidak mengubah analisis dasar dan tidak memasang order." },
          { type: "h", val: "Input dan asal hasil" },
          { type: "p", val: "Pilih jenis akun yang sebenarnya, dana trading yang tersedia saat ini, dan gaya risiko. Plan menggabungkan input itu dengan arah analisis tersimpan, confidence, level, invalidation, aturan pergerakan instrumen, dan batas akun yang didukung." },
          { type: "h", val: "Cara membaca" },
          { type: "list", val: ["Eligible berarti checkpoint lolos safeguard yang ditampilkan, bukan wajib dieksekusi.", "Setiap layer adalah keputusan manual baru.", "Tambah posisi hanya selama skenario tersimpan tetap lengkap, searah, dan belum invalid.", "Hasil rejected, capped, atau unavailable adalah kontrol risiko—bukan error yang perlu diakali."] },
          { type: "h", val: "Contoh" },
          { type: "p", val: "Jika harga mencapai layer berikutnya tetapi confidence melemah atau risiko fundamental baru berlawanan dengan setup, lewati penambahan walaupun checkpoint harga sudah tercapai." },
          { type: "h", val: "Batasan dan kesalahan" },
          { type: "p", val: "Instrumen dan aturan akun yang didukung dapat berbeda. Jangan memasukkan total kekayaan sebagai dana trading tersedia, memilih jenis akun berdasarkan besar deposit, atau averaging down hanya karena harga bergerak melawan posisi." },
          { type: "callout", val: "Plan bertahap bukan martingale dan tidak pernah menjamin recovery atau profit." },
        ],
      },
      {
        id: "account-rules",
        title_en: "Reading Account and Standard Trading Rules",
        title_id: "Membaca Aturan Akun dan Standard Trading Rules",
        keywords: ["account", "akun", "contract size", "fixed rate", "margin", "margin call", "liquidation", "fee", "VAT", "rollover", "spread", "hectic", "minimum movement", "limit stop", "settlement", "deposit", "lot"],
        content_en: [
          { type: "h", val: "Meaning and purpose" },
          { type: "p", val: "The rules card summarizes displayed product constraints: contract size, fixed conversion rate, trading session, margin, fees, rollover, spread, minimum movement, order-distance limits, price source, settlement, lot range, and minimum deposit." },
          { type: "h", val: "How to read it" },
          { type: "list", val: ["Contract size and minimum movement determine how price movement maps to position value.", "Initial and maintenance margin describe collateral requirements; margin call and liquidation thresholds are account controls, not suggested stop losses.", "Spread, facility fees, tax, and rollover can reduce the result shown by a simple price-only calculation.", "Version, effective date, and source identify which displayed rule set was used."] },
          { type: "h", val: "Example" },
          { type: "p", val: "Two trades with identical entry and exit prices can have different net outcomes when lot size, spread, facility fees, tax, or overnight rollover differ." },
          { type: "h", val: "Limits and mistakes" },
          { type: "p", val: "Displayed rules are a reference for the named product and version, not a universal broker rule. Confirm current contractual terms before execution. Minimum deposit is an eligibility rule; it is not recommended risk capital or free margin." },
        ],
        content_id: [
          { type: "h", val: "Arti dan tujuan" },
          { type: "p", val: "Kartu aturan merangkum batas produk yang ditampilkan: ukuran kontrak, kurs konversi tetap, sesi trading, margin, fee, rollover, spread, pergerakan minimum, jarak order, sumber harga, settlement, rentang lot, dan deposit minimum." },
          { type: "h", val: "Cara membaca" },
          { type: "list", val: ["Ukuran kontrak dan pergerakan minimum menentukan hubungan gerak harga dengan nilai posisi.", "Margin awal dan maintenance menjelaskan kebutuhan jaminan; margin call dan batas likuidasi adalah kontrol akun, bukan saran stop loss.", "Spread, facility fee, pajak, dan rollover dapat mengurangi hasil dari kalkulasi harga sederhana.", "Versi, tanggal efektif, dan sumber menunjukkan kumpulan aturan yang sedang ditampilkan."] },
          { type: "h", val: "Contoh" },
          { type: "p", val: "Dua trade dengan entry dan exit sama bisa menghasilkan nilai bersih berbeda ketika lot, spread, facility fee, pajak, atau rollover malamnya berbeda." },
          { type: "h", val: "Batasan dan kesalahan" },
          { type: "p", val: "Aturan yang ditampilkan adalah referensi untuk produk dan versi tersebut, bukan aturan universal semua broker. Konfirmasi ketentuan kontrak terbaru sebelum eksekusi. Deposit minimum adalah syarat akun; bukan rekomendasi modal risiko atau free margin." },
        ],
      },
    ],
  },
  {
    id: "glossary",
    icon: Book,
    title_en: "Glossary",
    title_id: "Glosarium",
    articles: [
      {
        id: "terms",
        title_en: "Common Trading Terms",
        title_id: "Istilah Trading Umum",
        content_en: [
          { type: "h", val: "Bullish / Bearish" },
          { type: "p", val: "Bullish means expecting prices to go up. Bearish means expecting prices to go down." },
          { type: "h", val: "Stop Loss (SL)" },
          { type: "p", val: "An order placed to close a losing position to prevent further losses." },
          { type: "h", val: "Take Profit (TP)" },
          { type: "p", val: "An order to close a profitable position once it reaches a specific target." },
          { type: "h", val: "Risk/Reward Ratio (RR)" },
          { type: "p", val: "The ratio between the potential loss (risk) and potential gain (reward) of a trade." },
          { type: "h", val: "Timeframe" },
          { type: "p", val: "The candle interval used to read the market. Shorter timeframes change faster and contain more noise; longer timeframes describe broader structure." },
          { type: "h", val: "Support / Resistance" },
          { type: "p", val: "Price areas where buying or selling pressure has repeatedly appeared. They are zones, not guaranteed reversal points." },
          { type: "h", val: "Fundamental Context" },
          { type: "p", val: "News, policy, and economic-event context that may change volatility or market direction beyond the chart alone." },
          { type: "h", val: "Bullish / Bearish / Neutral Bias" },
           { type: "p", val: "The direction favored by current evidence. Neutral means the evidence is mixed or not strong enough to favor either side." },
           { type: "h", val: "Signal Strength / Confidence" },
           { type: "p", val: "Signal strength summarizes directional clarity. Confidence summarizes support from the available evidence; neither is a guaranteed win probability." },
           { type: "h", val: "Validity / Invalidation / Expired" },
           { type: "p", val: "Validity is the intended use window. Invalidation is a condition that cancels the scenario. Expired means its time window has ended." },
           { type: "h", val: "Standard Plan / Preferred Side / Wait" },
           { type: "p", val: "The Standard Plan groups both directional scenarios. Preferred Side is the better-supported one; Wait means immediate execution is not supported." },
           { type: "h", val: "Adaptive Position Plan / Layer" },
           { type: "p", val: "An account-aware calculation with manual staged checkpoints. A layer is a possible addition that must be reassessed, not an automatic order." },
           { type: "h", val: "Margin / Margin Call / Liquidation" },
           { type: "p", val: "Margin is collateral for an open position. Margin call and liquidation thresholds are account controls defined by the displayed rules." },
           { type: "h", val: "Spread / Fee / Rollover / Slippage" },
            { type: "p", val: "Trading costs and execution effects that can make the realized outcome differ from a simple entry-to-exit price calculation." },
            { type: "h", val: "Timeframe Risk Map / Relative Risk" },
            { type: "p", val: "A comparison of technical risk among available timeframe snapshots. Relative risk only ranks the compared options; lower does not mean risk-free." },
            { type: "h", val: "BUY / SELL / Both" },
            { type: "p", val: "Chart visibility controls for the BUY scenario, SELL scenario, or both scenarios together. They do not place an order or change the analysis." },
            { type: "h", val: "Running Price" },
            { type: "p", val: "The latest available reference price shown on the chart. It can move after the saved analysis levels were created." },
            { type: "h", val: "XP / Level / Rank / Mastery" },
            { type: "p", val: "XP records verified discipline activity. XP advances Levels 1–100 and their Ranks; after level 100, continued progress is recorded as Mastery." },
            { type: "h", val: "Achievement Badge / Streak / XP History" },
            { type: "p", val: "A badge marks a discipline milestone, a streak counts consistent active days, and XP History lists verified XP events. All are private and are not measures of profit or trading skill." }
        ],
        content_id: [
          { type: "h", val: "Bullish / Bearish" },
          { type: "p", val: "Bullish berarti perkiraan harga akan naik. Bearish berarti perkiraan harga akan turun." },
          { type: "h", val: "Stop Loss (SL)" },
          { type: "p", val: "Order untuk menutup posisi yang rugi demi mencegah kerugian lebih lanjut." },
          { type: "h", val: "Take Profit (TP)" },
          { type: "p", val: "Order untuk menutup posisi untung setelah mencapai target tertentu." },
          { type: "h", val: "Risk/Reward Ratio (RR)" },
          { type: "p", val: "Rasio antara potensi kerugian (risiko) dan potensi keuntungan (reward) dari sebuah trade." },
          { type: "h", val: "Timeframe" },
          { type: "p", val: "Interval candle yang dipakai untuk membaca market. Timeframe pendek berubah lebih cepat dan lebih banyak noise; timeframe panjang menggambarkan struktur yang lebih luas." },
          { type: "h", val: "Support / Resistance" },
          { type: "p", val: "Area harga tempat tekanan beli atau jual berulang kali muncul. Ini merupakan zona, bukan titik pembalikan yang dijamin." },
          { type: "h", val: "Konteks Fundamental" },
          { type: "p", val: "Konteks berita, kebijakan, dan agenda ekonomi yang dapat mengubah volatilitas atau arah market di luar pembacaan chart." },
          { type: "h", val: "Bias Bullish / Bearish / Netral" },
           { type: "p", val: "Arah yang lebih didukung bukti saat ini. Netral berarti buktinya campuran atau belum cukup kuat untuk memilih salah satu sisi." },
           { type: "h", val: "Signal Strength / Confidence" },
           { type: "p", val: "Signal strength merangkum kejelasan arah. Confidence merangkum dukungan bukti yang tersedia; keduanya bukan peluang menang yang dijamin." },
           { type: "h", val: "Validity / Invalidation / Expired" },
           { type: "p", val: "Validity adalah jendela penggunaan. Invalidation adalah kondisi pembatal skenario. Expired berarti jendela waktunya sudah selesai." },
           { type: "h", val: "Standard Plan / Sisi Pilihan / Tunggu" },
           { type: "p", val: "Standard Plan mengelompokkan dua skenario arah. Sisi Pilihan adalah yang lebih didukung; Tunggu berarti eksekusi segera belum didukung." },
           { type: "h", val: "Adaptive Position Plan / Layer" },
           { type: "p", val: "Kalkulasi sesuai kondisi akun dengan checkpoint bertahap manual. Layer adalah opsi penambahan yang harus dinilai ulang, bukan order otomatis." },
           { type: "h", val: "Margin / Margin Call / Likuidasi" },
           { type: "p", val: "Margin adalah jaminan untuk posisi terbuka. Batas margin call dan likuidasi adalah kontrol akun dari aturan yang ditampilkan." },
           { type: "h", val: "Spread / Fee / Rollover / Slippage" },
            { type: "p", val: "Biaya dan efek eksekusi yang dapat membuat hasil nyata berbeda dari kalkulasi sederhana harga entry ke exit." },
            { type: "h", val: "Peta Risiko Timeframe / Risiko Relatif" },
            { type: "p", val: "Perbandingan risiko teknikal antar-snapshot timeframe yang tersedia. Risiko relatif hanya mengurutkan pilihan yang dibandingkan; lebih rendah bukan berarti bebas risiko." },
            { type: "h", val: "BUY / SELL / Keduanya" },
            { type: "p", val: "Kontrol tampilan chart untuk melihat skenario BUY, skenario SELL, atau keduanya sekaligus. Kontrol ini tidak memasang order dan tidak mengubah analisis." },
            { type: "h", val: "Running Price" },
            { type: "p", val: "Harga acuan terbaru yang tersedia pada chart. Nilainya dapat bergerak setelah level analisis tersimpan dibuat." },
            { type: "h", val: "XP / Level / Rank / Mastery" },
            { type: "p", val: "XP mencatat aktivitas disiplin yang terverifikasi. XP menaikkan Level 1–100 beserta Rank; setelah level 100, progres berikutnya dicatat sebagai Mastery." },
            { type: "h", val: "Achievement Badge / Streak / Riwayat XP" },
            { type: "p", val: "Badge menandai milestone disiplin, streak menghitung konsistensi hari aktif, dan Riwayat XP mencantumkan event XP terverifikasi. Semuanya pribadi dan bukan ukuran profit atau keahlian trading." }
        ],
        keywords: ["bullish", "bearish", "neutral", "netral", "SL", "stop loss", "TP", "take profit", "RR", "R:R", "risk reward", "timeframe", "support", "resistance", "fundamental", "bias", "signal strength", "confidence", "validity", "invalidation", "expired", "standard plan", "preferred side", "wait", "tunggu", "adaptive position plan", "layer", "margin", "margin call", "liquidation", "likuidasi", "spread", "fee", "rollover", "slippage", "Peta Risiko Timeframe", "relative risk", "risiko relatif", "BUY", "SELL", "Keduanya", "Both", "running price", "XP", "level", "rank", "Mastery", "achievement badge", "streak", "XP history", "Riwayat XP"],
        relatedArticleId: "levels-chart"
      }
    ]
  },
  {
    id: "privacy",
    icon: Shield,
    title_en: "Data & Privacy",
    title_id: "Data & Privasi",
    articles: [
      {
        id: "data-handling",
        title_en: "How We Handle Your Data",
        title_id: "Penanganan Data Kamu",
        content_en: [
          { type: "p", val: "TradePilot stores your analysis history and journal entries so you can review your patterns over time." },
          { type: "p", val: "Your profile details support account access, preferences, and enabled notifications. Market-analysis inputs and saved activity support the app features you choose to use." },
          { type: "p", val: "You can request permanent account deletion from the Profile page. Read the Privacy Policy for the complete and current description of collection, processing, service providers, retention, and your choices." }
        ],
        content_id: [
          { type: "p", val: "TradePilot menyimpan riwayat analisis dan entri jurnal agar kamu bisa mereview pola trading dari waktu ke waktu." },
          { type: "p", val: "Detail profil mendukung akses akun, preferensi, dan notifikasi yang kamu aktifkan. Input analisis dan aktivitas tersimpan mendukung fitur aplikasi yang kamu pilih untuk digunakan." },
          { type: "p", val: "Kamu dapat meminta penghapusan akun permanen melalui halaman Profil. Baca Kebijakan Privasi untuk penjelasan lengkap dan terbaru tentang pengumpulan, pemrosesan, penyedia layanan, retensi, dan pilihan kamu." }
        ],
        keywords: ["privacy", "data", "account deletion"]
      }
    ]
  },
  {
    id: "psychology",
    icon: Brain,
    title_en: "Psychology & Discipline",
    title_id: "Psikologi & Disiplin",
    articles: MINDSET_MODULES.map(m => ({
      id: m.id,
      title_en: m.title_en,
      title_id: m.title_id,
      content_en: m.blocks.map(b => {
        if (b.type === "list") return { type: "list", val: b.en };
        if (b.type === "callout") return { type: "callout", val: b.en };
        if (b.type === "h") return { type: "h", val: b.en };
        return { type: "p", val: b.en };
      }),
      content_id: m.blocks.map(b => {
        if (b.type === "list") return { type: "list", val: b.id };
        if (b.type === "callout") return { type: "callout", val: b.id };
        if (b.type === "h") return { type: "h", val: b.id };
        return { type: "p", val: b.id };
      }),
      keywords: [m.title_en, m.title_id, "psychology", "psikologi", "discipline", "disiplin"]
    }))
  }
];
