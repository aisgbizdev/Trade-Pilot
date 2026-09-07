/**
 * Component test for the admin credit top-up review page
 * (src/pages/admin-topups.tsx).
 *
 * Covers the super_admin-only role gate (ProtectedRoute renders nothing
 * for a plain user), rendering the pending-requests list with requester
 * email, and approving a request through the review dialog.
 */
import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import AdminTopupsPage from "../admin-topups";
import { installFetchMock, jsonResponse, makeWrapper, TEST_USER } from "./test-helpers";

const CONFIG_PAYLOAD = { rupiahPerCredit: 250, qrisImageUrl: "/qris-gopay.jpeg" };

const PENDING_LIST = {
  requests: [
    {
      id: 9,
      userId: 5,
      amountRupiah: 1750,
      creditsRequested: 7,
      conversionRateSnapshot: 250,
      paymentReferenceNote: "transfer via app",
      proofObjectPath: null,
      status: "pending",
      reviewedByUserId: null,
      reviewedAt: null,
      reviewNote: null,
      creditsGranted: null,
      createdAt: new Date().toISOString(),
      userEmail: "buyer@example.test",
      userDisplayName: "Buyer Example",
    },
  ],
  total: 1,
  page: 1,
  limit: 20,
};

function asRole(role: "user" | "admin" | "super_admin") {
  return (url: string) =>
    url.includes("/api/auth/me") ? jsonResponse({ ...TEST_USER, role }) : null;
}

describe("AdminTopupsPage", () => {
  it("renders nothing for a plain user (role gate)", async () => {
    installFetchMock([asRole("user")], { strict: false });
    const { Wrapper } = makeWrapper();
    const { container } = render(
      <Wrapper>
        <AdminTopupsPage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(container.textContent).toBe("");
    });
  });

  it("lists pending requests with the requester's email for a super_admin", async () => {
    installFetchMock(
      [
        asRole("super_admin"),
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url) => (url.includes("/api/admin/topups") ? jsonResponse(PENDING_LIST) : null),
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AdminTopupsPage />
      </Wrapper>,
    );

    expect(await screen.findByTestId("card-topup-9")).toHaveTextContent("buyer@example.test");
  });

  it("approves a pending request through the review dialog", async () => {
    let patchBody: unknown = null;
    installFetchMock(
      [
        asRole("super_admin"),
        (url) => (url.includes("/api/topups/config") ? jsonResponse(CONFIG_PAYLOAD) : null),
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method === "GET" && url.includes("/api/admin/topups?")) return jsonResponse(PENDING_LIST);
          return null;
        },
        (url, init) => {
          if (url.includes("/api/admin/topups/9/status") && (init?.method ?? "").toUpperCase() === "PATCH") {
            patchBody = JSON.parse(init!.body as string);
            return jsonResponse({ ...PENDING_LIST.requests[0], status: "approved", creditsGranted: 7 });
          }
          return null;
        },
      ],
      { strict: false },
    );
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AdminTopupsPage />
      </Wrapper>,
    );

    await screen.findByTestId("card-topup-9");
    await act(async () => {
      fireEvent.click(screen.getByTestId("button-approve-9"));
    });

    const confirmButton = await screen.findByTestId("button-confirm-review");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(patchBody).toMatchObject({ status: "approved", creditsGranted: 7 });
    });
  });
});
