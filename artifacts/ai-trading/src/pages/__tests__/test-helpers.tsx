/**
 * Shared test helpers for the page-level component tests under
 * `artifacts/ai-trading/src/pages/__tests__/*`.
 *
 * The page components (`analyze`, `history`, `notifications`) all render
 * inside `<Layout>` which itself depends on `AuthProvider` (`/api/auth/me`)
 * and a recurring `useGetNotifications({ unreadOnly: true })` query.
 * Centralising the wrapper + the default route handlers keeps the
 * individual test files focused on the component being exercised rather
 * than on plumbing.
 */
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider } from "@/lib/i18n";

export const TEST_USER = {
  id: 1,
  email: "test@example.com",
  displayName: "Test Trader",
  role: "user",
  selectedMode: "beginner",
  themePreference: "system",
  onboardingCompleted: true,
  createdAt: "2026-01-01T00:00:00Z",
};

export type FetchHandler = (
  url: string,
  init: RequestInit | undefined,
) => Response | Promise<Response> | null | undefined;

/**
 * Install a `globalThis.fetch` spy that walks the supplied handlers in
 * order. The first handler returning a non-null `Response` wins. Built-in
 * handlers cover the auth + layout-notifications endpoints so individual
 * tests only need to declare the routes specific to the page under test.
 */
export function installFetchMock(extraHandlers: FetchHandler[] = []) {
  const calls: Array<{ url: string; method: string; body?: string }> = [];
  const handlers: FetchHandler[] = [
    ...extraHandlers,
    // Default auth: a logged-in beginner-mode user.
    (url) => {
      if (url.includes("/api/auth/me")) {
        return jsonResponse(TEST_USER);
      }
      return null;
    },
    // Default layout bell query: zero unread notifications.
    (url) => {
      if (url.includes("/api/notifications") && url.includes("unreadOnly=true")) {
        return jsonResponse({ notifications: [], total: 0 });
      }
      return null;
    },
  ];

  const spy = vi.spyOn(globalThis, "fetch").mockImplementation(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const method = (init?.method ?? "GET").toUpperCase();
      const body = typeof init?.body === "string" ? init.body : undefined;
      calls.push({ url, method, body });
      for (const handler of handlers) {
        const result = await handler(url, init);
        if (result) return result;
      }
      return new Response(`unhandled: ${method} ${url}`, { status: 404 });
    },
  );

  return { spy, calls };
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="test-theme">
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }
  return { Wrapper, queryClient };
}
