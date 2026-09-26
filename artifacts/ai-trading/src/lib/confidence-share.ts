export type ConfidenceShareData = {
  title: string;
  instrument: string;
  timeframe: string;
  analyzedAt: string;
  summary: string;
  sections: { title: string; body: string }[];
  sourcesTitle: string;
  sources: { label: string; url?: string }[];
  disclaimer: string;
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
    data.disclaimer,
  ].join("\n");
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
  const summaryHeight = 44 + summary.length * 32;
  const sectionsHeight = sections.reduce((height, section) => height + 56 + section.lines.length * 32, 0);
  const sourcesHeight = sources.length ? 56 + sources.length * 32 : 0;
  const height = 203 + summaryHeight + sectionsHeight + sourcesHeight + 114;
  if (height > 12000) throw new Error("Analysis is too long to render as an image");
  canvas.width = WIDTH;
  canvas.height = height;

  ctx.fillStyle = "#101216";
  ctx.fillRect(0, 0, WIDTH, height);
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
  ctx.fillRect(PADDING, height - 82, TEXT_WIDTH, 1);
  ctx.fillStyle = "#aeb1ba";
  ctx.font = "17px system-ui, sans-serif";
  ctx.fillText(data.disclaimer, PADDING, height - 45, TEXT_WIDTH);

  const url = canvas.toDataURL("image/png");
  if (!url.startsWith("data:image/png;base64,")) throw new Error("PNG export failed");
  const binary = atob(url.slice("data:image/png;base64,".length));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: "image/png" }), url };
}