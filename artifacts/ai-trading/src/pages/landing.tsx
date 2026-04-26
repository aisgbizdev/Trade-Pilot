import { Link } from "wouter";
import { BrandLogo } from "@/components/brand-logo";
import {
  BarChart3,
  Clock,
  ChevronRight,
  Brain,
  Lock,
  Shield,
  LineChart,
  Compass,
  Scale,
  GitBranch,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { ContinuousTicker } from "@/components/continuous-ticker";

const FEATURE_ICON_MAP = [Brain, BarChart3, Clock, Sparkles];

const FEATURE_STYLES = [
  { color: "from-blue-500/20 to-violet-500/20", iconColor: "text-blue-400", glow: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]" },
  { color: "from-cyan-500/20 to-blue-500/20", iconColor: "text-cyan-400", glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]" },
  { color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400", glow: "group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]" },
  { color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400", glow: "group-hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]" },
];

const WHAT_YOU_GET_ICONS = [LineChart, Compass, Scale, GitBranch, AlertTriangle];

const WHAT_YOU_GET_STYLES = [
  { color: "from-sky-500/15 to-blue-500/15", iconColor: "text-sky-400" },
  { color: "from-violet-500/15 to-fuchsia-500/15", iconColor: "text-violet-400" },
  { color: "from-emerald-500/15 to-amber-500/15", iconColor: "text-emerald-400" },
  { color: "from-blue-500/15 to-indigo-500/15", iconColor: "text-indigo-400" },
  { color: "from-rose-500/15 to-orange-500/15", iconColor: "text-rose-400" },
];

export default function LandingPage() {
  const { t } = useTranslation();

  const stats = [
    { value: "AI", label: t.landing.stats_model },
    { value: "10+", label: t.landing.stats_instruments },
    { value: "7", label: t.landing.stats_timeframes },
    { value: "EN/ID", label: t.landing.stats_lang },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background max-w-lg mx-auto w-full relative md:shadow-2xl md:shadow-black/40 md:border-x md:border-border/50">
      {/* Sticky group: header + ContinuousTicker stay pinned to the top
          together while the page scrolls. Wrapping them in a single sticky
          container is what keeps the ticker from disappearing on scroll —
          making each child sticky independently would stack them on top
          of one another at top:0. */}
      <div className="sticky top-0 z-40">
        <header className="backdrop-blur-xl border-b border-white/10 pl-[calc(env(safe-area-inset-left,0px)+1rem)] pr-[calc(env(safe-area-inset-right,0px)+1rem)] pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 flex items-center justify-between bg-background/80">
          <div className="flex items-center gap-2">
            <BrandLogo className="w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">
                <span className="gradient-text">Trade</span>
                <span className="text-foreground"> Pilot</span>
              </span>
              <a
                href="https://newsmaker.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 mt-0.5 hover:opacity-75 transition-opacity"
              >
                <span className="text-[8px] text-muted-foreground/60 leading-none">supported by</span>
                <img src="/newsmaker-logo.png" alt="Newsmaker.id" className="h-2.5 w-auto object-contain bg-white rounded-sm px-0.5" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link href="/login">
              <button className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-all" data-testid="link-login">
                {t.landing.login}
              </button>
            </Link>
            <Link href="/register">
              <button className="text-sm font-medium px-4 py-1.5 rounded-lg btn-premium text-white transition-all hover:opacity-90" data-testid="link-register">
                {t.landing.register}
              </button>
            </Link>
          </div>
        </header>
        <ContinuousTicker />
      </div>

      <main className="flex-1 w-full">

        {/* HERO */}
        <section className="hero-gradient px-5 pt-14 pb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute top-20 right-4 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-4 w-40 h-40 bg-cyan-500/8 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10">
            <h1 className="text-[2rem] font-extrabold leading-[1.15] mb-4 text-white" data-testid="text-hero-headline">
              <span className="gradient-text">{t.landing.tagline_part1}</span>
              <br />
              <span className="text-white">{t.landing.tagline_part2}</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-xs mx-auto" data-testid="text-hero-subtitle">
              {t.landing.subtitle_full}
            </p>

            <div className="flex flex-col gap-3 mb-10">
              <Link href="/register" className="block">
                <button
                  className="w-full h-12 rounded-xl font-semibold text-white btn-premium flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                  data-testid="button-get-started"
                >
                  {t.landing.cta_start}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/login" className="block">
                <button
                  className="w-full h-11 rounded-xl font-medium text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  data-testid="button-login"
                >
                  {t.landing.cta_login}
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

        {/* Bridge: smooth fade from hero's dark end (#0d1b35) into the
            page's bg-background so the dark→light transition doesn't
            land as a hard seam. */}
        <div
          className="h-20 bg-gradient-to-b from-[#0d1b35] to-background -mt-px"
          aria-hidden="true"
        />

        {/* WHAT YOU ACTUALLY GET */}
        <section className="px-4 pt-2 pb-10" data-testid="section-what-you-get">
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">
              {t.landing.what_you_get_tag}
            </p>
            <h2 className="text-xl font-bold text-foreground">{t.landing.what_you_get_title}</h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
              {t.landing.what_you_get_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {t.landing.what_you_get_items.map((item, idx) => {
              const Icon = WHAT_YOU_GET_ICONS[idx] ?? Sparkles;
              const style = WHAT_YOU_GET_STYLES[idx] ?? WHAT_YOU_GET_STYLES[0];
              return (
                <div
                  key={idx}
                  className="flex gap-3.5 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all"
                  data-testid={`card-what-you-get-${idx}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center shrink-0 border border-white/10`}
                  >
                    <Icon className={`w-5 h-5 ${style.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEE HOW IT WORKS — sample analysis card */}
        <section className="px-4 pb-10" data-testid="section-see-how-it-works">
          <div className="text-center mb-5">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">
              {t.landing.see_how_tag}
            </p>
            <h2 className="text-xl font-bold text-foreground">{t.landing.see_how_title}</h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
              {t.landing.see_how_subtitle}
            </p>
          </div>

          {/* Sample analysis preview */}
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-4 space-y-4">
              {/* Instrument header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-violet-500/30 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{t.landing.sample_instrument}</div>
                    <div className="text-[10px] text-emerald-400 font-medium">{t.landing.sample_market_condition}</div>
                  </div>
                </div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">
                  {t.landing.see_how_tag}
                </span>
              </div>

              {/* Bias gauge */}
              <div className="rounded-xl bg-background/40 border border-border/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {t.landing.sample_bias_label}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">{t.landing.sample_bias_value}</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  <div className="h-1.5 rounded-full bg-rose-500/20" />
                  <div className="h-1.5 rounded-full bg-rose-500/10" />
                  <div className="h-1.5 rounded-full bg-slate-500/20" />
                  <div className="h-1.5 rounded-full bg-emerald-500" />
                  <div className="h-1.5 rounded-full bg-emerald-500/20" />
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>{t.landing.sample_confidence_label}</span>
                  <span className="font-semibold text-foreground">{t.landing.sample_confidence_value}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>{t.landing.sample_risk_label}</span>
                  <span className="font-semibold text-amber-400">{t.landing.sample_risk_value}</span>
                </div>
              </div>

              {/* Invalidation */}
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                    {t.landing.sample_invalidation_label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{t.landing.sample_invalidation}</p>
              </div>

              {/* Opportunity vs Risk */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300 mb-1">
                    {t.landing.sample_opportunity_label}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{t.landing.sample_opportunity}</p>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 mb-1">
                    {t.landing.sample_risk_section_label}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{t.landing.sample_risk_section}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="px-4 py-8">
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">{t.landing.section_features_tag}</p>
            <h2 className="text-xl font-bold text-foreground">
              {t.landing.section_features_title}{" "}
              <span className="gradient-text">{t.landing.section_features_highlight}</span>
            </h2>
          </div>
          <div className="space-y-3">
            {t.landing.features.map((feature, idx) => {
              const Icon = FEATURE_ICON_MAP[idx] ?? Brain;
              const style = FEATURE_STYLES[idx] ?? FEATURE_STYLES[0];
              return (
                <div
                  key={idx}
                  className={`group flex gap-3.5 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 ${style.glow}`}
                  data-testid={`card-feature-${idx}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center shrink-0 border border-white/10`}>
                    <Icon className={`w-5 h-5 ${style.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA */}
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
                  {t.landing.cta_bottom_title} <span className="gradient-text">{t.landing.cta_bottom_highlight}</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  {t.landing.cta_bottom_subtitle}
                </p>
                <div className="flex items-center justify-center gap-4 mb-5 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> {t.landing.no_credit_card}</span>
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> {t.landing.secure_data}</span>
                </div>
                <Link href="/register">
                  <button className="w-full h-11 rounded-xl font-semibold text-white btn-premium hover:opacity-90 transition-all" data-testid="button-signup-bottom">
                    {t.landing.cta_signup}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 px-4 py-4 text-center space-y-2">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          {t.landing.footer}
        </p>
        <div className="flex justify-center items-center gap-4 text-[11px]">
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground"
            data-testid="link-footer-privacy"
          >
            {t.legal.privacy_link}
          </Link>
          <span className="text-muted-foreground/50">·</span>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-foreground"
            data-testid="link-footer-terms"
          >
            {t.legal.terms_link}
          </Link>
        </div>
        <p className="text-[10px] text-muted-foreground/70">
          {t.landing.powered_by_prefix}{" "}
          <a
            href="https://newsmaker.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
            data-testid="link-footer-powered-by"
          >
            {t.landing.powered_by_brand}
          </a>
        </p>
      </footer>
    </div>
  );
}
