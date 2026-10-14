import { WhatsAppGlyph, buildWhatsAppSupportUrl } from "./topup-flow";
import { useTranslation } from "@/lib/i18n";
import { useTrackOutbound } from "@/hooks/use-track-outbound";

/**
 * Site-wide customer-service entry point — floating WhatsApp button shown
 * on every page via <Layout> (and on the public landing page separately,
 * since that one doesn't use <Layout>). Previously lived only on /topup
 * for payment-issue support; broadened per request (chat 2026-10-14) to
 * cover general CS, not just top-up.
 */
export function WhatsAppSupportFab({ placement }: { placement: "layout-footer" | "landing-footer" }) {
  const { t } = useTranslation();
  const trackOutbound = useTrackOutbound();

  return (
    <a
      href={buildWhatsAppSupportUrl(t.support_chat.message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackOutbound(placement, "whatsapp-support")}
      className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 active:scale-95"
      style={{
        marginBottom: "env(safe-area-inset-bottom, 0px)",
        marginRight: "env(safe-area-inset-right, 0px)",
      }}
      data-testid="button-whatsapp-fab"
      aria-label={t.support_chat.cta}
      title={t.support_chat.cta}
    >
      <WhatsAppGlyph className="h-7 w-7" />
    </a>
  );
}
