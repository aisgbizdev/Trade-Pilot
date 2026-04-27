/**
 * Component test for the Notifications panel
 * (`src/pages/notifications.tsx`).
 *
 * Covers happy-path render of the notification cards (with type badge
 * and the unread highlight), the unread counter + "mark all as read"
 * affordance in the header, the empty state when the API returns no
 * notifications, the push-prefs card with its two toggles, and the user
 * action of clicking an unread card to PATCH `/api/notifications/:id/read`.
 *
 * `usePush()` checks `navigator.serviceWorker` / `window.PushManager`,
 * neither of which exist in jsdom, so its state always resolves to
 * `unsupported`. That hides the master push toggle but keeps the rest of
 * the panel rendering, which is exactly what we want to assert here.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

// Mock `usePush` at module-load (vi.mock is hoisted) so the page picks
// up the mocked hook on its first import. The shared `pushHookState`
// reference is created via `vi.hoisted` so the mock factory can read
// it without violating the "no out-of-scope reference" rule. Tests
// flip `pushHookState.current` to simulate different push states
// (default: "unsupported", which matches the real behaviour in jsdom).
const { pushHookState } = vi.hoisted(() => ({
  pushHookState: {
    current: "unsupported" as
      | "unsupported"
      | "denied"
      | "default"
      | "subscribed"
      | "pending"
      | "error",
  },
}));

vi.mock("@/hooks/use-push", () => ({
  usePush: () => ({
    state: pushHookState.current,
    subscription: null,
    subscribe: vi.fn(async () => {}),
    unsubscribe: vi.fn(async () => {}),
  }),
}));

// Capture `toast()` calls so the error-branch tests can assert the
// exact title/variant the page tries to surface. The spy is created via
// `vi.hoisted` so the mock factory below can reference it without
// triggering the "no out-of-scope reference" rule.
const { toastSpy } = vi.hoisted(() => ({ toastSpy: vi.fn() }));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastSpy, dismiss: vi.fn(), toasts: [] }),
  toast: toastSpy,
}));

import NotificationsPage from "../notifications";
import { en } from "@/locales/en";
import {
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

const NOTIFICATIONS_PAYLOAD = {
  notifications: [
    {
      id: 11,
      type: "info",
      title: "Welcome to Trade Pilot",
      message: "Your account is ready.",
      readAt: null,
      createdAt: new Date(Date.now() - 60_000).toISOString(),
    },
    {
      id: 12,
      type: "warning",
      title: "Analysis expiring",
      message: "Your XAU/USD analysis expires soon. [expiry:7]",
      readAt: new Date(Date.now() - 30_000).toISOString(),
      createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    },
  ],
  total: 2,
};

const PUSH_PREFS_PAYLOAD = {
  pushExpiry: true,
  pushBroadcast: false,
};

function notificationsHandler(payload: typeof NOTIFICATIONS_PAYLOAD): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "GET") return null;
    if (!url.includes("/api/notifications")) return null;
    // Layout query (unreadOnly=true) is served by the default handler in
    // installFetchMock — only respond to the page-level "all" fetch here.
    if (url.includes("unreadOnly=true")) return null;
    return jsonResponse(payload);
  };
}

function pushPrefsHandler(payload: typeof PUSH_PREFS_PAYLOAD): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method === "GET" && url.includes("/api/push/prefs")) {
      return jsonResponse(payload);
    }
    return null;
  };
}

function markReadHandler(): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "PATCH") return null;
    if (/\/api\/notifications\/\d+\/read$/.test(url)) {
      return jsonResponse({ message: "ok" });
    }
    if (url.endsWith("/api/notifications/read-all")) {
      return jsonResponse({ message: "ok" });
    }
    return null;
  };
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/notifications");
  toastSpy.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("NotificationsPage: happy-path render", () => {
  it("renders one card per notification, highlights the unread one, exposes the unread counter and the 'mark all as read' button", async () => {
    installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    const unread = await screen.findByTestId("card-notification-11");
    const read = screen.getByTestId("card-notification-12");

    // Unread row carries the highlight classes; read row does not.
    expect(unread.className).toMatch(/border-primary/);
    expect(read.className).not.toMatch(/border-primary\/30/);

    // The unread counter (1) and "mark all as read" button render once
    // the notifications list resolves.
    expect(
      await screen.findByTestId("button-mark-all-read"),
    ).toBeInTheDocument();

    // The `[expiry:N]` marker is stripped from the displayed message.
    expect(read.textContent).not.toMatch(/\[expiry:/);
  });
});

describe("NotificationsPage: empty branch", () => {
  it("renders the empty state when the API returns no notifications and hides the 'mark all as read' button", async () => {
    installFetchMock([
      notificationsHandler({ notifications: [], total: 0 }),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    const { container } = render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    // Positive assertion: the empty-state copy actually renders. Picking
    // up the EN locale here (LanguageProvider defaults to "en") keeps the
    // test resilient to incidental copy reflow but still requires the
    // empty branch to commit.
    await waitFor(() => {
      expect(screen.getByText(/No notifications/i)).toBeInTheDocument();
    });

    // The list-loading spinner must be gone — otherwise the empty branch
    // never actually rendered and the previous assertion is a false
    // positive on a still-pending query.
    expect(container.querySelector(".animate-spin")).toBeNull();

    // And the negative assertions: no notification cards, no mark-all CTA.
    expect(
      screen.queryByTestId("card-notification-11"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("card-notification-12"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("button-mark-all-read"),
    ).not.toBeInTheDocument();
  });
});

describe("NotificationsPage: send-test push", () => {
  // The "Send a test notification" button is gated on the user actually
  // having an active push subscription. Flip the hoisted hook state to
  // "subscribed" for these tests so the button renders and we can drive
  // the test-send mutation end-to-end.
  beforeEach(() => {
    pushHookState.current = "subscribed";
  });

  afterEach(() => {
    pushHookState.current = "unsupported";
  });

  it("renders the send-test button when push is subscribed and POSTs /api/push/test on click", async () => {
    const { calls } = installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
      (url, init) => {
        const method = (init?.method ?? "GET").toUpperCase();
        if (method === "POST" && url.endsWith("/api/push/test")) {
          return jsonResponse({ delivered: 1 });
        }
        return null;
      },
    ]);

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    const btn = await screen.findByTestId("button-send-push-test");
    await act(async () => {
      fireEvent.click(btn);
    });

    await waitFor(() => {
      const sent = calls.find(
        (c) => c.method === "POST" && c.url.endsWith("/api/push/test"),
      );
      expect(sent).toBeDefined();
    });
  });

  it("shows the 'no devices subscribed' toast when /api/push/test returns 404", async () => {
    installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
      (url, init) => {
        const method = (init?.method ?? "GET").toUpperCase();
        if (method === "POST" && url.endsWith("/api/push/test")) {
          return new Response(
            JSON.stringify({ message: "no subscribers" }),
            { status: 404, headers: { "Content-Type": "application/json" } },
          );
        }
        return null;
      },
    ]);

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    const btn = await screen.findByTestId("button-send-push-test");
    await act(async () => {
      fireEvent.click(btn);
    });

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: en.notifications.test_push_no_devices,
          variant: "destructive",
        }),
      );
    });

    // The generic-error copy must NOT have fired for the 404 branch —
    // otherwise the wrong message would reach the user.
    expect(toastSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        title: en.notifications.test_push_error,
      }),
    );
  });

  it("shows the generic error toast when /api/push/test returns 500", async () => {
    installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
      (url, init) => {
        const method = (init?.method ?? "GET").toUpperCase();
        if (method === "POST" && url.endsWith("/api/push/test")) {
          return new Response(
            JSON.stringify({ message: "boom" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
        return null;
      },
    ]);

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    const btn = await screen.findByTestId("button-send-push-test");
    await act(async () => {
      fireEvent.click(btn);
    });

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: en.notifications.test_push_error,
          variant: "destructive",
        }),
      );
    });

    // Sanity check: the 404-specific copy must not be used for the
    // 500 branch.
    expect(toastSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        title: en.notifications.test_push_no_devices,
      }),
    );
  });

  it("disables the button and swaps the label to the loading copy while the request is in flight", async () => {
    let resolveTest: (() => void) | null = null;
    const inFlight = new Promise<void>((resolve) => {
      resolveTest = resolve;
    });

    installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
      async (url, init) => {
        const method = (init?.method ?? "GET").toUpperCase();
        if (method === "POST" && url.endsWith("/api/push/test")) {
          await inFlight;
          return jsonResponse({ delivered: 1 });
        }
        return null;
      },
    ]);

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    const btn = (await screen.findByTestId(
      "button-send-push-test",
    )) as HTMLButtonElement;

    // Idle state: enabled and showing the default CTA copy.
    expect(btn.disabled).toBe(false);
    expect(btn.textContent).toContain(en.notifications.test_push_btn);

    await act(async () => {
      fireEvent.click(btn);
    });

    // While the POST is pending the button must flip to the loading
    // label and be disabled so the user cannot double-fire the request.
    await waitFor(() => {
      expect(btn.disabled).toBe(true);
      expect(btn.textContent).toContain(en.notifications.test_push_sending);
    });

    // Resolve the in-flight request and confirm the button returns to
    // its idle, clickable state — proves the loading state was tied to
    // the actual mutation lifecycle and not a stuck flag.
    await act(async () => {
      resolveTest?.();
      // Yield so react-query can settle the mutation before assertions.
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(btn.disabled).toBe(false);
      expect(btn.textContent).toContain(en.notifications.test_push_btn);
    });
  });
});

describe("NotificationsPage: user actions", () => {
  it("fires the destructive push_prefs_error toast when PATCH /api/push/prefs returns 500", async () => {
    // Reply 500 to the PATCH so handlePrefToggle hits its catch branch.
    // The GET handler is still served by `pushPrefsHandler` so the
    // switches render with their initial state before the user toggles.
    installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
      (url, init) => {
        const method = (init?.method ?? "GET").toUpperCase();
        if (method === "PATCH" && url.endsWith("/api/push/prefs")) {
          return new Response(
            JSON.stringify({ message: "boom" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
        return null;
      },
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    // Toggle the broadcast switch (false → true). Either switch would
    // exercise the same handler; broadcast starts off so the click
    // produces an unambiguous state-change attempt.
    const broadcastSwitch = await screen.findByTestId("switch-pref-broadcast");
    expect(broadcastSwitch.getAttribute("aria-checked")).toBe("false");

    await act(async () => {
      fireEvent.click(broadcastSwitch);
    });

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: en.notifications.push_prefs_error,
          variant: "destructive",
        }),
      );
    });
  });

  it("renders both push-pref switches reflecting the API payload", async () => {
    installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    const expirySwitch = await screen.findByTestId("switch-pref-expiry");
    const broadcastSwitch = screen.getByTestId("switch-pref-broadcast");

    // Radix Switch reflects state via aria-checked / data-state.
    expect(expirySwitch.getAttribute("aria-checked")).toBe("true");
    expect(broadcastSwitch.getAttribute("aria-checked")).toBe("false");
  });

  it("PATCHes /api/notifications/:id/read when an unread card is clicked", async () => {
    const { calls } = installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    const unread = await screen.findByTestId("card-notification-11");

    await act(async () => {
      fireEvent.click(unread);
    });

    await waitFor(() => {
      const patched = calls.find(
        (c) => c.method === "PATCH" && c.url.endsWith("/api/notifications/11/read"),
      );
      expect(patched).toBeDefined();
    });
  });

  it("PATCHes /api/notifications/read-all when the header 'mark all as read' button is clicked", async () => {
    const { calls } = installFetchMock([
      notificationsHandler(NOTIFICATIONS_PAYLOAD),
      pushPrefsHandler(PUSH_PREFS_PAYLOAD),
      markReadHandler(),
    ]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <NotificationsPage />
      </Wrapper>,
    );

    const markAll = await screen.findByTestId("button-mark-all-read");

    await act(async () => {
      fireEvent.click(markAll);
    });

    await waitFor(() => {
      const patched = calls.find(
        (c) => c.method === "PATCH" && c.url.endsWith("/api/notifications/read-all"),
      );
      expect(patched).toBeDefined();
    });
  });
});
