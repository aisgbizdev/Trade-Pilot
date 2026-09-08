/**
 * Covers the "Top Up Credits" CTA on the quota-exceeded dialog
 * (src/components/quota-dialog.tsx). A purchased credit bypasses BOTH the
 * hourly and daily cap, so the CTA + hint show for either wall — but not
 * for `concurrent`, which is a per-user processing lock a credit can't skip.
 */
import { afterEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { QuotaDialog } from "../quota-dialog";
import { showQuotaDialog, hideQuotaDialog } from "@/hooks/use-quota-dialog";
import { LanguageProvider } from "@/lib/i18n";

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

afterEach(() => {
  act(() => {
    hideQuotaDialog();
  });
  window.history.replaceState({}, "", "/analyze");
});

describe("QuotaDialog top-up CTA", () => {
  it("renders the top-up CTA + hint for a daily-scope block and navigates to /topup on click", async () => {
    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "day", limit: 20, used: 20 });
    });

    expect(
      await screen.findByTestId("text-quota-dialog-topup-hint"),
    ).toBeInTheDocument();
    // Dismiss stays available, but as a quiet text link — not a co-equal button.
    expect(screen.getByTestId("button-quota-dialog-ok")).toBeInTheDocument();

    const cta = await screen.findByTestId("button-quota-dialog-topup");
    act(() => {
      cta.click();
    });

    expect(window.location.pathname).toBe("/topup");
  });

  it("still lets the user dismiss the upsell without topping up", async () => {
    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "day", limit: 20, used: 20 });
    });

    const dismiss = await screen.findByTestId("button-quota-dialog-ok");
    act(() => {
      dismiss.click();
    });

    expect(window.location.pathname).toBe("/analyze");
    expect(screen.queryByTestId("dialog-quota")).not.toBeInTheDocument();
  });

  it("renders the top-up CTA for an hourly-scope block (a credit skips the wait)", async () => {
    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "hour", limit: 5, used: 5 });
    });

    await screen.findByTestId("dialog-quota");
    expect(screen.getByTestId("button-quota-dialog-topup")).toBeInTheDocument();
    expect(screen.getByTestId("text-quota-dialog-topup-hint")).toBeInTheDocument();
  });

  it("does not render the top-up CTA for a concurrent-scope block", async () => {
    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "concurrent" });
    });

    await screen.findByTestId("dialog-quota");
    expect(screen.queryByTestId("button-quota-dialog-topup")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("text-quota-dialog-topup-hint"),
    ).not.toBeInTheDocument();
  });
});
