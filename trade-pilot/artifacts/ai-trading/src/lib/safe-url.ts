// Reject anything that isn't a vanilla http/https URL. The news feed is
// upstream-controlled (newsmaker.id + Yahoo Finance), so a hostile or
// glitched item could otherwise smuggle a `javascript:` / `data:` URL
// straight into an anchor href and execute on click. Returning `null`
// makes callers render the title as plain text instead of an anchor.
export function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}
