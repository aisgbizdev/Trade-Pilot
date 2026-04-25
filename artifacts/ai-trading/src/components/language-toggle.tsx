import { useTranslation, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useTranslation();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "id" : "en")}
      aria-label={lang === "en" ? "Switch to Indonesian" : "Beralih ke Bahasa Inggris"}
      data-testid="button-language-toggle"
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-all text-xs font-medium text-foreground",
        className
      )}
    >
      <span className="text-base leading-none" aria-hidden>
        {lang === "en" ? "🇮🇩" : "🇺🇸"}
      </span>
      <span className="text-[11px] font-semibold text-muted-foreground">
        {lang === "en" ? "ID" : "EN"}
      </span>
    </button>
  );
}
