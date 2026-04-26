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
  it("submits a blank form, surfaces inline field errors and never fires POST /api/auth/register", async () => {
    const { calls } = installFetchMock([registerHandler({})]);
    const { Wrapper } = makeWrapper();

    const { container } = render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.submit(screen.getByTestId("form-register"));
    });

    // After a blank submit at least one zod-driven message renders. The
    // default <FormMessage /> from shadcn/ui carries the slot id
    // "form-message" via aria-describedby, but the rendered DOM uses a
    // div with the role-less message text. The cleanest selector is
    // the [id$="-form-item-message"] convention shadcn emits.
    await waitFor(() => {
      const messages = container.querySelectorAll(
        '[id$="-form-item-message"]',
      );
      expect(messages.length).toBeGreaterThan(0);
    });

    // Crucially: no POST went out — validation must short-circuit
    // before the mutation fires.
    expect(
      calls.find(
        (c) => c.method === "POST" && c.url.includes("/api/auth/register"),
      ),
    ).toBeUndefined();
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

    // Beginner is the default selection so it carries the "active"
    // class and pro does not.
    expect(beginner.className).toMatch(/border-primary/);
    expect(pro.className).not.toMatch(/border-primary/);

    await act(async () => {
      fireEvent.click(pro);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("button-mode-pro").className,
      ).toMatch(/border-primary/);
    });
    expect(
      screen.getByTestId("button-mode-beginner").className,
    ).not.toMatch(/border-primary/);
  });
});
