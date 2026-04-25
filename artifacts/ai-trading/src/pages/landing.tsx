import { Link } from "wouter";
import { TrendingUp, BarChart3, Clock, Shield, ChevronRight, Brain, Lock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Didukung AI Generatif",
    description: "Analisis mendalam berbasis large language model terbaru — bukan indikator biasa.",
    color: "from-blue-500/20 to-violet-500/20",
    iconColor: "text-blue-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]",
  },
  {
    icon: BarChart3,
    title: "Mode Pemula & Pro",
    description: "Mode Pemula untuk analisis ringkas. Mode Pro untuk breakdown teknikal & fundamental penuh.",
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
  },
  {
    icon: Clock,
    title: "Validitas per Timeframe",
    description: "Analisis 1m berlaku 15 menit. 1D berlaku 36 jam. Selalu tahu kapan analisis masih relevan.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]",
  },
  {
    icon: Shield,
    title: "Bukan Sinyal, Tapi Analisis",
    description: "Kami tidak jual sinyal. Kami bantu kamu berpikir lebih jernih sebelum eksekusi.",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]",
  },
];

const instruments = [
  "XAU/USD", "EUR/USD", "GBP/USD", "USD/JPY", "BRENT",
  "XAG/USD", "NASDAQ", "DJIA", "DXY", "USD/IDR",
  "XAU/USD", "EUR/USD", "GBP/USD", "USD/JPY", "BRENT",
  "XAG/USD", "NASDAQ", "DJIA", "DXY", "USD/IDR",
];

const stats = [
  { value: "AI", label: "Model Terkini" },
  { value: "10+", label: "Instrumen" },
  { value: "7", label: "Timeframe" },
  { value: "100%", label: "Bahasa Indonesia" },
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">

      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between bg-background/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">
            <span className="gradient-text">AI</span>
            <span className="text-foreground"> Trading</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-all" data-testid="link-login">
              Masuk
            </button>
          </Link>
          <Link href="/register">
            <button className="text-sm font-medium px-4 py-1.5 rounded-lg btn-premium text-white transition-all hover:opacity-90" data-testid="link-register">
              Daftar
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full">

        <section className="hero-gradient px-5 pt-14 pb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute top-20 right-4 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-4 w-40 h-40 bg-cyan-500/8 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10">
            <h1 className="text-[2rem] font-extrabold leading-[1.15] mb-4 text-white">
              Analisis Pasar yang{" "}
              <span className="gradient-text">Jujur &amp; Terstruktur</span>
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xs mx-auto">
              Bukan robot trading. Bukan sinyal ajaib. AI kami membantu kamu
              <span className="text-slate-300 font-medium"> berpikir lebih tajam</span> sebelum ambil keputusan.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              <Link href="/register" className="block">
                <button
                  className="w-full h-12 rounded-xl font-semibold text-white btn-premium flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                  data-testid="button-get-started"
                >
                  Mulai Analisis Gratis
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/login" className="block">
                <button
                  className="w-full h-11 rounded-xl font-medium text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  data-testid="button-login"
                >
                  Sudah punya akun? Masuk
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-white/5 rounded-xl p-2.5 border border-white/8">
                  <div className="text-base font-bold gradient-text">{value}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 overflow-hidden py-3 border-y border-white/5">
          <div className="flex gap-6 ticker-scroll whitespace-nowrap w-max">
            {instruments.map((inst, i) => (
              <span key={i} className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 inline-block" />
                {inst}
              </span>
            ))}
          </div>
        </section>

        <section className="px-4 py-8">
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">Kemampuan Platform</p>
            <h2 className="text-xl font-bold text-foreground">
              Lebih dari Sekadar{" "}
              <span className="gradient-text">Indikator Biasa</span>
            </h2>
          </div>
          <div className="space-y-3">
            {features.map(({ icon: Icon, title, description, color, iconColor, glow }) => (
              <div
                key={title}
                className={`group flex gap-3.5 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 ${glow}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 border border-white/10`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="hero-gradient p-6 text-center">
              <div className="absolute inset-0">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-500/15 rounded-full blur-2xl" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/40 float-anim">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">
                  Coba Sekarang — <span className="gradient-text">Gratis</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  Daftar dalam 30 detik. Analisis pertama langsung tersedia.
                </p>
                <div className="flex items-center justify-center gap-4 mb-5 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> Tanpa kartu kredit</span>
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> Data aman</span>
                </div>
                <Link href="/register">
                  <button className="w-full h-11 rounded-xl font-semibold text-white btn-premium hover:opacity-90 transition-all" data-testid="button-signup-bottom">
                    Daftar Sekarang
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 px-4 py-4 text-center">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          AI Trading Assistant adalah alat pendukung keputusan, bukan saran keuangan atau layanan trading.
        </p>
      </footer>
    </div>
  );
}
