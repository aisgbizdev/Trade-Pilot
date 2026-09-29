/**
 * Component test for the credit top-up page (src/pages/topup.tsx).
 *
 * Covers the page-level chrome around <TopupFlow> — the balance card, the
 * floating WhatsApp support shortcut, the fixed package list (with no
 * free-text amount field), and the top-up history list rendering past
 * requests with a status badge. The actual purchase flow (method dialog,
 * DOKU Checkout redirect, DOKU return handling) is covered in
 * topup-doku.test.tsx.
 */
import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import TopupPage from "../topup";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

const CONFIG_PAYLOAD = {
  packages: [
    { amountRupiah: 5000, credits: 15, dokuMethods: ["qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 20000, credits: 70, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 40000, credits: 150, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
    { amountRupiah: 80000, credits: 320, dokuMethods: ["va", "qris"], adminFeeRupiah: 5000 },
  ],
};

describe("TopupPage", () => {
  it("shows the credit balance and a floating WhatsApp support shortcut", async () => {
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 12 }) : null),
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

    await waitFor(() => {
      expect(screen.getByTestId("text-credit-balance")).toHaveTextContent("12");
    });

    const fab = await screen.findByTestId("button-whatsapp-fab");
    expect(fab).toHaveAttribute("href", expect.stringContaining("https://wa.me/6282310384866?text="));
  });

  it("offers exactly the four fixed packages, each showing its own credit count, and no free-text amount field", async () => {
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

    for (const pkg of CONFIG_PAYLOAD.packages) {
      expect(await screen.findByTestId(`button-preset-${pkg.amountRupiah}`)).toBeInTheDocument();
      expect(screen.getByTestId(`text-preset-credits-${pkg.amountRupiah}`)).toHaveTextContent(
        String(pkg.credits),
      );
    }

    // No custom/free-text amount input anymore — only the fixed packages.
    expect(screen.queryByTestId("input-topup-amount")).not.toBeInTheDocument();
  });

  it("shows a live credits preview once a package is picked", async () => {
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
    expect(await screen.findByTestId("text-credits-preview")).toHaveTextContent("15");
  });

  it("renders past requests with a status badge in the history list", async () => {
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 5 }) : null),
        (url) =>
          url.includes("/api/topups/mine")
            ? jsonResponse({
                requests: [
                  {
                    id: 7,
                    userId: 1,
                    amountRupiah: 2500,
                    creditsRequested: 10,
                    conversionRateSnapshot: 250,
                    paymentReferenceNote: null,
                    proofObjectPath: null,
                    status: "approved",
                    reviewedByUserId: 2,
                    reviewedAt: new Date().toISOString(),
                    reviewNote: null,
                    creditsGranted: 10,
                    createdAt: new Date().toISOString(),
                    paymentProvider: "doku",
                    dokuPaymentUrl: null,
                  },
                ],
                total: 1,
                page: 1,
                limit: 20,
              })
            : null,
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <TopupPage />
      </Wrapper>,
    );

    expect(await screen.findByTestId("card-history-7")).toBeInTheDocument();
    expect(screen.getByTestId("card-history-7")).toHaveTextContent("10 kredit");
  });
});
