import { useState } from "react";
import { ChevronLeft, BookOpen, Clock, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { MINDSET_MODULES, type MindsetModule, type MindsetBlock } from "@/lib/mindset-modules";
import { cn } from "@/lib/utils";

function renderBlock(block: MindsetBlock, lang: "en" | "id", idx: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={idx} className="text-sm text-foreground/90 leading-relaxed">
          {lang === "id" ? block.id : block.en}
        </p>
      );
    case "h":
      return (
        <h3 key={idx} className="text-sm font-bold text-foreground mt-3">
          {lang === "id" ? block.id : block.en}
        </h3>
      );
    case "list":
      return (
        <ul key={idx} className="space-y-1.5 list-disc pl-5">
          {(lang === "id" ? block.id : block.en).map((item, i) => (
            <li key={i} className="text-sm text-foreground/90 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div
          key={idx}
          className="rounded-lg border-l-2 border-primary bg-primary/[0.06] px-3 py-2"
        >
          <p className="text-sm text-foreground/90 leading-relaxed italic">
            {lang === "id" ? block.id : block.en}
          </p>
        </div>
      );
  }
}

function ModuleView({ module, onBack }: { module: MindsetModule; onBack: () => void }) {
  const { t, lang } = useTranslation();
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        data-testid="button-mindset-back-to-list"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {t.mindset.back_to_list}
      </button>
      <header className="space-y-1.5">
        <h1 className="text-xl font-bold text-foreground leading-tight">
          {lang === "id" ? module.title_id : module.title_en}
        </h1>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>
            {module.read_minutes} {t.mindset.minutes_read}
          </span>
        </div>
      </header>
      <div className="space-y-3">
        {module.blocks.map((b, i) => renderBlock(b, lang, i))}
      </div>
    </div>
  );
}

export default function MindsetPage() {
  const { t, lang } = useTranslation();
  const [, setLocation] = useLocation();
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = activeId ? MINDSET_MODULES.find((m) => m.id === activeId) : null;

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4 md:max-w-3xl md:mx-auto lg:max-w-none">
        {!active ? (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation("/profile")}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                data-testid="button-mindset-back-to-profile"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  {t.mindset.title}
                </h1>
                <p className="text-xs text-muted-foreground">{t.mindset.subtitle}</p>
              </div>
            </div>
            <div className="space-y-2">
              {MINDSET_MODULES.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  data-testid={`mindset-module-${m.id}`}
                  className="w-full text-left rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <Card className="p-3 hover:border-primary/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                          "bg-primary/10 text-primary",
                        )}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-foreground leading-snug">
                          {lang === "id" ? m.title_id : m.title_en}
                        </h2>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-1">
                          {lang === "id" ? m.summary_id : m.summary_en}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                          <Clock className="w-2.5 h-2.5" />
                          <span>
                            {m.read_minutes} {t.mindset.minutes_read}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </Card>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed pt-2">
              {t.mindset.disclaimer}
            </p>
          </>
        ) : (
          <ModuleView module={active} onBack={() => setActiveId(null)} />
        )}
      </div>
    </Layout>
  );
}
