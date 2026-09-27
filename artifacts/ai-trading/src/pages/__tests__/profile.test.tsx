/**
 * Component test for the Profile page (`src/pages/profile.tsx`).
 *
 * Covers the happy-path render of the user identity card (display name
 * + email + role + mode badges) and the theme picker; the
 * password-section toggle which expands the change-password sub-form
 * (a state-transition branch that proves the collapsed/expanded paths
 * both wire up); and a user action that edits the display name and
 * fires `PATCH /api/auth/profile` with the new name in the request
 * body.
 *
 * Profile renders inside `<Layout>` so the strict harness needs a
 * handler for the layout-bell poll (covered by the helper default) and
 * for the `PATCH /api/auth/profile` call the page issues on save.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

const { toastSpy } = vi.hoisted(() => ({ toastSpy: vi.fn() }));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastSpy, dismiss: vi.fn(), toasts: [] }),
  toast: toastSpy,
}));

import ProfilePage from "../profile";
import {
  TEST_USER,
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

function profileHandlers(opts: { updatedUser?: typeof TEST_USER; balanceHandler?: () => Response | Promise<Response> }): FetchHandler[] {
  return [
    (url) => url.includes("/api/topups/balance")
      ? opts.balanceHandler?.() ?? jsonResponse({ balance: 12 })
      : null,
    (url) => url.includes("/api/progression/summary")
      ? jsonResponse({ level: 1, rank: "Beginner", masteryLevel: 0, totalXp: 0 })
      : null,
    (url) => url.includes("/api/ticker-news")
      ? jsonResponse({ articles: [], total: 0 })
      : null,
    (url, init) => {
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "PATCH") return null;
      if (!url.includes("/api/auth/profile")) return null;
      return jsonResponse(opts.updatedUser ?? TEST_USER);
    },
    // Profile renders inside <Layout>, which mounts the
    // <ContinuousTicker> widget — that ticker fetches /api/quotes/live
    // and /api/news on mount. Stub both with empty payloads so the
    // strict harness does not flag them as unhandled.
    (url) => {
      if (url.includes("/api/quotes/live")) {
        return jsonResponse({
          status: "ok",
          updatedAt: new Date().toISOString(),
          serverTime: "00:00:00",
          data: [],
        });
      }
      return null;
    },
    (url) => {
      // The bell-poll handler in test-helpers matches `unreadOnly=true`
      // first; this fall-through covers the news ticker only.
      if (url.includes("/api/news")) {
        return jsonResponse({ articles: [], total: 0 });
      }
      return null;
    },
  ];
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/profile");
  toastSpy.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ProfilePage: happy-path render", () => {
  it("renders the display name + email from /api/auth/me, the theme picker and the edit affordance", async () => {
    installFetchMock(profileHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <ProfilePage />
      </Wrapper>,
    );

    // The identity text mounts immediately as empty `<span>`s while
    // `/api/auth/me` is in flight; wait until the resolved name +
    // email actually paint.
    await waitFor(() => {
      expect(
        screen.getByTestId("text-display-name").textContent,
      ).toBe(TEST_USER.displayName);
    });

    expect(screen.getByTestId("text-email").textContent).toBe(TEST_USER.email);

    // Edit button shows when not in editing mode.
    expect(screen.getByTestId("button-edit-name")).toBeInTheDocument();

    // Both theme buttons render. The default storage key is "test-theme"
    // and Wrapper sets defaultTheme="dark", so the dark button carries
    // the active background classes.
    expect(screen.getByTestId("button-theme-light")).toBeInTheDocument();
    expect(screen.getByTestId("button-theme-dark")).toBeInTheDocument();
    expect(screen.getByTestId("profile-container")).toHaveClass("max-w-4xl", "mx-auto");
    expect(screen.getByTestId("theme-segmented-control")).toHaveClass("inline-flex");
    expect(screen.getByTestId("button-theme-light")).not.toHaveClass("flex-1");
    expect(screen.getByTestId("button-theme-dark")).not.toHaveClass("flex-1");

    const settings = screen.getByTestId("profile-settings-group");
    expect(settings).toContainElement(screen.getByTestId("button-toggle-password-section"));
    expect(settings).toContainElement(screen.getByTestId("button-toggle-security-section"));
    expect(settings).toContainElement(screen.getByTestId("button-go-privacy-security"));
    expect(screen.queryByTestId("card-delete-account")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-open-delete-account")).not.toBeInTheDocument();
    expect(settings).toContainElement(screen.getByTestId("button-go-my-alerts"));
    expect(settings).toContainElement(screen.getByTestId("button-go-notification-settings"));
    expect(screen.getByTestId("button-go-my-alerts")).toHaveTextContent("View and manage your price alerts");
    expect(screen.getByTestId("button-go-notification-settings")).toHaveTextContent("Choose push, notification types");
    expect(await screen.findByTestId("badge-credit-balance")).toHaveTextContent("12");

    // Logout button is rendered at the bottom of the page.
    expect(screen.getByTestId("button-logout")).toBeInTheDocument();
  });
});

describe("ProfilePage: collapsible password section", () => {
  it("shows the password sub-form inputs only after the change-password section is toggled open", async () => {
    installFetchMock(profileHandlers({}));
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <ProfilePage />
      </Wrapper>,
    );

    // Collapsed by default: the new-password input is not in the DOM.
    expect(screen.queryByTestId("input-current-password")).not.toBeInTheDocument();
    expect(screen.queryByTestId("input-new-password")).not.toBeInTheDocument();

    const toggle = await screen.findByTestId("button-toggle-password-section");

    await act(async () => {
      fireEvent.click(toggle);
    });

    // After toggling, all three password inputs should render.
    expect(
      await screen.findByTestId("input-current-password"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("input-new-password")).toBeInTheDocument();
    expect(screen.getByTestId("input-confirm-password")).toBeInTheDocument();
    expect(screen.getByTestId("button-save-password")).toBeInTheDocument();
  });
});

describe("ProfilePage: user actions", () => {
  it("PATCHes /api/auth/profile with the new display name when the user edits and saves it", async () => {
    const NEW_NAME = "Renamed Trader";
    const { calls } = installFetchMock(
      profileHandlers({
        updatedUser: { ...TEST_USER, displayName: NEW_NAME },
      }),
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <ProfilePage />
      </Wrapper>,
    );

    // Wait for `/api/auth/me` to settle (so the edit button reads the
    // user's current display name, not an empty string).
    await waitFor(() => {
      expect(
        screen.getByTestId("text-display-name").textContent,
      ).toBe(TEST_USER.displayName);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-edit-name"));
    });

    const input = (await screen.findByTestId(
      "input-display-name",
    )) as HTMLInputElement;
    await waitFor(() => {
      expect(input.value).toBe(TEST_USER.displayName);
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: NEW_NAME } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-save-name"));
    });

    await waitFor(() => {
      const patched = calls.find(
        (c) => c.method === "PATCH" && c.url.includes("/api/auth/profile"),
      );
      expect(patched).toBeDefined();
      const payload = patched?.body ? JSON.parse(patched.body) : null;
      expect(payload?.displayName).toBe(NEW_NAME);
    });
  });

  it("keeps the entered name editable and reports a failed save", async () => {
    installFetchMock([
      (url, init) => url.includes("/api/auth/profile") && init?.method === "PATCH"
        ? jsonResponse({ error: "Unavailable" }, 503)
        : null,
      ...profileHandlers({}),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><ProfilePage /></Wrapper>);
    await screen.findByText(TEST_USER.displayName);
    fireEvent.click(screen.getByTestId("button-edit-name"));
    fireEvent.change(screen.getByTestId("input-display-name"), { target: { value: "New trader" } });
    fireEvent.click(screen.getByTestId("button-save-name"));
    await waitFor(() => expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Couldn't update name. Please try again.", variant: "destructive" }),
    ));
    expect(screen.getByTestId("input-display-name")).toHaveValue("New trader");
    expect(screen.queryByTestId("button-edit-name")).not.toBeInTheDocument();
  });

  it("restores the previous theme and reports a failed save", async () => {
    const { calls } = installFetchMock([
      (url, init) => url.includes("/api/auth/profile") && init?.method === "PATCH"
        ? jsonResponse({ error: "Unavailable" }, 503)
        : null,
      ...profileHandlers({}),
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><ProfilePage /></Wrapper>);
    fireEvent.click(screen.getByTestId("button-theme-light"));
    await waitFor(() => expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Couldn't save theme. Display restored.", variant: "destructive" }),
    ));
    expect(screen.getByTestId("button-theme-dark")).toHaveClass("bg-primary");
    expect(localStorage.getItem("test-theme")).toBe("dark");
    expect(calls.find((c) => c.method === "PATCH")?.body).toContain('"themePreference":"light"');
  });

  it("confirms a successfully saved theme", async () => {
    const { calls } = installFetchMock(profileHandlers({}));
    const { Wrapper } = makeWrapper();
    render(<Wrapper><ProfilePage /></Wrapper>);
    fireEvent.click(screen.getByTestId("button-theme-light"));
    await waitFor(() => expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Theme saved" }),
    ));
    expect(screen.getByTestId("button-theme-light")).toHaveClass("bg-primary");
    expect(localStorage.getItem("test-theme")).toBe("light");
    expect(calls.find((c) => c.method === "PATCH")?.body).toContain('"themePreference":"light"');
  });

  it("shows loading and a real zero balance as distinct states", async () => {
    let resolveBalance!: (response: Response) => void;
    const pendingBalance = new Promise<Response>((resolve) => { resolveBalance = resolve; });
    installFetchMock(profileHandlers({ balanceHandler: () => pendingBalance }));
    const { Wrapper } = makeWrapper();
    render(<Wrapper><ProfilePage /></Wrapper>);
    expect(screen.getByTestId("credit-balance-status")).toHaveTextContent("Loading balance");
    expect(screen.queryByTestId("badge-credit-balance")).not.toBeInTheDocument();
    await act(async () => { resolveBalance(jsonResponse({ balance: 0 })); });
    expect(await screen.findByTestId("badge-credit-balance")).toHaveTextContent("0");
    expect(screen.queryByTestId("credit-balance-status")).not.toBeInTheDocument();
  });

  it("does not show zero when balance loading fails", async () => {
    installFetchMock(profileHandlers({ balanceHandler: () => jsonResponse({ error: "Unavailable" }, 503) }));
    const { Wrapper } = makeWrapper();
    render(<Wrapper><ProfilePage /></Wrapper>);
    await waitFor(() => expect(screen.getByTestId("credit-balance-status")).toHaveTextContent("Balance unavailable"));
    expect(screen.queryByTestId("badge-credit-balance")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-go-topup")).toBeInTheDocument();
  });
});
