import { useState } from "react";
import { BellRing, Download, Share, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { usePush } from "@/hooks/use-push";
import { useStandalone } from "@/hooks/use-standalone";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

const DISMISS_KEY = "tp_enable_push_dismissed";

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

  // iOS Safari in a regular tab: push only works once the app is added
  // to the Home Screen, so swap the Enable button for the recipe.
  const isIosNeedsInstall = isIos && !standalone;

  // Only render for unsubscribed-but-eligible states. Anything else
  // (subscribed, denied, unsupported on non-iOS) is an explicit hide.
  const eligible =
    state === "idle" ||
    state === "unsubscribed" ||
    state === "requesting" ||
    state === "error" ||
    (state === "unsupported" && isIosNeedsInstall);
  if (!eligible) return null;

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
