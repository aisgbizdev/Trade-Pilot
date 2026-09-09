/**
 * Component test for the credit top-up page (src/pages/topup.tsx).
 *
 * Covers the 2-step wizard: step 1 picks an amount — a preset chip or a
 * free-text field (QRIS hidden) — and step 2 reveals the QRIS image +
 * conversion-rate copy from GET /api/topups/config, the balance card,
 * the live "≈ N credits" preview, submitting a top-up request, and the
 * history list rendering past requests with a status badge.
 */
import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import TopupPage from "../topup";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

const CONFIG_PAYLOAD = { rupiahPerCredit: 250, qrisImageUrl: "/qris-gopay.jpeg" };

describe("TopupPage", () => {
  it("hides the QRIS until an amount is submitted, then reveals it on step 2", async () => {
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

    // Step 1: QRIS must not be visible yet.
    expect(screen.queryByTestId("img-qris")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-preset-5000"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-continue-topup"));
    });

    // Step 2: QRIS now revealed.
    expect(await screen.findByTestId("img-qris")).toHaveAttribute("src", "/qris-gopay.jpeg");
  });

  it("shows a live credits preview for a preset amount and submits a top-up request", async () => {
    let created: unknown = null;
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/topups/balance") ? jsonResponse({ balance: 0 }) : null),
        (url) => (url.includes("/api/topups/mine") ? jsonResponse({ requests: [], total: 0, page: 1, limit: 20 }) : null),
        (url, init) => {
          if (url.includes("/api/topups") && !url.includes("mine") && (init?.method ?? "GET").toUpperCase() === "POST") {
            created = JSON.parse(init!.body as string);
            return jsonResponse(
              {
                id: 1,
                userId: 1,
                amountRupiah: 5000,
                creditsRequested: 20,
                conversionRateSnapshot: 250,
                paymentReferenceNote: null,
                proofObjectPath: null,
                status: "pending",
                reviewedByUserId: null,
                reviewedAt: null,
                reviewNote: null,
                creditsGranted: null,
                createdAt: new Date().toISOString(),
              },
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
        <TopupPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-preset-5000"));
    });
    expect(await screen.findByTestId("text-credits-preview")).toHaveTextContent("20");

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-continue-topup"));
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-submit-topup"));
    });

    await waitFor(() => {
      expect(created).toMatchObject({ amountRupiah: 5000 });
    });
  });

  it("offers preset amounts plus a free-text field for another amount", async () => {
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

    for (const preset of [5000, 10000, 15000, 20000]) {
      expect(await screen.findByTestId(`button-preset-${preset}`)).toBeInTheDocument();
    }

    await act(async () => {
      fireEvent.change(await screen.findByTestId("input-topup-amount"), { target: { value: "50000" } });
    });
    expect(await screen.findByTestId("text-credits-preview")).toHaveTextContent("200");
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
