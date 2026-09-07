/**
 * Covers the "Top Up Credits" CTA added to the quota-exceeded dialog
 * (src/components/quota-dialog.tsx) for the credit top-up feature — it
 * should render only for the daily-scope block (the wall worth an
 * upsell; the hourly cap self-resolves within the hour) and navigate to
 * /topup when clicked.
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
  it("renders the top-up CTA for a daily-scope block and navigates to /topup on click", async () => {
    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "day", limit: 20, used: 20 });
    });

    const cta = await screen.findByTestId("button-quota-dialog-topup");
    act(() => {
      cta.click();
    });

    expect(window.location.pathname).toBe("/topup");
  });

  it("does not render the top-up CTA for an hourly-scope block", async () => {
    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "hour", limit: 5, used: 5 });
    });

    await screen.findByTestId("dialog-quota");
    expect(screen.queryByTestId("button-quota-dialog-topup")).not.toBeInTheDocument();
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
  });
});
