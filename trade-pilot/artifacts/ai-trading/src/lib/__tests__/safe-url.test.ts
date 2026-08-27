import { describe, expect, it } from "vitest";
import { safeHttpUrl } from "../safe-url";

// `safeHttpUrl` is the last line of defence in front of an external news
// feed (newsmaker.id + Yahoo Finance). If a hostile or compromised feed
// ever serves a `javascript:` / `data:` URL, this function MUST return
// null so the row degrades to plain text instead of executing on click.
describe("safeHttpUrl", () => {
  it("accepts plain http and https URLs and returns the parsed form", () => {
    expect(safeHttpUrl("https://example.com/article")).toBe(
      "https://example.com/article",
    );
    expect(safeHttpUrl("http://news.example.com/x?id=1")).toBe(
      "http://news.example.com/x?id=1",
    );
  });

  it("rejects javascript: URLs (XSS vector)", () => {
    expect(safeHttpUrl("javascript:alert(1)")).toBeNull();
    // Mixed case + leading whitespace — `new URL` normalizes both.
    expect(safeHttpUrl("  JavaScript:alert(1)")).toBeNull();
  });

  it("rejects data: URLs (can carry HTML/script payloads)", () => {
    expect(safeHttpUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeHttpUrl("data:image/svg+xml;base64,PHN2Zy8+")).toBeNull();
  });

  it("rejects other non-http schemes (file:, vbscript:, ftp:, mailto:)", () => {
    expect(safeHttpUrl("file:///etc/passwd")).toBeNull();
    expect(safeHttpUrl("vbscript:msgbox(1)")).toBeNull();
    expect(safeHttpUrl("ftp://example.com/x")).toBeNull();
    expect(safeHttpUrl("mailto:a@b.c")).toBeNull();
  });

  it("rejects malformed input that throws inside `new URL`", () => {
    expect(safeHttpUrl("not a url")).toBeNull();
    expect(safeHttpUrl("://broken")).toBeNull();
    expect(safeHttpUrl("")).toBeNull();
  });

  it("returns null for null/undefined without throwing", () => {
    expect(safeHttpUrl(null)).toBeNull();
    expect(safeHttpUrl(undefined)).toBeNull();
  });
});
