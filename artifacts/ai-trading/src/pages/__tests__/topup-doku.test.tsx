/**
 * DOKU Checkout redirect flow on the top-up page: selecting a
 * DOKU-tier package (>= Rp20.000) skips the QRIS/proof-upload UI and
 * redirects the browser straight to DOKU's hosted checkout page, and the
 * page correctly reads the ?doku=success|cancel&id=N return.
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

describe("TopupPage — DOKU Checkout redirect", () => {
  it("selecting a DOKU package and continuing calls the checkout endpoint and redirects, skipping the QRIS/proof step", async () => {
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

    // Shows the flat admin fee note on the package button before it's even
    // selected — the customer sees this before committing to anything.
    expect(await screen.findByTestId("text-preset-admin-fee-20000")).toHaveTextContent("5.000");

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-preset-20000"));
    });
    // And the total (package + fee) once selected, distinct from the bare
    // package price — the customer is never surprised by DOKU's own total.
    expect(await screen.findByTestId("text-credits-preview")).toHaveTextContent("25.000");

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-continue-topup"));
    });

    await waitFor(() => {
      expect(hrefSetter).toHaveBeenCalledWith("https://sandbox.doku.com/checkout-link-v2/abc123");
    });
    // The backend (not the frontend) is responsible for adding the admin
    // fee on top — the request to our own checkout endpoint still just
    // names the package.
    expect(checkoutRequestBody).toEqual({ amountRupiah: 20000 });
    // Never reveals the QRIS/proof-upload UI for a DOKU package.
    expect(screen.queryByTestId("card-qris")).not.toBeInTheDocument();
  });

  it("still shows the QRIS/proof step for the manual (Rp5.000) package", async () => {
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
