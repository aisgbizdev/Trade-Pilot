/**
 * Component test for the unified admin dashboard
 * (src/pages/admin-dashboard.tsx).
 *
 * Covers the super_admin-only role gate, sidebar section switching,
 * the Overview stats render, and the Top-up revenue summary section
 * (totals + client-side search filter over the byUser breakdown).
 */
import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import AdminDashboardPage from "../admin-dashboard";
import { installFetchMock, jsonResponse, makeWrapper, TEST_USER } from "./test-helpers";

const STATS_PAYLOAD = {
  totalUsersToday: 3,
  totalAnalysesToday: 12,
  totalAnalysesThisWeek: 40,
  totalAnalysesThisMonth: 150,
  totalUsers: 999,
  instrumentBreakdown: [{ instrument: "XAU/USD", count: 20 }],
  modeBreakdown: { beginner: 10, pro: 30 },
};

const SUMMARY_PAYLOAD = {
  totalAmountRupiah: 15000,
  totalCreditsGranted: 60,
  approvedRequestCount: 3,
  byUser: [
    {
      userId: 1,
      userEmail: "alice@example.test",
      userDisplayName: "Alice",
      totalAmountRupiah: 10000,
      totalCreditsGranted: 40,
      requestCount: 2,
      lastApprovedAt: new Date().toISOString(),
    },
    {
      userId: 2,
      userEmail: "bob@example.test",
      userDisplayName: "Bob",
      totalAmountRupiah: 5000,
      totalCreditsGranted: 20,
      requestCount: 1,
      lastApprovedAt: new Date().toISOString(),
    },
  ],
};

function asRole(role: "user" | "admin" | "super_admin") {
  return (url: string) =>
    url.includes("/api/auth/me") ? jsonResponse({ ...TEST_USER, role }) : null;
}

function commonHandlers() {
  return [
    (url: string) => (url.includes("/api/admin/stats") ? jsonResponse(STATS_PAYLOAD) : null),
    (url: string) => (url.includes("/api/admin/topups/summary") ? jsonResponse(SUMMARY_PAYLOAD) : null),
    (url: string) => (url.includes("/api/superadmin/users") ? jsonResponse({ users: [], total: 42 }) : null),
    (url: string) => (url.includes("/api/admin/feedback") ? jsonResponse({ feedback: [], total: 7 }) : null),
  ];
}

describe("AdminDashboardPage", () => {
  it("renders nothing for a plain user (role gate)", async () => {
    installFetchMock([asRole("user"), ...commonHandlers()], { strict: false });
    const { Wrapper } = makeWrapper();
    const { container } = render(
      <Wrapper>
        <AdminDashboardPage />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(container.textContent).toBe("");
    });
  });

  it("renders the Overview section by default for a super_admin", async () => {
    installFetchMock([asRole("super_admin"), ...commonHandlers()], { strict: false });
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AdminDashboardPage />
      </Wrapper>,
    );

    expect(await screen.findByTestId("stat-total-users")).toHaveTextContent("999");
  });

  it("switches to the Top-up summary section and shows the totals", async () => {
    installFetchMock([asRole("super_admin"), ...commonHandlers()], { strict: false });
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AdminDashboardPage />
      </Wrapper>,
    );

    await screen.findByTestId("nav-topups");
    await act(async () => {
      fireEvent.click(screen.getByTestId("nav-topups"));
    });

    expect(await screen.findByTestId("stat-topup-total-revenue")).toHaveTextContent("15.000");
    expect(screen.getByTestId("stat-topup-total-credits")).toHaveTextContent("60");
    expect(screen.getByTestId("row-topup-summary-1")).toBeInTheDocument();
    expect(screen.getByTestId("row-topup-summary-2")).toBeInTheDocument();
  });

  it("filters the top-up breakdown by search term", async () => {
    installFetchMock([asRole("super_admin"), ...commonHandlers()], { strict: false });
    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <AdminDashboardPage />
      </Wrapper>,
    );

    await screen.findByTestId("nav-topups");
    await act(async () => {
      fireEvent.click(screen.getByTestId("nav-topups"));
    });
    await screen.findByTestId("row-topup-summary-1");

    await act(async () => {
      fireEvent.change(screen.getByTestId("input-topup-summary-search"), { target: { value: "bob" } });
    });

    expect(screen.queryByTestId("row-topup-summary-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("row-topup-summary-2")).toBeInTheDocument();
  });
});
