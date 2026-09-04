import { MINDSET_MODULES } from "./mindset-modules";
import { Brain, Shield, Book, Lightbulb, type LucideIcon } from "lucide-react";

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
          { type: "p", val: "Trade Pilot scans technical indicators (RSI, MACD, Bollinger Bands, moving averages) and combines them with real-time news and economic calendar data." },
          { type: "p", val: "The result is a structured trade plan — entry zone, stop-loss, and up to 3 take-profit levels — with a bias gauge and plain-English market summary." }
        ],
        content_id: [
          { type: "p", val: "Trade Pilot memindai indikator teknikal (RSI, MACD, Bollinger Bands, moving averages) dan menggabungkannya dengan berita terkini serta data kalender ekonomi." },
          { type: "p", val: "Hasilnya adalah trade plan terstruktur — zona entry, stop-loss, dan hingga 3 level take profit — beserta gauge bias dan ringkasan market." }
        ]
      },
      {
        id: "feature-map",
        title_en: "What Each Trade Pilot Feature Does",
        title_id: "Fungsi Setiap Fitur Trade Pilot",
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
        ]
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
        ]
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
        ]
      },
      {
        id: "adaptive-plan",
        title_en: "Standard and Adaptive Position Plans",
        title_id: "Standard dan Adaptive Position Plan",
        content_en: [
          { type: "p", val: "The Standard Plan presents the analysis levels directly. The Adaptive Position Plan translates a supported analysis into account-aware position checkpoints and risk limits." },
          { type: "p", val: "Adaptive calculations currently apply only to canonical XAU/USD, BRENT, HSI, and NIKKEI analyses. Other instruments still receive the regular analysis and Standard Plan." },
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
          { type: "p", val: "Kalkulasi Adaptive saat ini hanya berlaku untuk analisis kanonikal XAU/USD, BRENT, HSI, dan NIKKEI. Instrumen lain tetap memperoleh analisis reguler dan Standard Plan." },
          { type: "list", val: [
            "Pilih jenis akun dan masukkan dana tersedia saat ini dengan akurat.",
            "Perlakukan setiap layer tambahan sebagai checkpoint manual, bukan instruksi otomatis.",
            "Tambah hanya jika skenario tersimpan masih searah, belum ada invalidation, dan tidak ada risiko fundamental baru yang mengubah setup.",
            "Harga bergerak melawan posisi saja bukan alasan untuk menambah posisi."
          ] },
          { type: "callout", val: "Position plan adalah kalkulasi pendukung keputusan, bukan perintah eksekusi atau jaminan profit." }
        ]
      }
    ]
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
          { type: "p", val: "The direction favored by current evidence. Neutral means the evidence is mixed or not strong enough to favor either side." }
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
          { type: "p", val: "Arah yang lebih didukung bukti saat ini. Netral berarti buktinya campuran atau belum cukup kuat untuk memilih salah satu sisi." }
        ]
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
          { type: "p", val: "Trade Pilot stores your analysis history and journal entries so you can review your patterns over time." },
          { type: "p", val: "Your profile details support account access, preferences, and enabled notifications. Market-analysis inputs and saved activity support the app features you choose to use." },
          { type: "p", val: "You can request permanent account deletion from the Profile page. Read the Privacy Policy for the complete and current description of collection, processing, service providers, retention, and your choices." }
        ],
        content_id: [
          { type: "p", val: "Trade Pilot menyimpan riwayat analisis dan entri jurnal agar kamu bisa mereview pola trading dari waktu ke waktu." },
          { type: "p", val: "Detail profil mendukung akses akun, preferensi, dan notifikasi yang kamu aktifkan. Input analisis dan aktivitas tersimpan mendukung fitur aplikasi yang kamu pilih untuk digunakan." },
          { type: "p", val: "Kamu dapat meminta penghapusan akun permanen melalui halaman Profil. Baca Kebijakan Privasi untuk penjelasan lengkap dan terbaru tentang pengumpulan, pemrosesan, penyedia layanan, retensi, dan pilihan kamu." }
        ]
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
      })
    }))
  }
];
