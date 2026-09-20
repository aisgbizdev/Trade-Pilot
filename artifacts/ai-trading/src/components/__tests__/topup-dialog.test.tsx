/**
 * Covers the top-up popup (src/components/topup-dialog.tsx) opened from
 * the quota-exceeded dialog's CTA (see quota-dialog.test.tsx for that
 * wiring). It renders the same package-select -> pay flow as the /topup
 * page (via the shared <TopupFlow>, see topup.test.tsx) but as a popup
 * that closes itself on a successful submit instead of navigating anywhere.
 */
import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { TopupDialog } from "../topup-dialog";
import { showTopupDialog, hideTopupDialog } from "@/hooks/use-topup-dialog";
import { installFetchMock, jsonResponse, makeWrapper } from "@/pages/__tests__/test-helpers";

const CONFIG_PAYLOAD = {
  packages: [
    { amountRupiah: 5000, credits: 15 },
    { amountRupiah: 20000, credits: 70 },
    { amountRupiah: 40000, credits: 150 },
    { amountRupiah: 80000, credits: 320 },
  ],
  qrisImageUrl: "/qris-gopay.jpeg",
};

afterEach(() => {
  act(() => {
    hideTopupDialog();
  });
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

  it("closes itself automatically once a top-up submits successfully", async () => {
    installFetchMock(
      [
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url, init) => {
          if (url.includes("/api/storage/uploads/request-url") && (init?.method ?? "GET").toUpperCase() === "POST") {
            return jsonResponse({ uploadURL: "https://upload.test/put", objectPath: "objects/proof.png" });
          }
          if (url === "https://upload.test/put") {
            return new Response(null, { status: 200 });
          }
          return null;
        },
        (url, init) => {
          if (url.includes("/api/topups") && !url.includes("mine") && (init?.method ?? "GET").toUpperCase() === "POST") {
            return jsonResponse(
              {
                id: 1,
                userId: 1,
                amountRupiah: 5000,
                creditsRequested: 15,
                conversionRateSnapshot: 333,
                paymentReferenceNote: null,
                proofObjectPath: "objects/proof.png",
                status: "approved",
                reviewedByUserId: null,
                reviewedAt: new Date().toISOString(),
                reviewNote: null,
                creditsGranted: 15,
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
    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-proof-notice-ack"));
    });

    const proofFile = new File(["fake-bytes"], "proof.png", { type: "image/png" });
    await act(async () => {
      fireEvent.change(screen.getByTestId("input-proof-file"), { target: { files: [proofFile] } });
    });
    await screen.findByTestId("img-proof-preview");

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-submit-topup"));
    });

    await waitFor(() => {
      expect(screen.queryByTestId("dialog-topup")).not.toBeInTheDocument();
    });
  });
});
