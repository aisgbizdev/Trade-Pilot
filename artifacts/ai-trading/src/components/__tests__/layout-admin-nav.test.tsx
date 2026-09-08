/**
 * The primary nav gains an "Admin" entry (→ /admin/dashboard) right after
 * "Panduan", but only for `super_admin`. Every other role must not see it
 * — the route itself is also role-gated in App.tsx, this is the UI half.
 */
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { Layout } from "../layout";
import {
  TEST_USER,
  installFetchMock,
  jsonResponse,
  makeWrapper,
  type FetchHandler,
} from "@/pages/__tests__/test-helpers";

function authAs(role: string): FetchHandler {
  return (url) =>
    url.includes("/api/auth/me")
      ? jsonResponse({ ...TEST_USER, role })
      : null;
}

const summaryHandler: FetchHandler = (url) =>
  url.includes("/api/analyses/summary")
    ? jsonResponse({
        totalAnalyses: 5,
        beginnerCount: 5,
        proCount: 0,
        recentAnalyses: [],
      })
    : null;

function renderLayoutAs(role: string) {
  installFetchMock([authAs(role), summaryHandler], { strict: false });
  const { Wrapper } = makeWrapper();
  return render(
    <Wrapper>
      <Layout>
        <div>child</div>
      </Layout>
    </Wrapper>,
  );
}

describe("Layout admin nav entry", () => {
  it("shows the Admin nav link for a super_admin, pointing at /admin/dashboard", async () => {
    renderLayoutAs("super_admin");

    const desktop = await screen.findByTestId("nav-desktop-admin");
    expect(desktop).toHaveAttribute("href", "/admin/dashboard");
    expect(screen.getByTestId("nav-admin").closest("a")).toHaveAttribute(
      "href",
      "/admin/dashboard",
    );

    // Sits after Panduan (Guide) in the desktop nav.
    const nav = screen.getByLabelText("Primary");
    const hrefs = Array.from(nav.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs.indexOf("/admin/dashboard")).toBe(
      hrefs.indexOf("/guide") + 1,
    );
  });

  it("does not show the Admin nav link for a plain user", async () => {
    renderLayoutAs("user");
    await screen.findByTestId("nav-desktop-guide");
    expect(
      screen.queryByTestId("nav-desktop-admin"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("nav-admin"),
    ).not.toBeInTheDocument();
  });

  it("does not show the Admin nav link for a (non-super) admin", async () => {
    renderLayoutAs("admin");
    await screen.findByTestId("nav-desktop-guide");
    expect(
      screen.queryByTestId("nav-desktop-admin"),
    ).not.toBeInTheDocument();
  });
});
