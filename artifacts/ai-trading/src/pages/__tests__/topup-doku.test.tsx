/**
 * Payment-method choice + DOKU Checkout redirect flow on the top-up page:
 * selecting a DOKU-tier package (>= Rp20.000) opens a VA-vs-QRIS method
 * dialog (TEMPORARY — see chat — while DOKU's own QRIS/e-wallet channels
 * are pending verification). Choosing VA redirects to DOKU's hosted
 * checkout page (with the admin fee); choosing QRIS falls back to the same
 * manual/QRIS flow the Rp5.000 package always used, for the full package
 * amount with no fee. Also covers the page correctly reading the
 * ?doku=success|cancel&id=N return.
 */
import { describe, expect, it, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import TopupPage from "../topup";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

const CONFIG_PAYLOAD = {
  packages: [
    { amountRupiah: 5000, credits: 15, provider: "manual", adminFeeRupiah: 0 },
    { amountRupiah: 20000, credits: 70, provider: "doku", adminFeeRupiah: 5000 },
    { amountRupiah: 40000, credits: 150, provider: "doku", adminFeeRupiah: 5000 },
    { amountRupiah: 80000, credits: 320, provider: "doku", adminFeeRupiah: 5000 },
  ],
  qrisImageUrl: "/qris-gopay.jpeg",
};

const originalLocation = window.location;

afterEach(() => {
  // jsdom's Location.href is non-configurable, so it can't be stubbed with
  // Object.defineProperty(window.location, "href", ...) directly — instead
  // the redirect test replaces `window.location` itself (which IS a
  // configurable, writable property of `window`) with a plain object.
  // Restore the real one here so later tests get real pathname/search back.
  Object.defineProperty(window, "location", { value: originalLocation, configurable: true, writable: true });
  window.history.replaceState({}, "", "/topup");
});

describe("TopupPage — payment-method choice for a DOKU-tier package", () => {
  it("opens a method dialog instead of redirecting immediately, showing the admin fee only on the VA option", async () => {
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 0 }) : null),
        (url) => (url.includes("/api/topups/mine") ? jsonResponse({ requests: [], total: 0, page: 1, limit: 20 }) : null),
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-preset-20000"));
    });
    // No fee shown on the plain package-select screen anymore — it's
    // decided by which method the customer picks in the dialog below.
    expect(screen.queryByTestId("text-preset-admin-fee-20000")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-continue-topup"));
    });

    expect(await screen.findByTestId("dialog-payment-method")).toBeInTheDocument();
    expect(screen.getByTestId("text-method-va-fee")).toHaveTextContent("5.000");
    expect(screen.getByTestId("text-method-va-fee")).toHaveTextContent("25.000");
    // Never redirects or reveals QRIS just from opening the dialog.
    expect(screen.queryByTestId("card-qris")).not.toBeInTheDocument();
  });

  it("choosing VA calls the DOKU checkout endpoint (package amount only) and redirects", async () => {
    let checkoutRequestBody: unknown = null;
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 0 }) : null),
        (url) => (url.includes("/api/topups/mine") ? jsonResponse({ requests: [], total: 0, page: 1, limit: 20 }) : null),
        (url, init) => {
          if (url.includes("/api/topups/doku/checkout") && (init?.method ?? "GET").toUpperCase() === "POST") {
            checkoutRequestBody = JSON.parse(init!.body as string);
            return jsonResponse(
              { id: 42, paymentUrl: "https://sandbox.doku.com/checkout-link-v2/abc123", expiresAt: new Date().toISOString() },
              201,
            );
          }
          return null;
        },
      ],
      { strict: false },
    );

    // jsdom's Location.href is non-configurable, so it can't be stubbed in
    // place — replace `window.location` itself instead, with an object
    // that carries real string snapshots of pathname/search/origin (never
    // `{ ...window.location }`, which silently yields an empty object
    // since Location's real properties are prototype accessors, not own
    // enumerable ones). Restored in afterEach.
    const hrefSetter = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        pathname: window.location.pathname,
        search: window.location.search,
        origin: window.location.origin,
        set href(v: string) {
          hrefSetter(v);
        },
        get href() {
          return "http://localhost/topup";
        },
      },
    });

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-preset-20000"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-continue-topup"));
    });
    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-method-va"));
    });

    await waitFor(() => {
      expect(hrefSetter).toHaveBeenCalledWith("https://sandbox.doku.com/checkout-link-v2/abc123");
    });
    // The backend (not the frontend) is responsible for adding the admin
    // fee on top — the request to our own checkout endpoint still just
    // names the package.
    expect(checkoutRequestBody).toEqual({ amountRupiah: 20000 });
    expect(screen.queryByTestId("card-qris")).not.toBeInTheDocument();
  });

  it("choosing QRIS falls back to the manual/QRIS flow for the full package amount, no fee", async () => {
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 0 }) : null),
        (url) => (url.includes("/api/topups/mine") ? jsonResponse({ requests: [], total: 0, page: 1, limit: 20 }) : null),
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-preset-20000"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-continue-topup"));
    });
    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-method-qris"));
    });

    expect(await screen.findByTestId("card-qris")).toBeInTheDocument();
    // The full package amount (Rp20.000), not package + fee.
    expect(screen.getByTestId("text-pay-summary")).toHaveTextContent("20.000");
    expect(screen.queryByTestId("dialog-payment-method")).not.toBeInTheDocument();
  });

  it("still skips straight to the QRIS/proof step for the manual-only (Rp5.000) package — no method dialog", async () => {
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 0 }) : null),
        (url) => (url.includes("/api/topups/mine") ? jsonResponse({ requests: [], total: 0, page: 1, limit: 20 }) : null),
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-preset-5000"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-continue-topup"));
    });

    expect(await screen.findByTestId("card-qris")).toBeInTheDocument();
    expect(screen.queryByTestId("dialog-payment-method")).not.toBeInTheDocument();
  });
});

describe("TopupPage — DOKU return handling", () => {
  it("shows a cancelled message for ?doku=cancel and strips the query string", async () => {
    window.history.replaceState({}, "", "/topup?doku=cancel&id=42");
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 0 }) : null),
        (url) => (url.includes("/api/topups/mine") ? jsonResponse({ requests: [], total: 0, page: 1, limit: 20 }) : null),
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupPage />
      </Wrapper>,
    );

    expect(await screen.findByTestId("card-doku-return-status")).toHaveTextContent(/dibatalkan|cancelled/i);
    expect(window.location.search).toBe("");
  });

  it("polls the status endpoint for ?doku=success and shows a success message once approved", async () => {
    window.history.replaceState({}, "", "/topup?doku=success&id=42");
    let pollCount = 0;
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 0 }) : null),
        (url) => (url.includes("/api/topups/mine") ? jsonResponse({ requests: [], total: 0, page: 1, limit: 20 }) : null),
        (url) => {
          if (url.includes("/api/topups/doku/42/status")) {
            pollCount += 1;
            return jsonResponse({ id: 42, status: pollCount === 1 ? "pending" : "approved" });
          }
          return null;
        },
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupPage />
      </Wrapper>,
    );

    expect(await screen.findByTestId("card-doku-return-status")).toHaveTextContent(/diproses|process/i);
    await waitFor(
      () => {
        expect(screen.getByTestId("card-doku-return-status")).toHaveTextContent(/berhasil|successful/i);
      },
      { timeout: 5000 },
    );
  });
});
