import { useTranslation } from "@/lib/i18n";

/**
 * "Continue with TikTok" button. Kicks off the server-side OAuth redirect
 * flow — a plain top-level navigation to `/api/auth/tiktok` (proxied to
 * the API server in dev, same-origin in prod), mirroring
 * google-sign-in-button.tsx exactly. The server sets the session cookie
 * (returning user) or bounces to /auth/tiktok/complete-signup (brand-new
 * sign-in — TikTok never provides an email), so there's nothing to await
 * here.
 */
export function TiktokSignInButton({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = "/api/auth/tiktok";
      }}
      disabled={disabled}
      data-testid="button-tiktok-signin"
      className="w-full h-12 rounded-xl border border-border bg-card font-semibold text-foreground flex items-center justify-center gap-2.5 hover:bg-muted transition-colors disabled:opacity-60"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"
        />
      </svg>
      {t.auth.continue_with_tiktok}
    </button>
  );
}
