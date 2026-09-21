/**
 * Component test for the TikTok "finish signup" page
 * (src/pages/tiktok-complete-signup.tsx). Landed on after a brand-new
 * TikTok sign-in — TikTok never returns an email, so this page collects
 * one before the account is actually created.
 *
 * Covers: the "Hi, {name}" greeting from GET /api/auth/tiktok/pending-signup,
 * a successful submit that POSTs the email, and the expired-session state
 * when the pending-signup lookup 404s.
 */
import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import TiktokCompleteSignupPage from "../tiktok-complete-signup";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

describe("TiktokCompleteSignupPage", () => {
  it("shows a greeting with the pending TikTok display name and submits the email", async () => {
    let posted: unknown = null;
    installFetchMock(
      [
        (url) =>
          url.includes("/api/auth/tiktok/pending-signup")
            ? jsonResponse({ displayName: "Sultan Trading", avatarUrl: null })
            : null,
        (url, init) => {
          if (url.includes("/api/auth/tiktok/complete-signup") && (init?.method ?? "GET").toUpperCase() === "POST") {
            posted = JSON.parse(init!.body as string);
            return jsonResponse(
              { token: "tok", user: { id: 1, email: "new@example.test", displayName: "Sultan Trading" } },
              201,
            );
          }
          return null;
        },
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TiktokCompleteSignupPage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("text-tiktok-signup-title")).toHaveTextContent("Sultan Trading");
    });

    await act(async () => {
      fireEvent.change(screen.getByTestId("input-tiktok-signup-email"), {
        target: { value: "new@example.test" },
      });
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-submit-tiktok-signup"));
    });

    await waitFor(() => {
      expect(posted).toEqual({ email: "new@example.test" });
    });
  });

  it("shows the expired-session state when there's no pending TikTok signup", async () => {
    installFetchMock(
      [(url) => (url.includes("/api/auth/tiktok/pending-signup") ? jsonResponse({ error: "not found" }, 404) : null)],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TiktokCompleteSignupPage />
      </Wrapper>,
    );

    expect(await screen.findByTestId("text-tiktok-signup-expired")).toBeInTheDocument();
    expect(screen.queryByTestId("form-tiktok-complete-signup")).not.toBeInTheDocument();
    expect(screen.getByTestId("link-back-to-login")).toBeInTheDocument();
  });
});
