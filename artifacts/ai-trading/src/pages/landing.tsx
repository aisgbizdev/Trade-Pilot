import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { LandingProductPreview } from "@/components/landing-product-preview";
import { useAuth } from "@/components/auth-provider";
import { useTranslation } from "@/lib/i18n";
import { useEmbedMode } from "@/lib/embed-mode";
import { useTrackOutbound } from "@/hooks/use-track-outbound";
import { useTrackEvent } from "@/hooks/use-track-event";
import { SHOW_SPONSOR } from "@/lib/sponsor-flag";
import { SHOW_NEWSMAKER } from "@/lib/newsmaker-flag";

export default function LandingPage() {
  const { t } = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);
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

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden bg-[#090b0d] text-[#f1f0eb] selection:bg-primary selection:text-[#090b0d]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_75%_35%,rgba(255,122,0,0.065),transparent_75%)]"
      />

      <header className="relative z-10 border-b border-[#f1f0eb]/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-10">
          <BrandLogo variant="horizontal" className="h-8 w-auto sm:h-9" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#f1f0eb]/25 px-4 text-sm font-semibold text-[#f1f0eb] transition-colors hover:border-[#f1f0eb]/60 hover:bg-[#f1f0eb]/5"
              data-testid="button-header-login"
            >
              {t.landing.login}
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 sm:px-8 lg:px-10">
        <section className="grid flex-1 items-center gap-8 py-10 sm:py-12 md:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)] md:gap-10 lg:py-10" aria-labelledby="landing-title">
          <div className="max-w-[690px]">
            <p className="mb-5 flex items-center gap-3 text-base font-semibold tracking-[0.01em] text-primary sm:mb-7 sm:text-lg" data-testid="text-landing-slogan">
              <span className="h-px w-7 bg-primary" aria-hidden="true" />
              {t.landing.tagline_part1} {t.landing.tagline_part2}
            </p>
            <h1
              id="landing-title"
              className="max-w-[690px] text-[clamp(2.9rem,5.3vw,5.4rem)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#f1f0eb]"
              data-testid="text-hero-headline"
            >
              {t.landing.headline_first}
              <br />
              <span className="text-primary">{t.landing.headline_second}</span>
            </h1>
            <p className="mt-5 max-w-[515px] text-base leading-relaxed text-[#f1f0eb]/65 sm:mt-7 sm:text-lg" data-testid="text-hero-subtitle">
              {t.landing.subtitle_full}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-primary px-6 text-sm font-bold text-[#11100e] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                data-testid="button-get-started"
              >
                {t.landing.register}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#f1f0eb]/25 px-6 text-sm font-semibold text-[#f1f0eb] transition-colors hover:border-[#f1f0eb]/60 hover:bg-[#f1f0eb]/5"
                data-testid="button-sign-in"
              >
                {t.landing.login}
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#f1f0eb]/45" data-testid="text-always-free-note">
              {t.landing.always_free_note}
            </p>
            <button
              type="button"
              aria-expanded={previewOpen}
              aria-controls="landing-market-preview"
              onClick={() => setPreviewOpen((open) => !open)}
              className="mt-6 inline-flex min-h-11 max-w-full items-center gap-3 rounded-lg border border-[#f1f0eb]/20 px-4 py-2.5 text-left text-[#f1f0eb] transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              data-testid="button-toggle-sample-analysis"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{previewOpen ? t.landing.hide_sample : t.landing.show_sample}</span>
                <span className="block text-xs text-[#f1f0eb]/55">{t.landing.sample_hint}</span>
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-primary transition-transform ${previewOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          </div>

          <div className="relative hidden min-h-[310px] items-center justify-center md:flex" aria-hidden="true">
            <div className="absolute inset-x-3 top-1/2 h-px bg-gradient-to-r from-transparent via-[#f1f0eb]/20 to-transparent" />
            <div className="absolute inset-y-3 left-1/2 w-px bg-gradient-to-b from-transparent via-[#f1f0eb]/20 to-transparent" />
            <div className="relative flex h-[270px] w-[270px] items-center justify-center rounded-full border border-[#f1f0eb]/10 lg:h-[320px] lg:w-[320px]">
              <div className="absolute inset-7 rounded-full border border-dashed border-[#f1f0eb]/15" />
              <div className="absolute inset-[4.5rem] rounded-full border border-primary/45" />
              <div className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-primary" />
              <div className="relative text-center">
                <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-primary">{t.landing.diagram_top}</span>
                <span className="mt-2 block text-2xl font-bold tracking-[-0.04em] text-[#f1f0eb]">{t.landing.diagram_middle}</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-[#f1f0eb]/45">{t.landing.diagram_bottom}</span>
              </div>
            </div>
            <span className="absolute bottom-2 right-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[#f1f0eb]/35">TP / 01</span>
          </div>
        </section>

        <section
          id="landing-market-preview"
          hidden={!previewOpen}
          className="border-t border-[#f1f0eb]/10 py-10 sm:py-14"
          aria-label={t.landing.view_sample}
          data-testid="section-sample-analysis"
        >
          <div className="mx-auto max-w-2xl">
            <h2 className="text-xl font-bold tracking-tight text-[#f1f0eb] sm:text-2xl">{t.landing.view_sample}</h2>
            <p className="mt-1 text-xs text-[#f1f0eb]/55">{t.landing.sample_hint}</p>
            <div className="mt-6">
              {previewOpen && <LandingProductPreview />}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#f1f0eb]/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-5 text-xs leading-relaxed text-[#f1f0eb]/45 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-8">
            <p className="max-w-[520px]" data-testid="text-landing-disclaimer">{t.landing.footer}</p>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label={t.landing.footer_navigation_label}>
              <Link href="/privacy" className="transition-colors hover:text-[#f1f0eb]" data-testid="link-footer-privacy">{t.legal.privacy_link}</Link>
              <Link href="/terms" className="transition-colors hover:text-[#f1f0eb]" data-testid="link-footer-terms">{t.legal.terms_link}</Link>
              <Link href="/support" className="transition-colors hover:text-[#f1f0eb]" data-testid="link-footer-support">{t.legal.support_link}</Link>
              <Link href="/delete-account" className="transition-colors hover:text-[#f1f0eb]" data-testid="link-footer-delete-account">{t.legal.delete_account_link}</Link>
            </nav>
          </div>
          {(SHOW_SPONSOR || SHOW_NEWSMAKER) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#f1f0eb]/5 pt-2 text-[11px] text-[#f1f0eb]/35">
              {SHOW_SPONSOR && (
                <span>
                  {t.brand.sponsored_by}{" "}
                  <a
                    href="https://www.sg-berjangka.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackOutbound("landing-footer", "sg-berjangka")}
                    className="font-semibold text-primary/75 transition-colors hover:text-primary"
                    data-testid="link-landing-footer-sponsor"
                  >
                    SOLID PRIME
                  </a>
                </span>
              )}
              {SHOW_NEWSMAKER && <span data-testid="text-newsmaker-attribution">{t.brand.news_data_via}</span>}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}