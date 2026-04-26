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
import * as React from "react";

// Replace the Radix-based Select with a plain native <select> for the
// duration of this test file. Radix Select renders to a portal,
// listens for pointer events with the `[data-pointer-events: none]`
// guard, and is essentially impossible to drive deterministically in
// jsdom. The component under test only depends on the public
// `onValueChange(value: string)` contract, which a native <select>
// satisfies.
vi.mock("@/components/ui/select", () => {
  type Ctx = { onValueChange?: (v: string) => void };
  const SelectCtx = React.createContext<Ctx>({});
  return {
    Select: ({
      children,
      onValueChange,
    }: {
      children: React.ReactNode;
      onValueChange?: (v: string) => void;
    }) => (
      <SelectCtx.Provider value={{ onValueChange }}>
        {children}
      </SelectCtx.Provider>
    ),
    SelectTrigger: ({
      children,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement>) => {
      const ctx = React.useContext(SelectCtx);
      return (
        <div {...rest}>
          {children}
          <select
            data-testid="native-security-question"
            onChange={(e) => ctx.onValueChange?.(e.target.value)}
          >
            <option value="">--</option>
            <option value="first_pet">first_pet</option>
          </select>
        </div>
      );
    },
    SelectValue: ({ placeholder }: { placeholder?: string }) => (
      <span>{placeholder}</span>
    ),
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    SelectItem: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: string;
    }) => <option value={value}>{children}</option>,
  };
});

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
  it("renders inline FormMessage errors and never fires POST /api/auth/register when the form is submitted blank", async () => {
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

    // RHF + the v5 zod-v4 resolver should now map the schema errors
    // into per-field FormMessage nodes (`<p id="…-form-item-message">`).
    await waitFor(() => {
      const messages = container.querySelectorAll(
        '[id$="-form-item-message"]',
      );
      expect(messages.length).toBeGreaterThan(0);
    });

    // The security invariant: validation must short-circuit before
    // the mutation fires, so no POST went out.
    expect(
      calls.find(
        (c) => c.method === "POST" && c.url.includes("/api/auth/register"),
      ),
    ).toBeUndefined();
  });
});

describe("RegisterPage: success submit", () => {
  it("POSTs valid registration data to /api/auth/register and navigates to /dashboard", async () => {
    const { calls } = installFetchMock([registerHandler({})]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );

    const displayName = screen.getByTestId(
      "input-display-name",
    ) as HTMLInputElement;
    const email = screen.getByTestId("input-email") as HTMLInputElement;
    const password = screen.getByTestId("input-password") as HTMLInputElement;
    const securityAnswer = screen.getByTestId(
      "input-security-answer",
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(displayName, { target: { value: "Jane Trader" } });
      fireEvent.change(email, { target: { value: "jane@example.com" } });
      fireEvent.change(password, { target: { value: "supersecret123" } });
      fireEvent.change(securityAnswer, { target: { value: "Fluffy" } });
    });

    // The security-question Select is mocked at the top of this file
    // to render a plain native <select> that exposes the same
    // `onValueChange` contract — pick the only valid option to
    // satisfy the `securityQuestion: z.string().min(1)` schema.
    await act(async () => {
      fireEvent.change(screen.getByTestId("native-security-question"), {
        target: { value: "first_pet" },
      });
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("form-register"));
    });

    await waitFor(() => {
      const post = calls.find(
        (c) => c.method === "POST" && c.url.includes("/api/auth/register"),
      );
      expect(post).toBeDefined();
      const payload = post?.body ? JSON.parse(post.body) : null;
      expect(payload?.email).toBe("jane@example.com");
      expect(payload?.displayName).toBe("Jane Trader");
      expect(payload?.password).toBe("supersecret123");
    });

    // wouter writes navigations into the HTML5 history API; after a
    // successful submit the page should have pushed `/dashboard`.
    await waitFor(() => {
      expect(window.location.pathname).toBe("/dashboard");
    });
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
