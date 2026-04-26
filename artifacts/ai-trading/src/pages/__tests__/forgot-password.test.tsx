/**
 * Component test for the Forgot Password flow
 * (`src/pages/forgot-password.tsx`).
 *
 * `forgot-password.tsx` owns the entire reset journey as a four-step
 * state machine driven by the local `step` state — `email →
 * question → reset → done`. There is no separate `reset-password.tsx`
 * page in the codebase; the "reset password" form lives inside this
 * page's `step === "reset"` branch (see the task notes).
 *
 * Coverage:
 * - happy-path render of the email step (input + CTA + back-to-login).
 * - branching state: after a successful question lookup the page
 *   transitions into the security-question step.
 * - user action: submitting the email step POSTs to
 *   `/api/auth/forgot-password/question` with the typed-in email.
 * - "reset" branch: the full happy-path through to the success card,
 *   asserting that `POST /api/auth/forgot-password/reset` fires with
 *   the resolved reset token and the new password.
 *
 * The page is rendered outside `<Layout>` so the only baseline fetches
 * are the AuthProvider's `/api/auth/me` (covered by the helper
 * default) — every other route must have an explicit handler in this
 * file.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import ForgotPasswordPage from "../forgot-password";
import {
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "./test-helpers";

const SECURITY_QUESTION_PAYLOAD = {
  // The forgot-password page maps the canonical (Indonesian) string
  // back to the active language via `fromCanonicalSecurityQuestion`,
  // but the answer-step UI itself only asserts the question is shown.
  // Pass any truthy string here.
  securityQuestion: "Nama hewan peliharaan pertama Anda?",
};

const RESET_TOKEN_PAYLOAD = {
  resetToken: "rt_test_token_xyz",
};

function forgotPasswordHandlers(opts: {
  questionStatus?: number;
  questionBody?: unknown;
  verifyStatus?: number;
  verifyBody?: unknown;
  resetStatus?: number;
  resetBody?: unknown;
} = {}): FetchHandler[] {
  return [
    (url, init) => {
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "POST") return null;
      if (!url.includes("/api/auth/forgot-password/question")) return null;
      const status = opts.questionStatus ?? 200;
      if (status >= 400) {
        return jsonResponse(opts.questionBody ?? { error: "not found" }, status);
      }
      return jsonResponse(opts.questionBody ?? SECURITY_QUESTION_PAYLOAD);
    },
    (url, init) => {
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "POST") return null;
      if (!url.includes("/api/auth/forgot-password/verify")) return null;
      const status = opts.verifyStatus ?? 200;
      if (status >= 400) {
        return jsonResponse(opts.verifyBody ?? { error: "wrong answer" }, status);
      }
      return jsonResponse(opts.verifyBody ?? RESET_TOKEN_PAYLOAD);
    },
    (url, init) => {
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "POST") return null;
      if (!url.includes("/api/auth/forgot-password/reset")) return null;
      const status = opts.resetStatus ?? 200;
      if (status >= 400) {
        return jsonResponse(opts.resetBody ?? { error: "boom" }, status);
      }
      return jsonResponse(opts.resetBody ?? { message: "ok" });
    },
  ];
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, "", "/forgot-password");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ForgotPasswordPage: happy-path render", () => {
  it("renders the email step with the input, the find-account CTA and the back-to-login link", async () => {
    installFetchMock(forgotPasswordHandlers());
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <ForgotPasswordPage />
      </Wrapper>,
    );

    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("button-find-account")).toBeInTheDocument();
    expect(screen.getByTestId("link-back-to-login")).toBeInTheDocument();

    // None of the later-step controls are mounted on first render.
    expect(
      screen.queryByTestId("input-security-answer"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("input-new-password")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-go-to-login")).not.toBeInTheDocument();

    // Let the AuthProvider settle so its query is not pending after
    // the test ends (avoids "act" warnings from React).
    await waitFor(() => {
      expect(screen.getByTestId("input-email")).toBeInTheDocument();
    });
  });
});

describe("ForgotPasswordPage: question step branch", () => {
  it("transitions from email → question step after a successful question lookup and shows the resolved security question", async () => {
    installFetchMock(forgotPasswordHandlers());
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <ForgotPasswordPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.change(screen.getByTestId("input-email"), {
        target: { value: "trader@example.com" },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-find-account"));
    });

    // The question-step input only mounts after `setStep("question")`
    // commits, which is the proof of the email→question transition.
    expect(
      await screen.findByTestId("input-security-answer"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("button-verify-answer")).toBeInTheDocument();

    // The email-step CTA must be gone now that we are on a different step.
    expect(screen.queryByTestId("button-find-account")).not.toBeInTheDocument();
  });
});

describe("ForgotPasswordPage: user actions", () => {
  it("POSTs to /api/auth/forgot-password/question with the typed-in email when the email form is submitted", async () => {
    const { calls } = installFetchMock(forgotPasswordHandlers());
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <ForgotPasswordPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.change(screen.getByTestId("input-email"), {
        target: { value: "trader@example.com" },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-find-account"));
    });

    await waitFor(() => {
      const post = calls.find(
        (c) =>
          c.method === "POST" &&
          c.url.includes("/api/auth/forgot-password/question"),
      );
      expect(post).toBeDefined();
      const payload = post?.body ? JSON.parse(post.body) : null;
      expect(payload?.email).toBe("trader@example.com");
    });
  });

  it("walks email → question → reset → done and POSTs the reset token + new password to /api/auth/forgot-password/reset", async () => {
    const { calls } = installFetchMock(forgotPasswordHandlers());
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <ForgotPasswordPage />
      </Wrapper>,
    );

    // Step 1: email
    await act(async () => {
      fireEvent.change(screen.getByTestId("input-email"), {
        target: { value: "trader@example.com" },
      });
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-find-account"));
    });

    // Step 2: security answer
    const answer = (await screen.findByTestId(
      "input-security-answer",
    )) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(answer, { target: { value: "fluffy" } });
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-verify-answer"));
    });

    // Step 3: new password
    const newPassword = (await screen.findByTestId(
      "input-new-password",
    )) as HTMLInputElement;
    const confirmPassword = (await screen.findByTestId(
      "input-confirm-password",
    )) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(newPassword, { target: { value: "supersecret" } });
      fireEvent.change(confirmPassword, { target: { value: "supersecret" } });
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-reset-password"));
    });

    // Reset POST must fire with the token returned by the verify step.
    await waitFor(() => {
      const reset = calls.find(
        (c) =>
          c.method === "POST" &&
          c.url.includes("/api/auth/forgot-password/reset"),
      );
      expect(reset).toBeDefined();
      const payload = reset?.body ? JSON.parse(reset.body) : null;
      expect(payload?.resetToken).toBe(RESET_TOKEN_PAYLOAD.resetToken);
      expect(payload?.newPassword).toBe("supersecret");
    });

    // Step 4: done — the success card with the "Back to login" CTA renders.
    expect(
      await screen.findByTestId("button-go-to-login"),
    ).toBeInTheDocument();

    // The back-to-login top link is suppressed on the success card.
    expect(
      screen.queryByTestId("link-back-to-login"),
    ).not.toBeInTheDocument();
  });
});
