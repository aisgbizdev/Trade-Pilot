import { useTranslation } from "@/lib/i18n";

/**
 * "Continue with Facebook" button. Kicks off the server-side OAuth
 * redirect flow — a plain top-level navigation to `/api/auth/facebook`
 * (proxied to the API server in dev, same-origin in prod), mirroring
 * google-sign-in-button.tsx exactly. The server sets the session cookie
 * and redirects back into the app, so there's nothing to await here.
 */
export function FacebookSignInButton({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = "/api/auth/facebook";
      }}
      disabled={disabled}
      data-testid="button-facebook-signin"
      className="w-full h-12 rounded-xl border border-border bg-card font-semibold text-foreground flex items-center justify-center gap-2.5 hover:bg-muted transition-colors disabled:opacity-60"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
      {t.auth.continue_with_facebook}
    </button>
  );
}
