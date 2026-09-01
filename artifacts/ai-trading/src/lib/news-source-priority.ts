export interface SourcedNewsItem {
  source: string;
}

const NEWSMAKER_SOURCE = "Newsmaker.id";
const YAHOO_SOURCE = "Yahoo Finance";

/**
 * Arrange a user-facing news list around Newsmaker.id, with at most one
 * Yahoo Finance headline as a supplementary source. The input order remains
 * the ranking order within each source.
 */
export function prioritizeNewsSources<T extends SourcedNewsItem>(
  items: T[],
  maxItems: number,
): T[] {
  const limit = Math.max(1, Math.min(12, Math.floor(maxItems) || 1));
  const primary = items.filter((item) => item.source === NEWSMAKER_SOURCE);
  const yahoo = items.find((item) => item.source === YAHOO_SOURCE);
  if (limit === 1) {
    return primary.length > 0 ? primary.slice(0, 1) : yahoo ? [yahoo] : [];
  }
  const primaryLimit = yahoo ? Math.max(0, limit - 1) : limit;
  const selected = new Set([
    ...primary.slice(0, primaryLimit),
    ...(yahoo ? [yahoo] : []),
  ]);

  return items.filter((item) => selected.has(item)).slice(0, limit);
}