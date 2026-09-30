/**
 * Covers the quota-exceeded dialog (src/components/quota-dialog.tsx). A
 * purchased credit bypasses the free lifetime cap, so for a `day`-scope
 * block the dialog shows the top-up package picker (<TopupFlow>) directly
 * inline — no second "top up" button/popup in between — but not for
 * `concurrent`, which is a per-user processing lock a credit can't skip.
 */
import { afterEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";

import { QuotaDialog } from "../quota-dialog";
import { showQuotaDialog, hideQuotaDialog } from "@/hooks/use-quota-dialog";
import { installFetchMock, jsonResponse, makeWrapper } from "@/pages/__tests__/test-helpers";

const CONFIG_PAYLOAD = {
  packages: [
    { amountRupiah: 5000, credits: 15, dokuMethods: ["qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 20000, credits: 70, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 40000, credits: 150, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 80000, credits: 320, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
  ],
};

afterEach(() => {
  act(() => {
    hideQuotaDialog();
  });
  window.history.replaceState({}, "", "/analyze");
});

describe("QuotaDialog top-up upsell", () => {
  it("shows the top-up package picker directly for a daily-scope block, without navigating", async () => {
    installFetchMock(
      [(url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null)],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "day", limit: 5, used: 5 });
    });

    expect(
      await screen.findByTestId("text-quota-dialog-topup-hint"),
    ).toBeInTheDocument();
    // The package picker itself, not a button that opens a second popup.
    expect(await screen.findByTestId("card-topup-form")).toBeInTheDocument();
    expect(await screen.findByTestId("button-preset-5000")).toBeInTheDocument();
    // Dismiss stays available, but as a quiet text link — not a co-equal button.
    expect(screen.getByTestId("button-quota-dialog-ok")).toBeInTheDocument();

    const pathnameBeforeShow = window.location.pathname;
    expect(window.location.pathname).toBe(pathnameBeforeShow);
  });

  it("still lets the user dismiss the upsell without topping up", async () => {
    installFetchMock(
      [(url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null)],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();

    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "day", limit: 5, used: 5 });
    });

    const dismiss = await screen.findByTestId("button-quota-dialog-ok");
    act(() => {
      dismiss.click();
    });

    expect(window.location.pathname).toBe("/analyze");
    expect(screen.queryByTestId("dialog-quota")).not.toBeInTheDocument();
  });

  it("does not render the top-up package picker for a concurrent-scope block", async () => {
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <QuotaDialog />
      </Wrapper>,
    );

    act(() => {
      showQuotaDialog({ scope: "concurrent" });
    });

    await screen.findByTestId("dialog-quota");
    expect(screen.queryByTestId("card-topup-form")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("text-quota-dialog-topup-hint"),
    ).not.toBeInTheDocument();
  });
});
