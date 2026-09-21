import { Link } from "wouter";
import { Brain, Zap, Target } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { TiktokSignInButton } from "@/components/tiktok-sign-in-button";

// Same three value props the landing page's hero leads with — reused here
// (smaller, theme-aware) so the space below the sign-up card carries the
// "why" instead of sitting empty.
const VALUE_PROP_ICONS = [Brain, Zap, Target];

// Google-only sign-up (web). The manual email/password + security-question
// form used to live here, below the Google button — removed as a
// deliberate product decision (see chat): Google already guarantees a
// verified email, which was the actual problem the manual form's security
// question never solved. The backend POST /auth/register endpoint is
// intentionally left in place (unused by this page) rather than deleted,
// so existing password accounts keep working via /login and this is easy
// to roll back if needed.
//
// Visual structure mirrors login.tsx's hero-band + card treatment — with
// only the Google button left, the page reads as sparse without it.
export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col flex-1">
      <div className="flex justify-end px-4 pt-4">
        <LanguageToggle />
      </div>

      <div className="hero-gradient px-6 pt-8 pb-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-400/12 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/15 border border-amber-400/30 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-4 float-anim">
            <BrandLogo className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">{t.auth.create_account}</h1>
          <p className="text-sm text-slate-200">{t.auth.register_subtitle}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 py-8 -mt-4">
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
          <div className="space-y-2.5">
            <GoogleSignInButton />
            <TiktokSignInButton />
          </div>

          <p
            className="text-[11px] text-muted-foreground text-center leading-relaxed mt-4"
            data-testid="text-consent"
          >
            {t.legal.consent_register
              .split(/\{terms\}|\{privacy\}/)
              .flatMap((part, idx, arr) => {
                if (idx === arr.length - 1) return [part];
                const isTerms = t.legal.consent_register
                  .split(part)[1]
                  ?.startsWith("{terms}");
                return [
                  part,
                  isTerms ? (
                    <Link
                      key={`t-${idx}`}
                      href="/terms"
                      className="text-primary hover:underline"
                      data-testid="link-consent-terms"
                    >
                      {t.legal.terms_link}
                    </Link>
                  ) : (
                    <Link
                      key={`p-${idx}`}
                      href="/privacy"
                      className="text-primary hover:underline"
                      data-testid="link-consent-privacy"
                    >
                      {t.legal.privacy_link}
                    </Link>
                  ),
                ];
              })}
          </p>
        </div>

        <ul className="mt-8 space-y-3" data-testid="list-register-value-props">
          {t.landing.value_props.map((text, idx) => {
            const Icon = VALUE_PROP_ICONS[idx] ?? Brain;
            return (
              <li key={idx} className="flex items-center gap-3" data-testid={`item-register-value-prop-${idx}`}>
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{text}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {t.auth.have_account}{" "}
          <Link href="/login">
            <span className="text-primary font-medium hover:underline cursor-pointer" data-testid="link-login">
              {t.auth.login_link}
            </span>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
