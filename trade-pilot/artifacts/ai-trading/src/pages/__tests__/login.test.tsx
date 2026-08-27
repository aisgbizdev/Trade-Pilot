/**
 * Component test for the Login form (`src/pages/login.tsx`).
 *
 * Covers the happy-path render of the form fields and submit button,
 * the reset-success banner branch (driven by the
 * `password_reset_success` flag in `sessionStorage` left behind by the
 * forgot-password flow), and a real form submission that POSTs to
 * `/api/auth/login` with the typed-in credentials.
 *
 * The Login page is **not** mounted inside `<Layout>` so it does not
 * fire the bell-poll or the SSE stream, but the shared `Wrapper` still
 * mounts `<AuthProvider>` which calls `/api/auth/me`. The default
 * handler in `installFetchMock` returns a logged-in user there — the
 * Login page itself does not redirect on auth state, it just renders
 * the form.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import LoginPage from "../login";
import {
  TEST_USER,
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

function loginHandler(opts: {
  status?: number;
  body?: unknown;
}): FetchHandler {
  return (url, init) => {
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "POST") return null;
    if (!url.includes("/api/auth/login")) return null;
    const status = opts.status ?? 200;
    if (status >= 400) {
      return jsonResponse(opts.body ?? { error: "invalid credentials" }, status);
    }
    return jsonResponse(opts.body ?? TEST_USER);
  };
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, "", "/login");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("LoginPage: happy-path render", () => {
  it("renders the email + password inputs, the remember-me checkbox and the submit button", async () => {
    installFetchMock([loginHandler({})]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>,
    );

    // Form scaffold renders synchronously — the page itself does not
    // wait on any data query before showing the form.
    expect(screen.getByTestId("form-login")).toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-remember-me")).toBeInTheDocument();
    expect(screen.getByTestId("button-submit-login")).toBeInTheDocument();
    expect(screen.getByTestId("link-forgot-password")).toBeInTheDocument();
    expect(screen.getByTestId("link-register")).toBeInTheDocument();

    // Reset-success banner is hidden on a fresh load (no
    // `password_reset_success` flag in sessionStorage).
    expect(
      screen.queryByTestId("banner-reset-success"),
    ).not.toBeInTheDocument();

    // Let the AuthProvider settle so its query is not pending after
    // the test ends (avoids "act" warnings from React).
    await waitFor(() => {
      expect(screen.getByTestId("form-login")).toBeInTheDocument();
    });
  });
});

describe("LoginPage: reset-success banner branch", () => {
  it("renders the reset-success banner when sessionStorage has the password_reset_success flag set", async () => {
    sessionStorage.setItem("password_reset_success", "1");
    installFetchMock([loginHandler({})]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>,
    );

    expect(
      await screen.findByTestId("banner-reset-success"),
    ).toBeInTheDocument();
    // The flag is consumed on read, so it should be cleared from
    // sessionStorage after the page mounts.
    expect(sessionStorage.getItem("password_reset_success")).toBeNull();
  });
});

describe("LoginPage: validation-error branch", () => {
  it("renders inline FormMessage errors and never fires POST /api/auth/login when the form is submitted blank", async () => {
    const { calls } = installFetchMock([loginHandler({})]);
    const { Wrapper } = makeWrapper();

    const { container } = render(
      <Wrapper>
        <LoginPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.submit(screen.getByTestId("form-login"));
    });

    // RHF + the v5 zod-v4 resolver should map the empty-field schema
    // errors into per-field FormMessage nodes
    // (`<p id="…-form-item-message">`).
    await waitFor(() => {
      const messages = container.querySelectorAll(
        '[id$="-form-item-message"]',
      );
      expect(messages.length).toBeGreaterThan(0);
    });

    // Validation must short-circuit before the mutation fires.
    expect(
      calls.find(
        (c) => c.method === "POST" && c.url.includes("/api/auth/login"),
      ),
    ).toBeUndefined();
  });
});

describe("LoginPage: user actions", () => {
  it("POSTs to /api/auth/login with the typed-in email + password when the form is submitted", async () => {
    const { calls } = installFetchMock([loginHandler({})]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>,
    );

    const email = screen.getByTestId("input-email") as HTMLInputElement;
    const password = screen.getByTestId("input-password") as HTMLInputElement;

    await act(async () => {
      fireEvent.change(email, { target: { value: "trader@example.com" } });
      fireEvent.change(password, { target: { value: "supersecret" } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("form-login"));
    });

    await waitFor(() => {
      const post = calls.find(
        (c) => c.method === "POST" && c.url.includes("/api/auth/login"),
      );
      expect(post).toBeDefined();
      const payload = post?.body ? JSON.parse(post.body) : null;
      expect(payload?.email).toBe("trader@example.com");
      expect(payload?.password).toBe("supersecret");
    });
  });

  it("navigates to /dashboard after a successful login response", async () => {
    installFetchMock([loginHandler({})]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.change(screen.getByTestId("input-email"), {
        target: { value: "trader@example.com" },
      });
      fireEvent.change(screen.getByTestId("input-password"), {
        target: { value: "supersecret" },
      });
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("form-login"));
    });

    // wouter pushes the new path onto the HTML5 history stack; after
    // login.mutateAsync resolves the page should land on /dashboard.
    await waitFor(() => {
      expect(window.location.pathname).toBe("/dashboard");
    });
  });
});
