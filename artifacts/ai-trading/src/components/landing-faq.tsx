import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

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
      className="px-4 pb-16"
      data-testid="section-faq"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">{l.faq_title}</h2>

        <div className="space-y-3">
          {items.map(({ q, a }, idx) => {
            const isOpen = open === idx;
            return (
              <motion.div
                key={idx}
                initial={false}
                animate={{
                  borderColor: isOpen ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border) / 0.5)",
                  backgroundColor: isOpen ? "hsl(var(--card) / 0.8)" : "hsl(var(--card) / 0.4)"
                }}
                className="rounded-xl border overflow-hidden backdrop-blur-sm"
                data-testid={`faq-item-${idx}`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/10"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-foreground leading-snug">{q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isOpen ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'}`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1">
                        <div className="w-8 h-px bg-primary/30 mb-4" />
                        <p className="text-[13px] text-muted-foreground leading-relaxed">{a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
