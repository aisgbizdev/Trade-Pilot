import { describe, expect, it } from "vitest";

import { GUIDE_CATEGORIES, type GuideArticle } from "./guide-content";

const articles = GUIDE_CATEGORIES.flatMap((category) => category.articles);

function article(id: string): GuideArticle {
  const match = articles.find((item) => item.id === id);
  if (!match) throw new Error(`Missing guide article: ${id}`);
  return match;
}

function text(items: GuideArticle["content_en"]): string {
  return items
    .flatMap((block) => (block.type === "list" ? block.val : [block.val]))
    .join(" ");
}

describe("guide content for current features", () => {
  it("keeps article IDs unique and English/Indonesian content populated", () => {
    expect(new Set(articles.map((item) => item.id)).size).toBe(articles.length);

    for (const item of articles) {
      expect(item.content_en.length).toBeGreaterThan(0);
      expect(item.content_id.length).toBeGreaterThan(0);
      expect(item.keywords.length).toBeGreaterThan(0);
    }
  });

  it("documents timeframe risk comparison in both languages", () => {
    const riskMap = article("timeframe-risk-map");

    expect(text(riskMap.content_en)).toContain("Use & Analyze");
    expect(text(riskMap.content_en)).toContain("insufficient data");
    expect(text(riskMap.content_id)).toContain("Gunakan & Analisis");
    expect(text(riskMap.content_id)).toContain("data tidak cukup");
    expect(riskMap.keywords).toContain("Bandingkan Risiko");
  });

  it("documents the current chart controls and visual language", () => {
    const chart = article("levels-chart");
    const english = text(chart.content_en);
    const indonesian = text(chart.content_id);

    expect(english).toContain("BUY entry is cyan");
    expect(english).toContain("SELL levels are dashed");
    expect(english).toContain("RESET");
    expect(indonesian).toContain("mode Keduanya");
    expect(indonesian).toContain("running price");
  });

  it("explains the separate chart, Standard level, and Adaptive summary sharing actions in both languages", () => {
    const chart = article("levels-chart");
    const standard = article("standard-plan");
    const adaptive = article("adaptive-position-plan");

    expect(text(chart.content_en)).toContain("Share chart and choose Copy analysis image or Save PNG");
    expect(text(chart.content_id)).toContain("Bagikan grafik lalu pilih Salin gambar analisis atau Simpan PNG");
    expect(text(standard.content_en)).toContain("Copy levels sits beside Rationale");
    expect(text(standard.content_id)).toContain("Salin level berada sejajar dengan Alasan");
    expect(text(adaptive.content_en)).toContain("Conditional scenario · not actionable now");
    expect(text(adaptive.content_en)).toContain("Share plan and choose Copy plan image or Save PNG");
    expect(text(adaptive.content_id)).toContain("Skenario kondisional · belum dapat ditindaklanjuti");
    expect(text(adaptive.content_id)).toContain("Bagikan plan lalu pilih Salin gambar plan atau Simpan PNG");
    expect(text(adaptive.content_id)).toContain("bukan grafik atau penjelasan panjang");
    expect(chart.keywords).toContain("bagikan grafik");
    expect(standard.keywords).toContain("salin level");
    expect(adaptive.keywords).toContain("bagikan plan");
  });

  it("documents private discipline progression without outcome-based XP", () => {
    const progression = article("personal-progression");
    const english = text(progression.content_en);
    const indonesian = text(progression.content_id);

    expect(english).toContain("levels 1–100");
    expect(english).toContain("no leaderboard");
    expect(indonesian).toContain("batas harian");
    expect(indonesian).toContain("XP tidak diberikan dari profit");
  });

  it("makes the latest feature terms searchable through glossary keywords", () => {
    const glossary = article("terms");

    expect(glossary.keywords).toEqual(
      expect.arrayContaining([
        "Peta Risiko Timeframe",
        "Keduanya",
        "running price",
        "XP",
        "Mastery",
        "Riwayat XP",
      ]),
    );
  });
});