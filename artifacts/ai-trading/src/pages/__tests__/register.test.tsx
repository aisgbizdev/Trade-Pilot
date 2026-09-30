/**
 * Component test for the Register page (`src/pages/register.tsx`).
 *
 * The manual email/password + security-question form was removed as a
 * deliberate product decision — sign-up is social-only now (Google,
 * Facebook, or TikTok via the same <SocialSignInMenu> dropdown login.tsx
 * uses; a verified social account already solves what the manual form's
 * security question never did). This covers the resulting simple page:
 * the dropdown, the consent text linking to /terms and /privacy, the
 * cross-link to /login, and — as a regression guard — that none of the
 * old manual-form controls come back.
 */
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RegisterPage from "../register";
import { installFetchMock, makeWrapper } from "./test-helpers";

describe("RegisterPage", () => {
  it("renders the social sign-in dropdown (Google/Facebook/TikTok), consent links, and the /login cross-link", async () => {
    installFetchMock([]);
    const { Wrapper } = makeWrapper();

    const user = userEvent.setup();
    render(
      <Wrapper>
        <RegisterPage />
      </Wrapper>,
    );

    const menuTrigger = screen.getByTestId("button-social-signin-menu");
    expect(menuTrigger).toBeInTheDocument();
    // Radix's DropdownMenuTrigger opens on a real pointer-down sequence,
    // not a bare synthetic `click` — userEvent dispatches that full
    // sequence the way a real browser would.
    await user.click(menuTrigger);
    expect(await screen.findByTestId("button-google-signin")).toBeInTheDocument();
    expect(screen.getByTestId("button-facebook-signin")).toBeInTheDocument();
    expect(screen.getByTestId("button-tiktok-signin")).toBeInTheDocument();

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
      expect(screen.getByTestId("button-social-signin-menu")).toBeInTheDocument();
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
      expect(screen.getByTestId("button-social-signin-menu")).toBeInTheDocument();
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
