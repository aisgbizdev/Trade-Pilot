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

  it("grants a manual top-up to a searched user", async () => {
    let postedBody: unknown = null;
    installFetchMock(
      [
        asRole("super_admin"),
        (url, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          if (method === "GET" && url.includes("/api/admin/topups?")) {
            return jsonResponse({ requests: [], total: 0, page: 1, limit: 20 });
          }
          return null;
        },
        (url) => {
          if (url.includes("/api/superadmin/users") && url.includes("search=bud")) {
            return jsonResponse({
              users: [
                {
                  id: 42,
                  email: "budi@example.test",
                  displayName: "Budi Santoso",
                  role: "user",
                  selectedMode: "pro",
                  onboardingCompleted: true,
                  createdAt: new Date().toISOString(),
                  analysisCount: 3,
                  tags: [],
                },
              ],
              total: 1,
              page: 1,
              limit: 5,
            });
          }
          return null;
        },
        (url, init) => {
          if (url.includes("/api/admin/topups/manual") && (init?.method ?? "").toUpperCase() === "POST") {
            postedBody = JSON.parse(init!.body as string);
            return jsonResponse(
              {
                id: 99,
                userId: 42,
                amountRupiah: 20000,
                creditsRequested: 70,
                conversionRateSnapshot: 286,
                paymentReferenceNote: null,
                proofObjectPath: null,
                status: "approved",
                reviewedByUserId: 1,
                reviewedAt: new Date().toISOString(),
                reviewNote: "Confirmed via WA",
                creditsGranted: 70,
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
        <AdminTopupsPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-open-manual-topup"));
    });

    await act(async () => {
      fireEvent.change(screen.getByTestId("input-manual-user-search"), { target: { value: "bud" } });
    });

    const userOption = await screen.findByTestId("button-manual-user-42");
    await act(async () => {
      fireEvent.click(userOption);
    });
    expect(screen.getByTestId("text-manual-selected-user")).toHaveTextContent("Budi Santoso");

    await act(async () => {
      fireEvent.change(screen.getByTestId("input-manual-amount"), { target: { value: "20000" } });
      fireEvent.change(screen.getByTestId("input-manual-credits"), { target: { value: "70" } });
      fireEvent.change(screen.getByTestId("input-manual-note"), { target: { value: "Confirmed via WA" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-manual-submit"));
    });

    await waitFor(() => {
      expect(postedBody).toEqual({ userId: 42, amountRupiah: 20000, credits: 70, note: "Confirmed via WA" });
    });
    await waitFor(() => {
      expect(screen.queryByTestId("dialog-manual-topup")).not.toBeInTheDocument();
    });
  });

  it("keeps the manual submit button disabled without a required note", async () => {
    installFetchMock(
      [
        asRole("super_admin"),
        (url) => (url.includes("/api/admin/topups?") ? jsonResponse({ requests: [], total: 0, page: 1, limit: 20 }) : null),
      ],
      { strict: false },
    );

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AdminTopupsPage />
      </Wrapper>,
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId("button-open-manual-topup"));
    });

    const submit = await screen.findByTestId("button-manual-submit");
    expect(submit).toBeDisabled();
  });
});
