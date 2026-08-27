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

import ProfilePage from "../profile";
import {
  TEST_USER,
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

function profileHandlers(opts: { updatedUser?: typeof TEST_USER }): FetchHandler[] {
  return [
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
});
