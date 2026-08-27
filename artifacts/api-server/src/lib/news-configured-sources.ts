/**
 * Adapters for approved third-party news feeds. Reuters, Bloomberg, and
 * CNBC are intentionally not scraped: each adapter is dormant until an
 * approved JSON delivery endpoint is configured for that source.
 *
 * Supported endpoint response shapes are a JSON array or an object with
 * `data`, `articles`, `items`, or `results` containing article objects.
 * Endpoint URLs may include `{instrument}` and `{limit}` placeholders.
 */
export type ConfiguredNewsSourceId =
  | "sg_berjangka"
  | "reuters"
  | "bloomberg"
  | "cnbc";

export type ConfiguredNewsSourceTier = "primary" | "licensed";

export interface ConfiguredNewsSourceStatus {
  id: ConfiguredNewsSourceId;
  label: string;
  tier: ConfiguredNewsSourceTier;
  configured: boolean;
  available: boolean;
}

export interface ConfiguredNewsItem {
  id: string;
  title: string;
  summary: string;
  url: string | null;
  publishedAt: string;
  source: string;
  sourceTier: ConfiguredNewsSourceTier;
  sourceWeight: number;
}

interface SourceDefinition {
  id: ConfiguredNewsSourceId;
  label: string;
  tier: ConfiguredNewsSourceTier;
  weight: number;
  endpointEnv: string;
  tokenEnv: string;
}

const SOURCES: readonly SourceDefinition[] = [
  {
    id: "sg_berjangka",
    label: "SG Berjangka",
    tier: "primary",
    weight: 0.9,
    endpointEnv: "SG_BERJANGKA_NEWS_URL",
    tokenEnv: "SG_BERJANGKA_NEWS_TOKEN",
  },
  {
    id: "reuters",
    label: "Reuters",
    tier: "licensed",
    weight: 1,
    endpointEnv: "REUTERS_NEWS_URL",
    tokenEnv: "REUTERS_NEWS_TOKEN",
  },
  {
    id: "bloomberg",
    label: "Bloomberg",
    tier: "licensed",
    weight: 1,
    endpointEnv: "BLOOMBERG_NEWS_URL",
    tokenEnv: "BLOOMBERG_NEWS_TOKEN",
  },
  {
    id: "cnbc",
    label: "CNBC",
    tier: "licensed",
    weight: 0.9,
    endpointEnv: "CNBC_NEWS_URL",
    tokenEnv: "CNBC_NEWS_TOKEN",
  },
];

const CACHE_TTL_MS = 2 * 60 * 1000;
const cache = new Map<ConfiguredNewsSourceId, { fetchedAt: number; items: ConfiguredNewsItem[] }>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, maxLength) : "";
}

function safeEndpoint(raw: string | undefined, instrument: string, limit: number): string | null {
  if (!raw) return null;
  try {
    const url = new URL(
      raw
        .replaceAll("{instrument}", encodeURIComponent(instrument))
        .replaceAll("{limit}", String(limit)),
    );
    const host = url.hostname.toLowerCase();
    const blockedHost =
      host === "localhost" ||
      host.endsWith(".local") ||
      host === "127.0.0.1" ||
      host === "::1" ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
    return url.protocol === "https:" && !blockedHost ? url.toString() : null;
  } catch {
    return null;
  }
}

function extractRecords(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (!isRecord(payload)) return [];
  for (const key of ["data", "articles", "items", "results"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value.filter(isRecord);
    if (isRecord(value)) {
      for (const nestedKey of ["articles", "items", "results"]) {
        const nested = value[nestedKey];
        if (Array.isArray(nested)) return nested.filter(isRecord);
      }
    }
  }
  return [];
}

function toIsoDate(value: unknown): string | null {
  const raw = text(value, 100);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function mapRecord(
  raw: Record<string, unknown>,
  source: SourceDefinition,
  index: number,
): ConfiguredNewsItem | null {
  const title = text(raw["title"] ?? raw["headline"] ?? raw["name"], 500);
  const publishedAt = toIsoDate(
    raw["publishedAt"] ?? raw["published_at"] ?? raw["published"] ?? raw["date"] ?? raw["timestamp"],
  );
  if (!title || !publishedAt) return null;
  const id = text(raw["id"] ?? raw["guid"] ?? raw["uuid"], 120) || `${source.id}-${publishedAt}-${index}`;
  const candidateUrl = text(raw["url"] ?? raw["link"] ?? raw["webUrl"], 2000);
  let url: string | null = null;
  try {
    if (candidateUrl && /^https?:$/i.test(new URL(candidateUrl).protocol)) url = candidateUrl;
  } catch {
    // An invalid article URL is not a reason to discard an otherwise valid,
    // licensed metadata item; the UI will render it as a non-clickable row.
  }
  return {
    id: `${source.id}-${id}`,
    title,
    summary: text(raw["summary"] ?? raw["description"] ?? raw["excerpt"], 600),
    url,
    publishedAt,
    source: source.label,
    sourceTier: source.tier,
    sourceWeight: source.weight,
  };
}

async function fetchSource(
  source: SourceDefinition,
  instrument: string,
  maxItems: number,
): Promise<{ items: ConfiguredNewsItem[]; status: ConfiguredNewsSourceStatus }> {
  const endpoint = safeEndpoint(process.env[source.endpointEnv], instrument, maxItems);
  const baseStatus: ConfiguredNewsSourceStatus = {
    id: source.id,
    label: source.label,
    tier: source.tier,
    configured: endpoint !== null,
    available: false,
  };
  if (!endpoint) return { items: [], status: baseStatus };

  const cached = cache.get(source.id);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return { items: cached.items, status: { ...baseStatus, available: true } };
  }

  const token = process.env[source.tokenEnv];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}`, "X-API-Key": token } : {}),
      },
    });
    if (!response.ok) return { items: [], status: baseStatus };
    const payload: unknown = await response.json();
    const items = extractRecords(payload)
      .slice(0, maxItems)
      .map((record, index) => mapRecord(record, source, index))
      .filter((item): item is ConfiguredNewsItem => item !== null);
    cache.set(source.id, { fetchedAt: Date.now(), items });
    return { items, status: { ...baseStatus, available: true } };
  } catch {
    return { items: [], status: baseStatus };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getConfiguredNewsSources(
  instrument: string,
  maxItems = 8,
): Promise<{ items: ConfiguredNewsItem[]; sources: ConfiguredNewsSourceStatus[] }> {
  const results = await Promise.all(SOURCES.map((source) => fetchSource(source, instrument, maxItems)));
  return {
    items: results.flatMap((result) => result.items),
    sources: results.map((result) => result.status),
  };
}

export function clearConfiguredNewsCaches(): void {
  cache.clear();
}