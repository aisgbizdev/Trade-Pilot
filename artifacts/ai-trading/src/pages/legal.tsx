import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { getLegalDocument, type LegalKind } from "@/lib/legal-content";

interface LegalPageProps {
  kind: LegalKind;
}

export default function LegalPage({ kind }: LegalPageProps) {
  const { lang, t } = useTranslation();
  const doc = getLegalDocument(kind, lang);
  const testIdPrefix = kind === "privacy" ? "page-privacy" : "page-terms";

  return (
    <div
      className="min-h-[100dvh] flex flex-col bg-background"
      data-testid={testIdPrefix}
    >
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between bg-background/80">
        <Link
          href="/"
          className="flex items-center gap-2"
          data-testid="link-home"
        >
          <BrandLogo className="w-7 h-7" />
          <span className="font-bold text-sm tracking-tight">
            <span className="gradient-text">Trade</span>
            <span className="text-foreground"> Pilot</span>
          </span>
        </Link>
        <LanguageToggle />
      </header>

      <main className="flex-1 px-4 py-6 max-w-3xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          data-testid="link-back"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.legal.back_to_home}
        </Link>

        <h1
          className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
          data-testid="text-title"
        >
          {doc.title}
        </h1>
        <p
          className="text-xs text-muted-foreground mb-6"
          data-testid="text-last-updated"
        >
          {doc.lastUpdatedLabel}: {doc.lastUpdated}
        </p>

        <p
          className="text-sm leading-relaxed text-foreground/90 mb-8"
          data-testid="text-intro"
        >
          {doc.intro}
        </p>

        <div className="space-y-7">
          {doc.sections.map((section, idx) => (
            <section
              key={idx}
              data-testid={`section-${idx}`}
            >
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                {section.heading}
              </h2>
              <div className="space-y-2">
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm leading-relaxed text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav className="mt-10 pt-6 border-t border-border/50 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground"
            data-testid="link-privacy"
          >
            {t.legal.privacy_link}
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-foreground"
            data-testid="link-terms"
          >
            {t.legal.terms_link}
          </Link>
        </nav>
      </main>

      <footer className="border-t border-border/50 px-4 py-4 text-center">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          {t.landing.footer}
        </p>
      </footer>
    </div>
  );
}
