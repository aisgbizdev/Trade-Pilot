import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { BrandLogo } from "@/components/brand-logo";
import {
  ChevronRight,
  Brain,
  Shield,
  Zap,
  Target,
  ArrowUpRight,
  Lightbulb,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useTrackOutbound } from "@/hooks/use-track-outbound";
import { useTrackEvent } from "@/hooks/use-track-event";
import { SHOW_SPONSOR } from "@/lib/sponsor-flag";
import { SHOW_NEWSMAKER } from "@/lib/newsmaker-flag";
import { LanguageToggle } from "@/components/language-toggle";
import { ContinuousTicker } from "@/components/continuous-ticker";
import { LandingProductPreview } from "@/components/landing-product-preview";
import { LandingFaq } from "@/components/landing-faq";
import { useAuth } from "@/components/auth-provider";
import { useEmbedMode } from "@/lib/embed-mode";
import { motion } from "framer-motion";

const VALUE_PROP_ICONS = [Brain, Zap, Target];

export default function LandingPage() {
  const { t } = useTranslation();
  const trackOutbound = useTrackOutbound();
  const trackEvent = useTrackEvent();
  const isEmbed = useEmbedMode();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isEmbed || isLoading) return;
    setLocation(isAuthenticated ? "/analyze?embed=1" : "/login?embed=1");
  }, [isEmbed, isAuthenticated, isLoading, setLocation]);

  useEffect(() => {
    trackEvent("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isEmbed) return null;

  const stats = [
    { value: "AI", label: t.landing.stats_model },
    { value: "10+", label: t.landing.stats_instruments },
    { value: "8", label: t.landing.stats_timeframes },
    { value: "EN/ID", label: t.landing.stats_lang },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#020202] text-white w-full relative overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-[100%] blur-[120px] opacity-70" />
        <div className="absolute top-1/3 -right-64 w-[500px] h-[500px] bg-amber-400/5 rounded-[100%] blur-[100px] opacity-50" />
      </div>

      <div className="sticky top-0 z-40 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto w-full">
          <header className="pl-[calc(env(safe-area-inset-left,0px)+1rem)] pr-[calc(env(safe-area-inset-right,0px)+1rem)] pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandLogo variant="horizontal" className="h-8 md:h-9 w-auto" />
              {SHOW_SPONSOR && (
                <div className="flex flex-col border-l border-white/10 pl-3 ml-1">
                  <a
                    href="https://www.sg-berjangka.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col hover:opacity-80 transition-opacity"
                    data-testid="link-header-sponsor"
                    onClick={() => trackOutbound("landing-header", "sg-berjangka")}
                  >
                    <span className="text-[7px] text-white/50 leading-none uppercase tracking-widest">{t.brand.sponsored_by}</span>
                    <span className="text-[10px] font-bold leading-tight text-primary tracking-wide">SOLID PRIME</span>
                  </a>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 md:gap-3">
              <LanguageToggle />
              <Link href="/login">
                <button className="text-xs font-medium text-white/70 hover:text-white px-3 py-2 rounded-lg transition-colors" data-testid="link-login">
                  {t.landing.login}
                </button>
              </Link>
              <Link href="/register">
                <button className="text-xs font-bold px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors hidden sm:block" data-testid="link-register">
                  {t.landing.register}
                </button>
              </Link>
            </div>
          </header>
          <ContinuousTicker />
        </div>
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto relative z-10">

        {/* HERO */}
        <section className="px-5 pt-20 md:pt-32 pb-16 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-2xl mx-auto"
          >
            <h1
              className="text-5xl md:text-7xl font-extrabold tracking-[-0.04em] leading-none text-white mb-5"
              data-testid="text-hero-kicker"
            >
              <span className="gradient-text">TradePilot</span>
              <span className="text-white">.id</span>
            </h1>

            <p
              className="text-base md:text-xl font-semibold uppercase tracking-[0.16em] md:tracking-[0.22em] leading-relaxed text-white/70 mb-7"
              data-testid="text-hero-headline"
            >
              <span className="text-primary">{t.landing.tagline_part1}</span>{" "}
              <span>{t.landing.tagline_part2}</span>
            </p>

            <p className="text-base md:text-lg text-white/60 leading-relaxed mb-10 max-w-md mx-auto" data-testid="text-hero-subtitle">
              {t.landing.subtitle_full}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Link href="/register" className="w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto px-8 h-12 rounded-xl font-bold btn-premium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  data-testid="button-get-started"
                >
                  {t.landing.cta_start}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <p
              className="text-xs text-white/40 mb-12 flex items-center justify-center gap-1.5"
              data-testid="text-always-free-note"
            >
              <Shield className="w-3.5 h-3.5 text-white/30" />
              {t.landing.always_free_note}
            </p>

            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
              {stats.map(({ value, label }, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                  key={label}
                  className="bg-white/[0.02] rounded-xl p-3 border border-white/5 backdrop-blur-sm"
                >
                  <div className="text-lg md:text-xl font-bold text-white tracking-tight">{value}</div>
                  <div className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">{label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* VALUE PROPS */}
        <section
          className="px-4 py-8 md:py-16"
          data-testid="section-value-props"
        >
          <ul className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
            {t.landing.value_props.map((text, idx) => {
              const Icon = VALUE_PROP_ICONS[idx] ?? Brain;
              return (
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  key={idx}
                  className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-colors"
                  data-testid={`item-value-prop-${idx}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-white/90 leading-snug">
                    {text}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </section>

        {/* SPONSOR CTA */}
        {SHOW_SPONSOR && (
          <section className="px-4 pb-12" data-testid="section-solid-prime-cta">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      {t.brand.sponsored_by}
                    </span>
                    <span className="text-lg font-extrabold tracking-wide text-primary">
                      SOLID PRIME
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 mb-2 font-medium tracking-wide uppercase">
                    {t.brand.solid_prime_subline} <span className="opacity-50 mx-1">·</span> {t.brand.solid_prime_regulated}
                  </p>
                  <p className="text-sm text-white/80 leading-relaxed max-w-md">
                    {t.brand.open_account_subtitle}
                  </p>
                </div>
                <a
                  href="https://www.sg-berjangka.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-open-solid-prime-account"
                  className="w-full md:w-auto shrink-0 h-12 px-6 rounded-xl font-bold bg-white text-black hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                  onClick={() => trackOutbound("landing-cta", "sg-berjangka")}
                >
                  {t.brand.open_account_cta}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </section>
        )}

        {/* PRODUCT PREVIEW */}
        <LandingProductPreview />

        {/* PHILOSOPHY STRIP */}
        <section
          className="px-4 pb-16"
          data-testid="section-philosophy"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-2 tracking-tight">
                {t.landing.philosophy_title}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                {t.landing.philosophy_body}
              </p>
              <p className="text-xs text-primary/80 mt-3 font-semibold uppercase tracking-wider">
                {t.landing.philosophy_subtext}
              </p>
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <LandingFaq />

        {/* BOTTOM CTA */}
        <section className="px-4 pb-16 md:py-16 md:max-w-3xl md:mx-auto md:w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/20 rounded-full blur-[80px]" />

            <div className="border border-white/10 bg-[#050505] p-10 md:p-14 text-center relative z-10 rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6 float-anim">
                <BrandLogo variant="compact" className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
                {t.landing.cta_bottom_title} <span className="text-primary">{t.landing.cta_bottom_highlight}</span>
              </h2>
              <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-sm mx-auto">
                {t.landing.cta_bottom_subtitle}
              </p>
              <div className="flex flex-col items-center gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto min-w-[200px] h-12 rounded-xl font-bold btn-premium hover:scale-[1.02] active:scale-[0.98] transition-transform" data-testid="button-signup-bottom">
                    {t.landing.cta_signup}
                  </button>
                </Link>
                <p
                  className="flex items-center gap-1.5 text-[11px] text-white/40 font-medium"
                  data-testid="text-bottom-always-free-note"
                >
                  <Shield className="w-3 h-3 text-white/30" />
                  {t.landing.always_free_note}
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-4 py-8 text-center space-y-4 bg-[#020202] relative z-20">
        <p className="text-[11px] text-white/40 leading-relaxed max-w-xl mx-auto">
          {t.landing.footer}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[11px] font-medium tracking-wide">
          <Link
            href="/privacy"
            className="text-white/40 hover:text-white transition-colors"
            data-testid="link-footer-privacy"
          >
            {t.legal.privacy_link}
          </Link>
          <Link
            href="/terms"
            className="text-white/40 hover:text-white transition-colors"
            data-testid="link-footer-terms"
          >
            {t.legal.terms_link}
          </Link>
          <Link
            href="/support"
            className="text-white/40 hover:text-white transition-colors"
            data-testid="link-footer-support"
          >
            {t.legal.support_link}
          </Link>
          <Link
            href="/delete-account"
            className="text-white/40 hover:text-white transition-colors"
            data-testid="link-footer-delete-account"
          >
            {t.legal.delete_account_link}
          </Link>
        </div>

        {SHOW_SPONSOR && (
          <p className="text-[10px] text-white/30 pt-4">
            {t.brand.sponsored_by}{" "}
            <a
              href="https://www.sg-berjangka.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:text-primary/80 transition-colors"
              data-testid="link-landing-footer-sponsor"
              onClick={() => trackOutbound("landing-footer", "sg-berjangka")}
            >
              SOLID PRIME
            </a>
          </p>
        )}
        {SHOW_NEWSMAKER && (
          <p className="text-[9px] text-white/20">
            {t.brand.news_data_via}
          </p>
        )}
      </footer>
    </div>
  );
}
