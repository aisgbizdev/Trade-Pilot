import { Link } from "wouter";
import { BrandLogo } from "@/components/brand-logo";
import {
  ChevronRight,
  Brain,
  Shield,
  Zap,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useTrackOutbound } from "@/hooks/use-track-outbound";
import { SHOW_SPONSOR } from "@/lib/sponsor-flag";
import { SHOW_NEWSMAKER } from "@/lib/newsmaker-flag";
import { LanguageToggle } from "@/components/language-toggle";
import { ContinuousTicker } from "@/components/continuous-ticker";

// One icon per value-prop, in display order. Hard-coded here so locale
// files stay pure strings and translators don't have to deal with icon
// identifiers. Keep the array length in sync with `landing.value_props`.
const VALUE_PROP_ICONS = [Brain, Zap, Target];

export default function LandingPage() {
  const { t } = useTranslation();
  const trackOutbound = useTrackOutbound();

  const stats = [
    { value: "AI", label: t.landing.stats_model },
    { value: "10+", label: t.landing.stats_instruments },
    { value: "8", label: t.landing.stats_timeframes },
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
              {SHOW_SPONSOR && (
                <a
                  href="https://www.sg-berjangka.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 mt-0.5 hover:opacity-80 transition-opacity"
                  data-testid="link-header-sponsor"
                  onClick={() => trackOutbound("landing-header", "sg-berjangka")}
                >
                  <span className="text-[8px] text-muted-foreground/70 leading-none lowercase">{t.brand.sponsored_by}</span>
                  <span className="text-[9px] font-bold leading-none text-amber-400 tracking-wide">SOLID PRIME</span>
                </a>
              )}
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
              <button className="text-sm font-medium px-4 py-1.5 rounded-lg btn-premium transition-all hover:opacity-90" data-testid="link-register">
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
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/12 rounded-full blur-3xl" />
            <div className="absolute top-20 right-4 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-4 w-40 h-40 bg-orange-500/8 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10">
            <h1 className="text-[2rem] font-extrabold leading-[1.15] mb-4 text-white" data-testid="text-hero-headline">
              <span className="gradient-text">{t.landing.tagline_part1}</span>
              <br />
              <span className="text-white">{t.landing.tagline_part2}</span>
            </h1>

            <p className="text-sm text-slate-200 leading-relaxed mb-7 max-w-xs mx-auto" data-testid="text-hero-subtitle">
              {t.landing.subtitle_full}
            </p>

            <div className="flex flex-col gap-3 mb-3">
              <Link href="/register" className="block">
                <button
                  className="w-full h-12 rounded-xl font-semibold btn-premium flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                  data-testid="button-get-started"
                >
                  {t.landing.cta_start}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/login" className="block">
                <button
                  className="w-full h-11 rounded-xl font-medium text-amber-100 border border-amber-400/30 bg-amber-400/5 hover:bg-amber-400/10 transition-all"
                  data-testid="button-login"
                >
                  {t.landing.cta_login}
                </button>
              </Link>
            </div>

            {/* Subtle, confident reassurance line — replaces the old loud
                "no credit card" chip. Trade Pilot is genuinely free with
                no paid tier, so the copy says exactly that, quietly. */}
            <p
              className="text-[11px] text-amber-100/70 mb-8"
              data-testid="text-always-free-note"
            >
              {t.landing.always_free_note}
            </p>

            <div className="grid grid-cols-4 gap-3">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-white/5 rounded-xl p-2.5 border border-amber-400/15">
                  <div className="text-base font-bold gradient-text">{value}</div>
                  <div className="text-[9px] text-amber-100/80 mt-0.5 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bridge: smooth fade from hero's dark end (#0d0905) into the
            page's bg-background so the dark→light transition doesn't
            land as a hard seam. */}
        <div
          className="h-20 bg-gradient-to-b from-[#0d0905] to-background -mt-px"
          aria-hidden="true"
        />

        {/* VALUE PROPS — one tight strip of 3 one-liners. No paragraphs,
            no card descriptions. Detail belongs inside the app, not on
            the front door. */}
        <section
          className="px-4 pt-2 pb-10"
          data-testid="section-value-props"
        >
          <ul className="space-y-2.5">
            {t.landing.value_props.map((text, idx) => {
              const Icon = VALUE_PROP_ICONS[idx] ?? Brain;
              return (
                <li
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card"
                  data-testid={`item-value-prop-${idx}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/15 to-yellow-500/15 border border-amber-400/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-foreground leading-snug">
                    {text}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* SOLID PRIME SPONSOR CTA — separates the AI tool (free) from
            the regulated broker product (real-money). Never bundled with
            the "Try Trade Pilot" CTAs above so it's clear they're distinct.
            Hidden via SHOW_SPONSOR until the legal sponsorship agreement
            is finalized; intentionally kept in the codebase for fast revival. */}
        {SHOW_SPONSOR && (
          <section className="px-4 pb-8" data-testid="section-solid-prime-cta">
            <div className="rounded-2xl border border-amber-400/35 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t.brand.sponsored_by}
                </span>
                <span className="text-base font-extrabold tracking-wide text-amber-400">
                  SOLID PRIME
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground/80 mb-3 leading-snug">
                {t.brand.solid_prime_subline} · {t.brand.solid_prime_regulated}
              </p>
              <p className="text-xs text-foreground/85 leading-relaxed mb-4">
                {t.brand.open_account_subtitle}
              </p>
              <a
                href="https://www.sg-berjangka.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-open-solid-prime-account"
                className="w-full h-11 rounded-xl font-semibold btn-premium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                onClick={() => trackOutbound("landing-cta", "sg-berjangka")}
              >
                {t.brand.open_account_cta}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        )}

        {/* BOTTOM CTA */}
        <section className="px-4 pb-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="hero-gradient p-6 text-center">
              <div className="absolute inset-0">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-400/18 rounded-full blur-2xl" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/15 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30 float-anim">
                  <BrandLogo className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">
                  {t.landing.cta_bottom_title} <span className="gradient-text">{t.landing.cta_bottom_highlight}</span>
                </h2>
                <p className="text-xs text-slate-200 leading-relaxed mb-5">
                  {t.landing.cta_bottom_subtitle}
                </p>
                <Link href="/register">
                  <button className="w-full h-11 rounded-xl font-semibold btn-premium hover:opacity-90 transition-all" data-testid="button-signup-bottom">
                    {t.landing.cta_signup}
                  </button>
                </Link>
                {/* Single low-key reassurance line — same understated tone
                    as the hero microcopy. Replaces the old two-chip row
                    (no-credit-card + secure-data) which felt like a
                    discount banner. */}
                <p
                  className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-amber-100/70"
                  data-testid="text-bottom-always-free-note"
                >
                  <Shield className="w-3 h-3 text-amber-300/80" />
                  {t.landing.always_free_note}
                </p>
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
        {SHOW_SPONSOR && (
          <p className="text-[10px] text-muted-foreground/70">
            {t.brand.sponsored_by}{" "}
            <a
              href="https://www.sg-berjangka.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-500 dark:text-amber-300 hover:text-amber-400 underline-offset-2 hover:underline"
              data-testid="link-landing-footer-sponsor"
              onClick={() => trackOutbound("landing-footer", "sg-berjangka")}
            >
              SOLID PRIME
            </a>
          </p>
        )}
        {SHOW_NEWSMAKER && (
          <p className="text-[9px] text-muted-foreground/50">
            {t.brand.news_data_via}
          </p>
        )}
      </footer>
    </div>
  );
}
