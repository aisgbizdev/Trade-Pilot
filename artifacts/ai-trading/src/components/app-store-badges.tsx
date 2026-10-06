import { useTranslation } from "@/lib/i18n";
import { useTrackOutbound } from "@/hooks/use-track-outbound";
import { cn } from "@/lib/utils";
import type { OutboundClickBodyPlacement } from "@workspace/api-client-react";

const APP_STORE_URL = "https://apps.apple.com/id/app/tradepilot-id/id6807276937";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=id.tradepilot.app&pcampaignid=web_share";

// The real Apple logomark (not lucide-react's generic "apple" fruit icon,
// which doesn't read as the actual brand) — same inline-SVG-for-brand-
// fidelity approach as WhatsAppGlyph in topup-flow.tsx.
function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.63-3.333c.843-1.012 1.4-2.427 1.245-3.833-1.207.052-2.662.805-3.532 1.817-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.698z" />
    </svg>
  );
}

// lucide-react has no Google Play mark — this is a simplified recreation of
// the triangular "play" shape with the four brand-associated hues (blue /
// green / yellow / red), not a pixel-exact trace of the official glyph.
function GooglePlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="google-play-glyph-gradient" x1="3" y1="2" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00D2FF" />
          <stop offset="0.45" stopColor="#1BE07D" />
          <stop offset="0.72" stopColor="#FFD24D" />
          <stop offset="1" stopColor="#FF3B4E" />
        </linearGradient>
      </defs>
      <path
        d="M4 2.65c0-.52.56-.84 1.01-.58l14.6 8.35a.67.67 0 0 1 0 1.16L5.01 19.93A.67.67 0 0 1 4 19.35V2.65Z"
        fill="url(#google-play-glyph-gradient)"
      />
    </svg>
  );
}

/**
 * Standard App Store / Google Play badge pair, linking straight to the
 * published TradePilot.id listings. `placement` feeds the same outbound-
 * click analytics every other external link on these pages already uses
 * (see useTrackOutbound) — pass the page-specific slug so clicks from the
 * landing page and the profile page are distinguishable in reporting.
 */
export function AppStoreBadges({
  placement,
  className,
  size = "default",
}: {
  placement: OutboundClickBodyPlacement;
  className?: string;
  /** "compact" trims height/padding/text for tight spots like a footer. */
  size?: "default" | "compact";
}) {
  const { t } = useTranslation();
  const trackOutbound = useTrackOutbound();
  const compact = size === "compact";

  return (
    <div className={cn("flex flex-wrap items-center", compact ? "gap-2" : "gap-3", className)}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackOutbound(placement, "app-store")}
        className={cn(
          "inline-flex items-center rounded-xl border border-white/15 bg-black text-white transition-opacity hover:opacity-85",
          compact ? "h-9 gap-1.5 px-2.5" : "h-12 gap-2.5 px-4",
        )}
        data-testid="link-download-app-store"
      >
        <AppleGlyph className={cn("shrink-0", compact ? "h-4 w-4" : "h-6 w-6")} />
        <span className="flex flex-col leading-tight">
          {!compact && <span className="text-[10px]">{t.download_app.app_store_eyebrow}</span>}
          <span className={cn("font-semibold", compact ? "text-xs -mt-0" : "text-base -mt-0.5")}>
            {t.download_app.app_store_name}
          </span>
        </span>
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackOutbound(placement, "play-store")}
        className={cn(
          "inline-flex items-center rounded-xl border border-white/15 bg-black text-white transition-opacity hover:opacity-85",
          compact ? "h-9 gap-1.5 px-2.5" : "h-12 gap-2.5 px-4",
        )}
        data-testid="link-download-play-store"
      >
        <GooglePlayGlyph className={cn("shrink-0", compact ? "h-4 w-4" : "h-6 w-6")} />
        <span className="flex flex-col leading-tight">
          {!compact && <span className="text-[10px] tracking-wide">{t.download_app.play_store_eyebrow}</span>}
          <span className={cn("font-semibold", compact ? "text-xs -mt-0" : "text-base -mt-0.5")}>
            {t.download_app.play_store_name}
          </span>
        </span>
      </a>
    </div>
  );
}
