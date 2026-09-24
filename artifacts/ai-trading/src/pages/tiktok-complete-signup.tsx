import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { Loader2, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useGetTiktokPendingSignup,
  getGetTiktokPendingSignupQueryKey,
  useCompleteTiktokSignup,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { BrandLogo } from "@/components/brand-logo";

// Landed here from GET /api/auth/tiktok/callback for a brand-new TikTok
// sign-in — TikTok's Login Kit never returns an email, so the account
// couldn't be created yet at callback time. The pending TikTok profile
// lives server-side (see lib/pending-tiktok-signup.ts), keyed by a token
// in a short-lived httpOnly cookie this page never reads directly; it
// only asks the server for a friendly display name via
// GET /api/auth/tiktok/pending-signup and then submits the email here.
// Fixed, safe deep link used only for the "session expired" case reached
// from the mobile OAuth flow — see the `?mobile=1` handling below. Every
// OTHER mobile redirect (success code, or an error discovered while a
// pending-signup row still exists) uses the real mobileRedirectUrl the
// backend returns, built from that flow's own already-allowlisted
// redirect_uri; this one is a last resort for when the row itself is gone
// and the backend has nothing left to redirect to.
const MOBILE_SIGNUP_EXPIRED_DEEP_LINK = "id.tradepilot.app://auth/callback?error=signup_expired";

export default function TiktokCompleteSignupPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set by the backend's mobile OAuth callback when it redirects here
  // (GET /auth/tiktok/callback -> .../complete-signup?mobile=1) for a
  // brand-new TikTok sign-in reached via the Flutter app instead of the
  // website — see lib/mobile-oauth.ts.
  const isMobileFlow = new URLSearchParams(window.location.search).get("mobile") === "1";

  const pending = useGetTiktokPendingSignup({
    query: { queryKey: getGetTiktokPendingSignupQueryKey(), retry: false },
  });
  const completeSignup = useCompleteTiktokSignup();

  // A 404 means the pending-signup cookie is missing/expired/already used
  // — the only way forward is to restart the TikTok login from scratch.
  const pendingExpired = pending.isError;

  useEffect(() => {
    if (pendingExpired) {
      toast({
        title: t.auth.tiktok_signup_expired_title,
        description: t.auth.tiktok_signup_expired_desc,
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingExpired]);

  const schema = z.object({
    email: z.string().email(t.auth.tiktok_email_invalid),
  });
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await completeSignup.mutateAsync({ data: { email: values.email } });
      // Mobile OAuth flow: no session was created (see routes/auth.ts) —
      // hand the browser back to the app with its one-time exchange code
      // instead of landing on the web dashboard.
      if (result.mobileRedirectUrl) {
        window.location.href = result.mobileRedirectUrl;
        return;
      }
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      setLocation("/dashboard");
    } catch (err: unknown) {
      const apiErr = err as { status?: number; data?: { error?: string; mobileRedirectUrl?: string } };
      if (apiErr?.data?.mobileRedirectUrl) {
        window.location.href = apiErr.data.mobileRedirectUrl;
        return;
      }
      toast({
        title: t.auth.tiktok_signup_failed,
        description:
          apiErr?.status === 409
            ? t.auth.tiktok_email_taken
            : apiErr?.data?.error ?? t.auth.login_connection_error,
        variant: "destructive",
      });
    }
  };

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
            <h1 className="text-2xl font-extrabold text-white mb-1" data-testid="text-tiktok-signup-title">
              {pending.data?.displayName
                ? t.auth.tiktok_signup_greeting.replace("{name}", pending.data.displayName)
                : t.auth.tiktok_signup_title}
            </h1>
            <p className="text-sm text-slate-200">{t.auth.tiktok_signup_subtitle}</p>
          </div>
        </div>

        <div className="flex-1 px-6 py-8 -mt-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
            {pendingExpired ? (
              <div className="text-center py-4 space-y-3" data-testid="text-tiktok-signup-expired">
                <p className="text-sm text-muted-foreground">{t.auth.tiktok_signup_expired_desc}</p>
                {isMobileFlow ? (
                  // The pending-signup row is gone, so the backend has no
                  // mobile transaction to build a real redirect from (see
                  // POST /auth/tiktok/complete-signup) — this fixed deep
                  // link is the one case that isn't the flow's own
                  // already-allowlisted redirect_uri, used only here as a
                  // last resort so the user isn't stranded in the browser.
                  <a
                    href={MOBILE_SIGNUP_EXPIRED_DEEP_LINK}
                    className="block text-sm text-primary font-semibold hover:underline"
                    data-testid="link-back-to-app"
                  >
                    {t.auth.tiktok_back_to_app}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLocation("/login")}
                    className="text-sm text-primary font-semibold hover:underline"
                    data-testid="link-back-to-login"
                  >
                    {t.auth.tiktok_back_to_login}
                  </button>
                )}
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-tiktok-complete-signup">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {t.auth.username_email_label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder={t.auth.username_placeholder}
                            autoComplete="email"
                            data-testid="input-tiktok-signup-email"
                            className="h-12 rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl btn-premium font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
                    disabled={completeSignup.isPending || pending.isLoading}
                    data-testid="button-submit-tiktok-signup"
                  >
                    {completeSignup.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    {t.auth.tiktok_signup_submit}
                  </button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
