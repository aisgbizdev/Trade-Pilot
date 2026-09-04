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
          { type: "p", val: "The ratio between the potential loss (risk) and potential gain (reward) of a trade." }
        ],
        content_id: [
          { type: "h", val: "Bullish / Bearish" },
          { type: "p", val: "Bullish berarti perkiraan harga akan naik. Bearish berarti perkiraan harga akan turun." },
          { type: "h", val: "Stop Loss (SL)" },
          { type: "p", val: "Order untuk menutup posisi yang rugi demi mencegah kerugian lebih lanjut." },
          { type: "h", val: "Take Profit (TP)" },
          { type: "p", val: "Order untuk menutup posisi untung setelah mencapai target tertentu." },
          { type: "h", val: "Risk/Reward Ratio (RR)" },
          { type: "p", val: "Rasio antara potensi kerugian (risiko) dan potensi keuntungan (reward) dari sebuah trade." }
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
          { type: "p", val: "We do not share your data with third parties or use it to train trading models. Your email is only used for account access and critical notifications." },
          { type: "p", val: "You can permanently delete your account and all associated data at any time from the Profile page." }
        ],
        content_id: [
          { type: "p", val: "Trade Pilot menyimpan riwayat analisis dan entri jurnal agar kamu bisa mereview pola trading dari waktu ke waktu." },
          { type: "p", val: "Kami tidak membagikan data kamu dengan pihak ketiga atau menggunakannya untuk melatih model trading. Email hanya digunakan untuk akses akun dan notifikasi penting." },
          { type: "p", val: "Kamu bisa menghapus akun dan semua data terkait secara permanen kapan saja melalui halaman Profil." }
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
