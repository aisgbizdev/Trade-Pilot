import { useState } from "react";
import { BellRing, Download, Share, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { usePush } from "@/hooks/use-push";
import { useStandalone } from "@/hooks/use-standalone";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

const DISMISS_KEY = "tp_enable_push_dismissed";

/**
 * Top-of-feed nudge that turns silent push subscribers into installed
 * PWA users with OS-level pop-ups. Renders only when the browser is
 * push-capable AND the user has not already subscribed AND has not
 * dismissed the card. Dismissal is sticky in localStorage — we never
 * pop this back up unattended once they have closed it.
 *
 * Critically, we never auto-call `Notification.requestPermission()` on
 * mount. Chrome flags sites that prompt without a user gesture as
 * spammy and quietly drops their permission UI for 30 days; the
 * permission dialog only fires when the user explicitly taps "Enable".
 *
 * On iOS Safari (push only works for installed PWAs) we surface the
 * "Share → Add to Home Screen" recipe instead. On Android Chrome we
 * also surface the standard `beforeinstallprompt` install button when
 * available.
 */
export function EnablePushCard() {
  const { t } = useTranslation();
  const { state, subscribe } = usePush();
  const { standalone, isIos } = useStandalone();
  const { canInstall, prompt } = useInstallPrompt();

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;
  // Already subscribed → user is done, no nudge needed.
  if (state === "subscribed") return null;
  // Browser blocked permission at the OS level. Re-prompting is useless
  // and the Notifications page already explains how to re-enable in
  // site settings, so stay out of the way.
  if (state === "denied") return null;

  // iOS Safari in a regular tab: push only works after Add to Home
  // Screen. Show the visual recipe instead of an "Enable" button that
  // would just silently fail.
  const isIosNeedsInstall = isIos && !standalone;
  // Push genuinely unsupported (desktop Safari pre-16, etc.) AND not on
  // iOS — nothing useful to offer.
  if (state === "unsupported" && !isIosNeedsInstall) return null;

  const installable = canInstall && !standalone;
  const requesting = state === "requesting";
  const showError = state === "error";

  return (
    <div
      className="relative rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/10 p-4"
      data-testid="card-enable-push"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors"
        aria-label={t.push.dismiss_aria}
        data-testid="button-dismiss-enable-push"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
          <BellRing className="w-5 h-5 text-[#1a1208]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground leading-tight">
            {t.push.enable_card_title}
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {t.push.enable_card_desc}
          </p>

          {isIosNeedsInstall ? (
            <div className="mt-3 space-y-1.5 text-xs text-foreground" data-testid="ios-install-steps">
              <p className="font-semibold">{t.push.ios_install_title}</p>
              <ol className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5 text-primary shrink-0" />
                  {t.push.ios_step_share}
                </li>
                <li className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-primary shrink-0" />
                  {t.push.ios_step_add}
                </li>
                <li className="flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-primary shrink-0" />
                  {t.push.ios_step_open}
                </li>
              </ol>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {installable && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void prompt();
                  }}
                  data-testid="button-install-pwa"
                  className="gap-1.5 h-8"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.push.install_btn}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  void subscribe();
                }}
                disabled={requesting}
                data-testid="button-enable-push"
                className="gap-1.5 h-8"
              >
                {requesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.push.enable_btn_loading}
                  </>
                ) : (
                  <>
                    <BellRing className="w-3.5 h-3.5" />
                    {t.push.enable_btn}
                  </>
                )}
              </Button>
            </div>
          )}

          {showError && (
            <p className="mt-2 text-xs text-destructive" data-testid="text-enable-push-error">
              {t.push.enable_error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
