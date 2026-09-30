import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  label?: string;
  className?: string;
  contentClassName?: string;
  testId?: string;
  inline?: boolean;
};

/** Optional context stays accessible, but does not compete with the main result. */
export function ExpandableExplanation({
  children, label, className, contentClassName, testId, inline = false,
}: Props) {
  const { lang } = useTranslation();
  // Only opt in for known short copy. Never infer safety from length: AI text
  // and trading caveats can contain a critical warning in a single sentence.
  if (inline) {
    return (
      <div className={cn("text-xs leading-relaxed text-muted-foreground", className, contentClassName)} data-testid={testId}>
        {children}
      </div>
    );
  }
  return (
    <details className={cn("group/explanation text-xs", className)} data-testid={testId}>
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-md py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        <span>{label ?? (lang === "id" ? "Lihat penjelasan" : "Show explanation")}</span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open/explanation:rotate-180" aria-hidden="true" />
      </summary>
      <div className={cn("pt-1 text-xs leading-relaxed text-muted-foreground", contentClassName)}>
        {children}
      </div>
    </details>
  );
}