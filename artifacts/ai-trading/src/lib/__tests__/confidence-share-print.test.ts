import { describe, expect, it } from "vitest";
import { buildConfidencePrintHtml, type ConfidenceShareData } from "../confidence-share";

describe("printable analysis guide", () => {
  it("typesets the saved snapshot, briefing, narrative and safety note for A4 without injecting HTML", () => {
    const data: ConfidenceShareData = {
      title: "Panduan analisis & plan Adaptive",
      instrument: "XAU/USD",
      timeframe: "1h",
      analyzedAt: "27 Sep 2026, 10.00",
      summary: "Tunggu konfirmasi.\nCek batas risiko.",
      sections: [{
        title: "Kenapa analisis ini?",
        body: "Risiko\nJangan abaikan invalidation.",
        blocks: [
          { kind: "subheading", text: "Risiko" },
          { kind: "paragraph", text: "Level **2300** belum valid; <img src=x onerror=alert(1)>" },
          { kind: "item", text: "Cek *Stop Loss*." },
        ],
      }],
      sourcesTitle: "Sumber",
      sources: [
        { label: "Rilis resmi", url: "https://example.com/report?a=1&b=2" },
        { label: "Tautan tidak aman", url: "javascript:alert(1)" },
      ],
      disclaimerTitle: "Catatan penting",
      disclaimer: "Bukan jaminan profit atau order otomatis.",
      visit: {
        title: "Lanjutkan di TradePilot.id",
        url: "https://tradepilot.id",
        storesNote: "Tautan toko resmi tersedia melalui situs saat dirilis.",
      },
    };
    const html = buildConfidencePrintHtml(data, {
      lang: "id", printLabel: "Cetak / simpan PDF", briefLabel: "Ringkasan briefing",
      chart: {
        title: "Grafik analisis",
        caption: "Candle sebelum analisis, bukan harga live.",
        src: "data:image/png;base64,UE5H",
      },
    });
    expect(html).toContain("@page { size: A4");
    expect(html).toContain("<h1>Panduan analisis &amp; plan Adaptive</h1>");
    expect(html).toContain("27 Sep 2026, 10.00");
    expect(html).toContain("Ringkasan briefing");
    expect(html).toContain('class="watermark" aria-hidden="true">TradePilot.id</div>');
    expect(html).toContain("TradePilot.id · XAU/USD · 27 Sep 2026, 10.00");
    expect(html).toContain('href="https://tradepilot.id"');
    expect(html).toContain("Tautan toko resmi tersedia melalui situs saat dirilis.");
    expect(html).toContain('<img src="data:image/png;base64,UE5H"');
    expect(html).toContain("<h2>Kenapa analisis ini?</h2>");
    expect(html).toContain("<h3>Risiko</h3>");
    expect(html).toContain("<strong>2300</strong>");
    expect(html).toContain("<em>Stop Loss</em>");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain('href="https://example.com/report?a=1&amp;b=2"');
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("Bukan jaminan profit atau order otomatis.");
    expect(html).toContain("<strong>Catatan penting</strong>");
    expect(html).toContain('onclick="window.print()"');
    expect(buildConfidencePrintHtml(data, {
      lang: "id", printLabel: "Cetak", briefLabel: "Ringkasan",
      chart: { title: "Grafik analisis", caption: "Bukan live", unavailable: "Grafik lama tidak tersedia." },
    })).toContain("Grafik lama tidak tersedia.");
    expect(() => buildConfidencePrintHtml(data, {
      lang: "id", printLabel: "Cetak", briefLabel: "Ringkasan",
      chart: { title: "Grafik", caption: "Bukan live", src: "javascript:alert(1)" },
    })).toThrow("Invalid chart image");
  });
});