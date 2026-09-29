/**
 * Covers the top-up popup (src/components/topup-dialog.tsx) opened from
 * the quota-exceeded dialog's CTA (see quota-dialog.test.tsx for that
 * wiring). It renders the same package-select -> DOKU Checkout redirect
 * flow as the /topup page (via the shared <TopupFlow>, see
 * topup-doku.test.tsx) as a popup — since every package now redirects the
 * whole browser away to DOKU's hosted checkout page, there's no in-app
 * "submit" step left for the popup to close itself after.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { TopupDialog } from "../topup-dialog";
import { showTopupDialog, hideTopupDialog } from "@/hooks/use-topup-dialog";
import { installFetchMock, jsonResponse, makeWrapper } from "@/pages/__tests__/test-helpers";

const CONFIG_PAYLOAD = {
  packages: [
    { amountRupiah: 5000, credits: 15, dokuMethods: ["qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 20000, credits: 70, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 40000, credits: 150, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 80000, credits: 320, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
  ],
};

const originalLocation = window.location;

afterEach(() => {
  act(() => {
    hideTopupDialog();
  });
  Object.defineProperty(window, "location", { value: originalLocation, configurable: true, writable: true });
});

describe("TopupDialog", () => {
  it("is closed by default and renders the package picker once opened", async () => {
    installFetchMock(
      [(url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null)],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupDialog />
      </Wrapper>,
    );

    expect(screen.queryByTestId("dialog-topup")).not.toBeInTheDocument();

    act(() => {
      showTopupDialog();
    });

    expect(await screen.findByTestId("dialog-topup")).toBeInTheDocument();
    expect(await screen.findByTestId("button-preset-5000")).toBeInTheDocument();
  });

  it("choosing the QRIS-only Rp5.000 package redirects the browser to DOKU's checkout page", async () => {
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url, init) => {
          if (url.includes("/api/topups/doku/checkout") && (init?.method ?? "GET").toUpperCase() === "POST") {
            return jsonResponse(
              { id: 1, paymentUrl: "https://sandbox.doku.com/checkout-link-v2/from-dialog", expiresAt: new Date().toISOString() },
              201,
            );
          }
          return null;
        },
      ],
      { strict: false },
    );

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
          return "http://localhost/";
        },
      },
    });

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupDialog />
      </Wrapper>,
    );

    act(() => {
      showTopupDialog();
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-preset-5000"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-continue-topup"));
    });

    await waitFor(() => {
      expect(hrefSetter).toHaveBeenCalledWith("https://sandbox.doku.com/checkout-link-v2/from-dialog");
    });
  });
});
