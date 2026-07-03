import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function LandingFaq() {
  const { t } = useTranslation();
  const l = t.landing;
  const [open, setOpen] = useState<number | null>(null);

  const items = [
    { q: l.faq_q1, a: l.faq_a1 },
    { q: l.faq_q2, a: l.faq_a2 },
    { q: l.faq_q3, a: l.faq_a3 },
    { q: l.faq_q4, a: l.faq_a4 },
    { q: l.faq_q5, a: l.faq_a5 },
  ];

  const toggle = (idx: number) => setOpen(open === idx ? null : idx);

  return (
    <section
      className="px-4 pb-10"
      data-testid="section-faq"
    >
      <h2 className="text-base font-bold text-foreground mb-3">{l.faq_title}</h2>

      <div className="space-y-2">
        {items.map(({ q, a }, idx) => {
          const isOpen = open === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border bg-card overflow-hidden transition-colors ${
                isOpen ? "border-amber-400/40" : "border-border"
              }`}
              data-testid={`faq-item-${idx}`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium text-foreground leading-snug">{q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-amber-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3 border-t border-border/50">
                  <p className="text-[13px] text-muted-foreground leading-relaxed pt-2.5">{a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
