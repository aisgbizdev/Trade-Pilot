/**
 * Component test for the Register page (`src/pages/register.tsx`).
 *
 * The manual email/password + security-question form was removed as a
 * deliberate product decision — sign-up is Google-only now (Google
 * already guarantees a verified email). This covers the resulting simple
 * page: the Google button, the consent text linking to /terms and
 * /privacy, the cross-link to /login, and — as a regression guard — that
 * none of the old manual-form controls come back.
 */
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import RegisterPage from "../register";
import { installFetchMock, makeWrapper } from "./test-helpers";

describe("RegisterPage", () => {
  it("renders only the Google sign-in path: button, consent links, and the /login cross-link", async () => {
    installFetchMock([]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );

    const googleButton = screen.getByTestId("button-google-signin");
    expect(googleButton).toBeInTheDocument();

    expect(screen.getByTestId("text-consent")).toBeInTheDocument();
    expect(screen.getByTestId("link-consent-terms")).toHaveAttribute("href", "/terms");
    expect(screen.getByTestId("link-consent-privacy")).toHaveAttribute("href", "/privacy");
    expect(screen.getByTestId("link-login")).toBeInTheDocument();

    // The three value-prop bullets fill the space below the card instead
    // of leaving it empty.
    expect(screen.getByTestId("item-register-value-prop-0")).toBeInTheDocument();
    expect(screen.getByTestId("item-register-value-prop-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-register-value-prop-2")).toBeInTheDocument();

    // Settle the AuthProvider query before the test ends.
    await waitFor(() => {
      expect(screen.getByTestId("button-google-signin")).toBeInTheDocument();
    });
  });

  it("never renders the retired manual email/password/security-question form", async () => {
    installFetchMock([]);
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("button-google-signin")).toBeInTheDocument();
    });

    for (const testId of [
      "form-register",
      "input-display-name",
      "input-email",
      "input-password",
      "select-security-question",
      "input-security-answer",
      "button-submit-register",
    ]) {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
    }
  });
});
