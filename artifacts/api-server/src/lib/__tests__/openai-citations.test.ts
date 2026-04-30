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
import { describe, expect, it } from "vitest";

import { validateFundamentalCitations } from "../openai";
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
