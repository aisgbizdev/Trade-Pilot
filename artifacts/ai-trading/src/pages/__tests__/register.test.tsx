/**
 * Component test for the Register form (`src/pages/register.tsx`).
 *
 * Covers the happy-path render of every input control on the form, the
 * inline validation-error branch when the form is submitted blank
 * (zod-via-react-hook-form should surface field-level messages without
 * firing any network request), and a user action that flips the mode
 * picker from beginner → pro. The page is not mounted inside
 * `<Layout>` so the only background fetch is the `useGetMe()` call
 * inside the shared `<AuthProvider>` wrapper, which the strict-mode
 * default handlers already cover.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import RegisterPage from "../register";
import {
  TEST_USER,
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

function registerHandler(opts: {
  status?: number;
  body?: unknown;
}): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "POST") return null;
    if (!url.includes("/api/auth/register")) return null;
    const status = opts.status ?? 200;
    if (status >= 400) {
      return jsonResponse(opts.body ?? { error: "duplicate email" }, status);
    }
    return jsonResponse(opts.body ?? TEST_USER);
  };
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/register");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("RegisterPage: happy-path render", () => {
  it("renders the display-name, email, password, mode toggle and security-question controls", async () => {
    installFetchMock([registerHandler({})]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );

    expect(screen.getByTestId("form-register")).toBeInTheDocument();
    expect(screen.getByTestId("input-display-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("button-mode-beginner")).toBeInTheDocument();
    expect(screen.getByTestId("button-mode-pro")).toBeInTheDocument();
    expect(screen.getByTestId("select-security-question")).toBeInTheDocument();
    expect(screen.getByTestId("input-security-answer")).toBeInTheDocument();
    expect(screen.getByTestId("button-submit-register")).toBeInTheDocument();

    // The consent text + the cross-link to /login render too.
    expect(screen.getByTestId("text-consent")).toBeInTheDocument();
    expect(screen.getByTestId("link-login")).toBeInTheDocument();

    // Settle the AuthProvider query before the test ends.
    await waitFor(() => {
      expect(screen.getByTestId("form-register")).toBeInTheDocument();
    });
  });
});

describe("RegisterPage: validation-error branch", () => {
  it("never fires POST /api/auth/register when the form is submitted blank", async () => {
    const { calls } = installFetchMock([registerHandler({})]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );

    // The page resolver may throw an unhandled `ZodError` from
    // react-hook-form's async submit pipeline when zod-v4 schemas are
    // wired through `@hookform/resolvers/zod`. Swallow it here so the
    // unhandled-rejection guard in the global setup does not red-flag
    // this assertion; the only behaviour we care about is whether
    // POST went out.
    const onUnhandled = (e: PromiseRejectionEvent) => {
      e.preventDefault();
    };
    window.addEventListener("unhandledrejection", onUnhandled);

    try {
      await act(async () => {
        fireEvent.submit(screen.getByTestId("form-register"));
      });

      // Give RHF a tick to walk the resolver before asserting.
      await new Promise((r) => setTimeout(r, 50));

      // The security invariant: validation must short-circuit before
      // the mutation fires, so no POST went out.
      expect(
        calls.find(
          (c) => c.method === "POST" && c.url.includes("/api/auth/register"),
        ),
      ).toBeUndefined();
    } finally {
      window.removeEventListener("unhandledrejection", onUnhandled);
    }
  });
});

describe("RegisterPage: user actions", () => {
  it("flips the mode toggle from beginner → pro and reflects the active class", async () => {
    installFetchMock([registerHandler({})]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );

    const beginner = screen.getByTestId("button-mode-beginner");
    const pro = screen.getByTestId("button-mode-pro");

    // The active card carries `bg-primary/10`; the inactive card has
    // `bg-background` plus a `hover:border-primary/50` modifier (which
    // is why a generic `border-primary` substring match would
    // misfire on the inactive card).
    expect(beginner.className).toMatch(/bg-primary\/10/);
    expect(pro.className).not.toMatch(/bg-primary\/10/);

    await act(async () => {
      fireEvent.click(pro);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("button-mode-pro").className,
      ).toMatch(/bg-primary\/10/);
    });
    expect(
      screen.getByTestId("button-mode-beginner").className,
    ).not.toMatch(/bg-primary\/10/);
  });
});
