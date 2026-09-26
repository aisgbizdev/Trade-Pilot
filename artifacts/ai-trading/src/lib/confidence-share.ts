export type ConfidenceShareData = {
  title: string;
  instrument: string;
  timeframe: string;
  analyzedAt: string;
  summary: string;
  sections: {
    title: string;
    body: string;
    blocks?: { kind: "subheading" | "paragraph" | "item"; text: string }[];
  }[];
  sourcesTitle: string;
  sources: { label: string; url?: string }[];
  disclaimerTitle?: string;
  disclaimer: string;
  visit?: { title: string; url: string; storesNote: string };
};

export function buildConfidenceShareText(data: ConfidenceShareData): string {
  return [
    `TradePilot.id — ${data.title}`,
    `${data.instrument} · ${data.timeframe} · ${data.analyzedAt}`,
    "",
    data.summary,
    ...data.sections.flatMap(({ title, body }) => ["", `${title}:`, body]),
    ...(data.sources.length
      ? ["", `${data.sourcesTitle}:`, ...data.sources.map(({ label, url }) => `• ${label}${url ? ` — ${url}` : ""}`)]
      : []),
    "",
    data.disclaimerTitle ? `${data.disclaimerTitle}: ${data.disclaimer}` : data.disclaimer,
    ...(data.visit ? ["", data.visit.title, data.visit.url, data.visit.storesNote] : []),
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function formatPrintBody(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/\r?\n/g, "<br>");
}

export function buildConfidencePrintHtml(
  data: ConfidenceShareData,
  options: {
    lang: "id" | "en";
    printLabel: string;
    briefLabel: string;
    chart?: { title: string; caption: string; src?: string; unavailable?: string };
  },
): string {
  if (options.chart?.src && !/^data:image\/png;base64,[a-zA-Z0-9+/=]+$/.test(options.chart.src)) {
    throw new Error("Invalid chart image");
  }
  if (data.visit && !/^https:\/\/tradepilot\.id\/?$/.test(data.visit.url)) {
    throw new Error("Invalid official site URL");
  }
  const sources = data.sources.map(({ label, url }) => {
    let href: string | null = null;
    if (url) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") href = parsed.href;
      } catch {
        // Never turn an untrusted source URL into a link in the printable document.
      }
    }
    return `<li>${escapeHtml(label)}${href ? ` <a href="${escapeHtml(href)}" rel="noopener noreferrer">${escapeHtml(href)}</a>` : ""}</li>`;
  }).join("");
  return `<!doctype html>
<html lang="${options.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(data.title)} — TradePilot.id</title>
  <style>
    @page { size: A4; margin: 18mm 17mm; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f2f3f5; color: #1d232b; font: 14px/1.62 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .toolbar { max-width: 794px; margin: 20px auto 0; text-align: right; padding: 0 24px; }
    button { border: 0; border-radius: 8px; padding: 10px 18px; background: #a96808; color: white; font: 600 14px system-ui, sans-serif; cursor: pointer; }
    button:focus-visible, a:focus-visible { outline: 3px solid #a96808; outline-offset: 3px; }
    .watermark { position: fixed; z-index: 2; top: 49%; left: 50%; transform: translate(-50%, -50%) rotate(-24deg); color: #806a42; opacity: .1; font-size: clamp(42px, 8vw, 84px); font-weight: 900; letter-spacing: .04em; white-space: nowrap; pointer-events: none; user-select: none; }
    main { max-width: 794px; min-height: 100vh; margin: 16px auto 36px; padding: 48px 56px; background: #fff; box-shadow: 0 6px 30px #1d232b16; }
    .brand { color: #996409; font-size: 12px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
    h1 { margin: 12px 0 6px; font-size: 30px; line-height: 1.18; letter-spacing: -.025em; }
    .meta { color: #55616d; font-size: 13px; font-weight: 600; }
    .summary { margin: 28px 0 30px; padding: 18px 20px; border-left: 4px solid #b68118; background: #faf8f2; font-size: 15px; font-weight: 600; white-space: pre-line; }
    section { margin: 26px 0; break-inside: auto; }
    .chart { break-inside: avoid; }
    .chart img { display: block; width: 100%; max-height: 225mm; object-fit: contain; object-position: left top; }
    .caption { margin: 8px 0 0; color: #55616d; font-size: 12px; font-style: italic; }
    .chart-unavailable { padding: 12px 16px; border-left: 3px solid #b68118; background: #faf8f2; }
    h2 { margin: 0 0 10px; padding-bottom: 7px; border-bottom: 1px solid #d7dce1; color: #19232f; font-size: 17px; line-height: 1.35; break-after: avoid; }
    h3 { margin: 16px 0 5px; font-size: 14px; line-height: 1.4; break-after: avoid; }
    .summary-label { margin-bottom: 6px; color: #7b5208; font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .body { white-space: normal; overflow-wrap: anywhere; }
    .body p { margin: 0 0 9px; white-space: pre-line; }
    .body .item { padding-left: 16px; text-indent: -12px; }
    .body strong { font-weight: 750; }
    .body em { font-style: italic; }
    .sources { margin: 10px 0 0; padding-left: 20px; overflow-wrap: anywhere; }
    a { color: #744c07; text-decoration: underline; }
    .note { margin-top: 34px; padding-top: 14px; border-top: 2px solid #b68118; color: #374151; font-size: 13px; line-height: 1.55; }
    .note strong { display: block; margin-bottom: 4px; color: #19232f; font-size: 14px; }
    .attribution { margin-top: 14px; color: #55616d; font-size: 11px; font-weight: 650; }
    .visit { margin-top: 20px; padding: 14px 18px; border: 1px solid #d7dce1; border-radius: 8px; break-inside: avoid; }
    .visit strong { display: block; margin-bottom: 2px; }
    .visit a { font-weight: 700; }
    .visit p { margin: 6px 0 0; color: #55616d; font-size: 12px; }
    @media print {
      body { background: #fff; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .toolbar { display: none; }
      .watermark { font-size: 68px; }
      main { max-width: none; min-height: 0; margin: 0; padding: 0; box-shadow: none; }
      section, .note { orphans: 3; widows: 3; }
    }
  </style>
</head>
<body>
  <div class="toolbar"><button type="button" onclick="window.print()">${escapeHtml(options.printLabel)}</button></div>
  <div class="watermark" aria-hidden="true">TradePilot.id</div>
  <main>
    <header><div class="brand">TradePilot.id</div><h1>${escapeHtml(data.title)}</h1>
      <div class="meta">${escapeHtml(data.instrument)} · ${escapeHtml(data.timeframe)} · ${escapeHtml(data.analyzedAt)}</div></header>
    <div class="summary"><div class="summary-label">${escapeHtml(options.briefLabel)}</div>${escapeHtml(data.summary)}</div>
    ${options.chart ? `<section class="chart"><h2>${escapeHtml(options.chart.title)}</h2>${
      options.chart.src ? `<img src="${options.chart.src}" alt="${escapeHtml(options.chart.caption)}">` : `<p class="chart-unavailable">${escapeHtml(options.chart.unavailable ?? "")}</p>`
    }<p class="caption">${escapeHtml(options.chart.caption)}</p></section>` : ""}
    ${data.sections.map(({ title, body, blocks }) => `<section><h2>${escapeHtml(title)}</h2><div class="body">${
      blocks?.length
        ? blocks.map(({ kind, text }) => kind === "subheading"
          ? `<h3>${escapeHtml(text)}</h3>`
          : `<p${kind === "item" ? ' class="item"' : ""}>${kind === "item" ? "• " : ""}${formatPrintBody(text)}</p>`).join("")
        : `<p>${formatPrintBody(body)}</p>`
    }</div></section>`).join("\n")}
    ${sources ? `<section><h2>${escapeHtml(data.sourcesTitle)}</h2><ul class="sources">${sources}</ul></section>` : ""}
    <footer class="note">${data.disclaimerTitle ? `<strong>${escapeHtml(data.disclaimerTitle)}</strong>` : ""}${escapeHtml(data.disclaimer)}
      <div class="attribution">TradePilot.id · ${escapeHtml(data.instrument)} · ${escapeHtml(data.analyzedAt)}</div></footer>
    ${data.visit ? `<aside class="visit"><strong>${escapeHtml(data.visit.title)}</strong><a href="${escapeHtml(data.visit.url)}" rel="noopener noreferrer">${escapeHtml(data.visit.url)}</a><p>${escapeHtml(data.visit.storesNote)}</p></aside>` : ""}
  </main>
</body>
</html>`;
}

const WIDTH = 960;
const PADDING = 64;
const TEXT_WIDTH = WIDTH - PADDING * 2;
const FONT_BODY = "21px system-ui, sans-serif";
const FONT_BOLD = "700 19px system-ui, sans-serif";

function wrapText(ctx: CanvasRenderingContext2D, text: string, font: string, width: number): string[] {
  ctx.font = font;
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.trim().split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= width) {
        line = next;
        continue;
      }
      if (line) lines.push(line);
      line = "";
      // Break exceptionally long words/titles instead of clipping the image.
      for (const character of word) {
        if (line && ctx.measureText(line + character).width > width) {
          lines.push(line);
          line = "";
        }
        line += character;
      }
    }
    lines.push(line);
  }
  return lines;
}

export function renderConfidenceSharePng(data: ConfidenceShareData): { blob: Blob; url: string } {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");

  const summary = wrapText(ctx, data.summary, FONT_BODY, TEXT_WIDTH - 48);
  const sections = data.sections.map((section) => ({
    title: section.title,
    lines: wrapText(ctx, section.body, FONT_BODY, TEXT_WIDTH),
  }));
  const sources = data.sources.flatMap(({ label }) => wrapText(ctx, `• ${label}`, FONT_BODY, TEXT_WIDTH));
  const footerLines = [
    ...wrapText(ctx, data.disclaimerTitle ? `${data.disclaimerTitle}: ${data.disclaimer}` : data.disclaimer, "17px system-ui, sans-serif", TEXT_WIDTH),
    ...(data.visit ? ["", ...wrapText(ctx, `${data.visit.title} ${data.visit.url} — ${data.visit.storesNote}`, "17px system-ui, sans-serif", TEXT_WIDTH)] : []),
  ];
  const summaryHeight = 44 + summary.length * 32;
  const sectionsHeight = sections.reduce((height, section) => height + 56 + section.lines.length * 32, 0);
  const sourcesHeight = sources.length ? 56 + sources.length * 32 : 0;
  const footerHeight = 114 + Math.max(0, footerLines.length - 1) * 27;
  const height = 203 + summaryHeight + sectionsHeight + sourcesHeight + footerHeight;
  if (height > 12000) throw new Error("Analysis is too long to render as an image");
  canvas.width = WIDTH;
  canvas.height = height;

  ctx.fillStyle = "#101216";
  ctx.fillRect(0, 0, WIDTH, height);
  ctx.fillStyle = "rgba(232, 173, 43, 0.1)";
  ctx.font = "800 54px system-ui, sans-serif";
  for (let watermarkY = 360; watermarkY < height - footerHeight; watermarkY += 640) {
    ctx.fillText("TradePilot.id", PADDING + 180, watermarkY, TEXT_WIDTH - 180);
  }
  ctx.fillStyle = "#e8ad2b";
  ctx.fillRect(0, 0, WIDTH, 7);
  ctx.font = "700 20px system-ui, sans-serif";
  ctx.fillText("TRADEPILOT.ID", PADDING, 83);
  ctx.font = "700 30px system-ui, sans-serif";
  ctx.fillStyle = "#f7f7f9";
  ctx.fillText(data.title, PADDING, 132, TEXT_WIDTH);
  ctx.font = FONT_BODY;
  ctx.fillStyle = "#aeb1ba";
  ctx.fillText(`${data.instrument} · ${data.timeframe} · ${data.analyzedAt}`, PADDING, 176, TEXT_WIDTH);

  let y = 203;
  ctx.fillStyle = "#1c2028";
  ctx.fillRect(PADDING, y, TEXT_WIDTH, summaryHeight);
  ctx.font = FONT_BODY;
  ctx.fillStyle = "#f7f7f9";
  for (const line of summary) {
    ctx.fillText(line, PADDING + 24, y + 34);
    y += 32;
  }
  y = 203 + summaryHeight + 32;

  for (const section of sections) {
    ctx.fillStyle = "#e8ad2b";
    ctx.font = FONT_BOLD;
    ctx.fillText(section.title, PADDING, y + 18, TEXT_WIDTH);
    y += 40;
    ctx.fillStyle = "#d5d7dd";
    ctx.font = FONT_BODY;
    for (const line of section.lines) {
      ctx.fillText(line, PADDING, y + 18);
      y += 32;
    }
    y += 16;
  }
  if (sources.length) {
    ctx.fillStyle = "#e8ad2b";
    ctx.font = FONT_BOLD;
    ctx.fillText(data.sourcesTitle, PADDING, y + 18, TEXT_WIDTH);
    y += 40;
    ctx.fillStyle = "#d5d7dd";
    ctx.font = FONT_BODY;
    for (const line of sources) {
      ctx.fillText(line, PADDING, y + 18);
      y += 32;
    }
    y += 16;
  }

  ctx.fillStyle = "#30343c";
  const footerTop = height - footerHeight + 32;
  ctx.fillRect(PADDING, footerTop, TEXT_WIDTH, 1);
  ctx.fillStyle = "#aeb1ba";
  ctx.font = "17px system-ui, sans-serif";
  footerLines.forEach((line, index) => ctx.fillText(line, PADDING, footerTop + 37 + index * 26));

  const url = canvas.toDataURL("image/png");
  if (!url.startsWith("data:image/png;base64,")) throw new Error("PNG export failed");
  const binary = atob(url.slice("data:image/png;base64,".length));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: "image/png" }), url };
}