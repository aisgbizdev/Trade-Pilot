/**
 * Unit tests for `validateFundamentalCitations` in `lib/openai.ts`.
 *
 * The validator is the gate that turns task #88 from "looks plausible"
 * into "actually grounded": when the input snapshot has real news /
 * calendar items, the model MUST cite at least one of them, and any
 * cited title MUST be present in the snapshot (substring or token
 * overlap). Without this gate the model can drift back to generic
 * fundamental prose that ignores the live feed.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  generateAnalysis,
  openai,
  validateFundamentalCitations,
} from "../openai";
import type { NewsItem } from "../news";
import type { CalendarEvent } from "../calendar";

function newsItem(title: string): NewsItem {
  return {
    id: `mock-${title}`,
    title,
    summary: "",
    source: "Newsmaker.id",
    url: null,
    publishedAt: "2026-04-30T10:00:00Z",
  };
}

function calEvent(event: string, currency = "USD"): CalendarEvent {
  return {
    date: "2026-04-30",
    time: "12:00",
    currency,
    event,
    impact: "★★★",
    actual: null,
    forecast: null,
    previous: null,
  };
}

describe("validateFundamentalCitations", () => {
  it("ok when snapshot is empty AND citations are empty", () => {
    const r = validateFundamentalCitations(
      { newsTitles: [], calendarEvents: [] },
      { newsItems: [], calendarEvents: [] },
    );
    expect(r.ok).toBe(true);
  });

  it("rejects fabricated citations against an empty snapshot", () => {
    const r = validateFundamentalCitations(
      { newsTitles: ["Made-up Fed speech"], calendarEvents: [] },
      { newsItems: [], calendarEvents: [] },
    );
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/fabricated/i);
  });

  it("REJECTS empty citations when snapshot is non-empty (the missing grounding)", () => {
    const r = validateFundamentalCitations(
      { newsTitles: [], calendarEvents: [] },
      {
        newsItems: [newsItem("Gold rallies on Fed pause")],
        calendarEvents: [calEvent("FOMC statement")],
      },
    );
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/no fundamentalCitations/i);
  });

  it("REJECTS missing citations object when snapshot is non-empty", () => {
    const r = validateFundamentalCitations(undefined, {
      newsItems: [newsItem("Gold rallies on Fed pause")],
      calendarEvents: [],
    });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/no fundamentalCitations/i);
  });

  it("accepts a cited news title that substring-matches the snapshot", () => {
    const r = validateFundamentalCitations(
      { newsTitles: ["Gold rallies"], calendarEvents: [] },
      {
        newsItems: [newsItem("Gold rallies on Fed pause")],
        calendarEvents: [],
      },
    );
    expect(r.ok).toBe(true);
  });

  it("accepts a cited calendar event that substring-matches", () => {
    const r = validateFundamentalCitations(
      { newsTitles: [], calendarEvents: ["FOMC statement USD"] },
      {
        newsItems: [],
        calendarEvents: [calEvent("FOMC statement", "USD")],
      },
    );
    expect(r.ok).toBe(true);
  });

  it("rejects a cited news title that does not appear in the snapshot", () => {
    const r = validateFundamentalCitations(
      { newsTitles: ["Completely unrelated story about cats"], calendarEvents: [] },
      {
        newsItems: [newsItem("Gold rallies on Fed pause")],
        calendarEvents: [],
      },
    );
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/News citation/i);
  });

  it("rejects a cited calendar event that does not appear in the snapshot", () => {
    const r = validateFundamentalCitations(
      { newsTitles: [], calendarEvents: ["ECB press conference EUR"] },
      {
        newsItems: [],
        calendarEvents: [calEvent("FOMC statement", "USD")],
      },
    );
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/Calendar citation/i);
  });
});

/**
 * Integration-flavored tests against `generateAnalysis` itself: we
 * stub `openai.chat.completions.create` to return ungrounded citations
 * and assert that `generateAnalysis` THROWS rather than silently
 * accepting an ungrounded response. Without this, a non-empty
 * snapshot could still produce generic fundamental prose — the failure
 * mode task #88 is built to eliminate.
 */
describe("generateAnalysis — hard grounding gate", () => {
  function ungroundedBeginnerResponse() {
    // Schema-valid beginner output, but empty fundamentalCitations
    // against a non-empty snapshot — must trigger the grounding retry.
    return {
      id: "stub",
      object: "chat.completion",
      created: 0,
      model: "gpt-4o",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              marketCondition: "trending_up",
              riskLevel: "medium",
              confidenceMin: 60,
              confidenceMax: 75,
              tradingBias: "bullish",
              opportunity: "Generic upside opportunity.",
              risk: "Generic downside risk.",
              mainScenario:
                "Pasar kemungkinan melanjutkan kenaikan pada timeframe 30m.",
              alternativeScenario:
                "Jika gagal break, pasar dapat berbalik turun pada 30m.",
              whyReason: "Tren sejajar pada 30m.",
              failureConditions: "Close 30m di bawah swing low.",
              tradePlan: {
                preferredSide: "wait",
                buy: {
                  entryZone: "2300-2310",
                  stopLoss: "2290",
                  takeProfit1: "2330",
                  takeProfit2: "2350",
                  riskRewardRatio: "1:2",
                  rationale: "Stub buy plan.",
                },
                sell: {
                  entryZone: "2360-2370",
                  stopLoss: "2380",
                  takeProfit1: "2340",
                  takeProfit2: "2320",
                  riskRewardRatio: "1:2",
                  rationale: "Stub sell plan.",
                },
              },
              fundamentalCitations: { newsTitles: [], calendarEvents: [] },
            }),
          },
          finish_reason: "stop",
        },
      ],
    };
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when the model returns ungrounded citations even after the corrective retry", async () => {
    const createSpy = vi
      .spyOn(openai.chat.completions, "create")
      // Both the first attempt and the retry return ungrounded
      // citations against a non-empty snapshot.
      .mockResolvedValue(ungroundedBeginnerResponse() as never);

    await expect(
      generateAnalysis(
        "XAU/USD",
        "30m",
        "beginner",
        undefined,
        undefined,
        {
          newsItems: [newsItem("Gold rallies on Fed pause")],
          calendarEvents: [calEvent("FOMC statement", "USD")],
        },
      ),
    ).rejects.toThrow(/grounding failed/i);

    // Two calls — the original + the corrective retry — then we throw.
    expect(createSpy).toHaveBeenCalledTimes(2);
  });
});
