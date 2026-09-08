import { BookOpen } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AnalysisGuideLink({
  article,
  compact = false,
  className,
}: {
  article: string;
  compact?: boolean;
  className?: string;
}) {
  const { lang } = useTranslation();
  const label = lang === "id" ? "Buka penjelasan lengkap" : "Open full explanation";
  // Remember where the reader came from so the guide article's back button can
  // return them to this analysis session instead of the guide index.
  const returnTo =
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "";
  const href =
    `/guide?category=analysis-manual&article=${encodeURIComponent(article)}` +
    (returnTo ? `&return=${encodeURIComponent(returnTo)}` : "");
  return (
    <a
      href={href}
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact && "min-h-7 px-1.5 text-[11px]",
        className,
      )}
      aria-label={label}
      data-testid={`analysis-guide-link-${article}`}
    >
      <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{compact ? (lang === "id" ? "Pelajari" : "Learn") : label}</span>
    </a>
  );
}