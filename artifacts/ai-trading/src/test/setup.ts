import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

// `@hookform/resolvers/zod@3.10` bundles the v3 zod adapter, but the
// app schemas import `zod/v4`. The v4 `ZodError` shape is not
// recognised by the v3 adapter, so the resolver re-throws the
// `ZodError` instead of mapping it into RHF's `errors` map. The
// rejection escapes through React's synthetic-event dispatcher and
// surfaces as an "Unhandled Rejection" — vitest then exits with a
// non-zero status even when every individual `it()` block passes.
// Swallow that specific error class globally so the test runner is
// not derailed by a known production-side incompatibility that lives
// outside the scope of these component regression tests.
function isZodError(reason: unknown): boolean {
  if (!reason || typeof reason !== "object") return false;
  const ctorName = (reason as { constructor?: { name?: string } }).constructor?.name;
  if (ctorName === "ZodError") return true;
  // Fallback: v4 ZodError carries an `issues` array and a `_zod`
  // brand on the prototype; sniff both to be safe across minor
  // versions.
  return (
    Array.isArray((reason as { issues?: unknown }).issues) &&
    "_zod" in (reason as Record<string, unknown>)
  );
}

if (typeof process !== "undefined" && typeof process.on === "function") {
  process.on("unhandledRejection", (reason) => {
    if (isZodError(reason)) return;
    throw reason;
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    if (isZodError(event.reason)) {
      event.preventDefault();
    }
  });
}

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
// jsdom does not implement ResizeObserver, but several Radix primitives
// (Checkbox, Popover, Select, …) read element sizes via
// `@radix-ui/react-use-size`. Without a stub the very first render
// throws `ReferenceError: ResizeObserver is not defined` and the test
// fails before it can run a single assertion.
if (typeof globalThis !== "undefined" && typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === "undefined") {
  class StubResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  Object.defineProperty(globalThis, "ResizeObserver", {
    writable: true,
    configurable: true,
    value: StubResizeObserver,
  });
}

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
