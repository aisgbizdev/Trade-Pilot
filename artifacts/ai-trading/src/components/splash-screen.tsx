import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { BrandLogo } from "@/components/brand-logo";

const STORAGE_KEY = "tp_splash_shown_at";
const REPEAT_AFTER_MS = 30 * 60 * 1000;
const VISIBLE_MS = 1100;
const FADE_MS = 350;

function shouldShowOnLoad(): boolean {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const last = Number(raw);
    if (!Number.isFinite(last)) return true;
    return Date.now() - last > REPEAT_AFTER_MS;
  } catch {
    return true;
  }
}

type Size = "phone" | "tablet" | "desktop";

function detectSize(): Size {
  if (typeof window === "undefined") return "phone";
  const w = Math.min(window.innerWidth, window.innerHeight);
  if (w >= 900) return "desktop";
  if (w >= 600) return "tablet";
  return "phone";
}

export function SplashScreen() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(() => shouldShowOnLoad());
  const [fading, setFading] = useState(false);
  const [size, setSize] = useState<Size>(() => detectSize());

  useEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // sessionStorage might be unavailable in some embedded views
    }
    setSize(detectSize());
    const fadeTimer = window.setTimeout(() => setFading(true), VISIBLE_MS);
    const hideTimer = window.setTimeout(
      () => setVisible(false),
      VISIBLE_MS + FADE_MS,
    );
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  const dims =
    size === "desktop"
      ? { logo: 168, title: 48, tagline: 18, taglineMaxW: 480, gap: 32, footer: 12 }
      : size === "tablet"
        ? { logo: 132, title: 38, tagline: 16, taglineMaxW: 380, gap: 28, footer: 11 }
        : { logo: 96, title: 28, tagline: 13, taglineMaxW: 280, gap: 24, footer: 10 };

  return (
    <div
      data-testid="splash-screen"
      data-size={size}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: `${dims.gap}px`,
        padding: "24px",
        paddingTop: "max(24px, env(safe-area-inset-top))",
        paddingBottom: "max(24px, env(safe-area-inset-bottom))",
        background:
          "linear-gradient(135deg, #0b1220 0%, #1a1f3a 60%, #0b1220 100%)",
        color: "#ffffff",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <BrandLogo
        style={{ width: dims.logo, height: dims.logo }}
        data-testid="splash-logo"
      />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: dims.title,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          <span
            style={{
              background:
                "linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Trade
          </span>
          <span style={{ color: "#ffffff" }}> Pilot</span>
        </div>
        <div
          data-testid="splash-tagline"
          style={{
            marginTop: 10,
            fontSize: dims.tagline,
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.72)",
            maxWidth: dims.taglineMaxW,
          }}
        >
          {t.brand.tagline}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "max(24px, env(safe-area-inset-bottom))",
          fontSize: dims.footer,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {t.brand.supported_by} Newsmaker.id
      </div>
    </div>
  );
}
