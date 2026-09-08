import { useTranslation } from "@/lib/i18n";

/**
 * "Continue with Google" button. Kicks off the server-side OAuth redirect
 * flow — a plain top-level navigation to `/api/auth/google` (proxied to the
 * API server in dev, same-origin in prod). The server sets the session
 * cookie and redirects back into the app, so there's nothing to await here.
 */
export function GoogleSignInButton({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = "/api/auth/google";
      }}
      disabled={disabled}
      data-testid="button-google-signin"
      className="w-full h-12 rounded-xl border border-border bg-card font-semibold text-foreground flex items-center justify-center gap-2.5 hover:bg-muted transition-colors disabled:opacity-60"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        />
      </svg>
      {t.auth.continue_with_google}
    </button>
  );
}

/** "──── or ────" separator between the Google button and the email form. */
export function AuthDivider() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 my-5" aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {t.auth.or_divider}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
