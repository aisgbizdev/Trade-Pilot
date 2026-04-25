import { Link } from "wouter";
import { TrendingUp, BarChart3, Clock, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: TrendingUp,
    title: "Analisis Berbasis AI",
    description:
      "GPT-4o menganalisis kondisi pasar dan memberikan skenario yang mungkin terjadi — bukan prediksi pasti.",
  },
  {
    icon: BarChart3,
    title: "Dua Mode Analisis",
    description:
      "Mode Pemula untuk analisis sederhana, Mode Pro untuk analisis mendalam dengan faktor teknikal dan fundamental.",
  },
  {
    icon: Clock,
    title: "Masa Berlaku Analisis",
    description:
      "Setiap analisis memiliki masa berlaku berdasarkan timeframe — dari 15 menit hingga 96 jam.",
  },
  {
    icon: Shield,
    title: "Pendukung Keputusan",
    description:
      "Bukan sinyal trading otomatis. Alat ini membantu kamu berpikir lebih terstruktur sebelum ambil keputusan.",
  },
];

const instruments = [
  "XAU/USD", "BRENT", "XAG/USD", "EUR/USD", "GBP/USD", "USD/JPY",
  "NASDAQ", "DJIA", "DXY", "USD/IDR",
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground">AI Trading</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" data-testid="link-login">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" data-testid="link-register">
              Daftar
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full">
        <section className="px-6 py-12 text-center">
          <Badge
            variant="secondary"
            className="mb-4 text-xs font-medium px-3 py-1"
          >
            Pendukung Keputusan Trading
          </Badge>
          <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">
            Analisis Pasar yang
            <span className="text-primary"> Jujur dan Terstruktur</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto">
            Bukan sinyal trading. Bukan prediksi otomatis. Hanya bantuan berpikir 
            sebelum kamu ambil keputusan sendiri.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/register">
              <Button className="w-full" data-testid="button-get-started">
                Mulai Gratis
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full" data-testid="button-login">
                Sudah punya akun? Masuk
              </Button>
            </Link>
          </div>
        </section>

        <section className="px-4 pb-8">
          <div className="mb-4">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Instrumen yang didukung
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {instruments.map((inst) => (
                <Badge
                  key={inst}
                  variant="outline"
                  className="text-xs font-mono"
                >
                  {inst}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-8">
          <h2 className="text-lg font-bold text-foreground mb-5 text-center">
            Apa yang Bisa Dilakukan?
          </h2>
          <div className="space-y-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-12">
          <div className="bg-primary rounded-2xl p-6 text-center text-primary-foreground">
            <h2 className="text-lg font-bold mb-2">Siap Mencoba?</h2>
            <p className="text-xs text-primary-foreground/80 leading-relaxed mb-4">
              Daftar sekarang dan mulai analisis pertama kamu.
              Gratis, tidak ada kartu kredit.
            </p>
            <Link href="/register">
              <Button
                variant="secondary"
                className="w-full"
                data-testid="button-signup-bottom"
              >
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          AI Trading Assistant adalah alat pendukung keputusan.
          Bukan saran keuangan atau layanan trading.
        </p>
      </footer>
    </div>
  );
}
