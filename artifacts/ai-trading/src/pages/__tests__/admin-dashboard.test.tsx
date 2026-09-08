/**
 * Component test for the unified admin dashboard
 * (src/pages/admin-dashboard.tsx).
 *
 * The sidebar still switches one section at a time — but the Users and
 * Feedback sections now render their data inline (recent-10 table / list)
 * instead of a bare "open the page" link card. Covers the super_admin-only
 * role gate, section switching, the Overview stats, the Top-up summary
 * (+ search filter), and the inline Users / Feedback previews.
 */
import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

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

const USERS_PAYLOAD = {
  total: 42,
  page: 1,
  limit: 10,
  users: [
    {
      id: 7,
      email: "carol@example.test",
      displayName: "Carol",
      role: "user",
      selectedMode: "pro",
      analysisCount: 5,
      tags: [],
      createdAt: "2026-02-01T00:00:00Z",
    },
  ],
};

const FEEDBACK_PAYLOAD = {
  total: 7,
  page: 1,
  limit: 10,
  feedback: [
    {
      id: 11,
      analysisId: 100,
      instrument: "BTC/USD",
      userId: 9,
      userEmail: "dave@example.test",
      feedbackType: "useful",
      outcome: "correct",
      note: "Spot on call.",
      createdAt: "2026-02-02T00:00:00Z",
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
    (url: string) => (url.includes("/api/superadmin/users") ? jsonResponse(USERS_PAYLOAD) : null),
    (url: string) => (url.includes("/api/admin/feedback") ? jsonResponse(FEEDBACK_PAYLOAD) : null),
  ];
}

function renderAs(role: "user" | "admin" | "super_admin") {
  installFetchMock([asRole(role), ...commonHandlers()], { strict: false });
  const { Wrapper } = makeWrapper();
  return render(
    <Wrapper>
      <AdminDashboardPage />
    </Wrapper>,
  );
}

async function clickNav(section: string) {
  const btn = await screen.findByTestId(`nav-${section}`);
  await act(async () => {
    fireEvent.click(btn);
  });
}

describe("AdminDashboardPage", () => {
  it("renders nothing for a plain user (role gate)", async () => {
    const { container } = renderAs("user");
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(container.textContent).toBe("");
  });

  it("shows the Overview stats by default for a super_admin", async () => {
    renderAs("super_admin");
    expect(await screen.findByTestId("stat-total-users")).toHaveTextContent("999");
  });

  it("switches to the Top-up summary section and shows the totals + rows", async () => {
    renderAs("super_admin");
    await clickNav("topups");

    expect(await screen.findByTestId("stat-topup-total-revenue")).toHaveTextContent("15.000");
    expect(screen.getByTestId("stat-topup-total-credits")).toHaveTextContent("60");
    expect(screen.getByTestId("row-topup-summary-1")).toBeInTheDocument();
    expect(screen.getByTestId("row-topup-summary-2")).toBeInTheDocument();
  });

  it("filters the top-up breakdown by search term", async () => {
    renderAs("super_admin");
    await clickNav("topups");
    await screen.findByTestId("row-topup-summary-1");

    await act(async () => {
      fireEvent.change(screen.getByTestId("input-topup-summary-search"), { target: { value: "bob" } });
    });

    expect(screen.queryByTestId("row-topup-summary-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("row-topup-summary-2")).toBeInTheDocument();
  });

  it("shows the recent users inline in the Users section (not just a link)", async () => {
    renderAs("super_admin");
    await clickNav("users");

    expect(await screen.findByTestId("row-user-7")).toHaveTextContent("Carol");
    expect(screen.getByTestId("row-user-7")).toHaveTextContent("carol@example.test");
    expect(screen.getByTestId("link-admin-users")).toHaveAttribute("href", "/admin/users");
  });

  it("shows the recent feedback inline in the Feedback section (not just a link)", async () => {
    renderAs("super_admin");
    await clickNav("feedback");

    expect(await screen.findByTestId("row-feedback-11")).toHaveTextContent("BTC/USD");
    expect(screen.getByTestId("row-feedback-11")).toHaveTextContent("Spot on call.");
    expect(screen.getByTestId("link-admin-feedback")).toHaveAttribute("href", "/admin/feedback");
  });
});
