import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom does not implement EventSource, but the page-level Layout opens
// an SSE connection to `/api/notifications/stream` as soon as a user is
// loaded. Stub a no-op constructor so component tests rendering through
// `<Layout>` do not crash with `ReferenceError: EventSource is not defined`.
if (typeof globalThis !== "undefined" && typeof (globalThis as { EventSource?: unknown }).EventSource === "undefined") {
  class StubEventSource {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSED = 2;
    readonly url: string;
    readonly readyState = StubEventSource.CONNECTING;
    onopen: ((ev: Event) => void) | null = null;
    onmessage: ((ev: MessageEvent) => void) | null = null;
    onerror: ((ev: Event) => void) | null = null;
    constructor(url: string | URL) {
      this.url = typeof url === "string" ? url : url.toString();
    }
    addEventListener(): void {}
    removeEventListener(): void {}
    close(): void {}
    dispatchEvent(): boolean {
      return false;
    }
  }
  Object.defineProperty(globalThis, "EventSource", {
    writable: true,
    configurable: true,
    value: StubEventSource,
  });
}
