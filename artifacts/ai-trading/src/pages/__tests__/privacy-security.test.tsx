import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PrivacySecurityPage from "../privacy-security";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/profile/privacy-security");
});

describe("PrivacySecurityPage: account deletion", () => {
  it("keeps deletion off Profile but accessible here, with password and confirmation required", async () => {
    const { calls } = installFetchMock([
      (url, init) => url.includes("/api/auth/account") && init?.method === "DELETE"
        ? jsonResponse({ error: "Incorrect password" }, 401)
        : null,
      (url) => url.includes("/api/quotes/live")
        ? jsonResponse({ status: "ok", updatedAt: new Date().toISOString(), serverTime: "00:00:00", data: [] })
        : null,
      (url) => url.includes("/api/ticker-news") || url.includes("/api/news")
        ? jsonResponse({ articles: [], total: 0 })
        : null,
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><PrivacySecurityPage /></Wrapper>);

    expect(screen.getByTestId("link-profile-privacy-policy")).toHaveAttribute("href", "/privacy");
    expect(screen.getByTestId("link-profile-deletion-info")).toHaveAttribute("href", "/delete-account");
    expect(screen.getByTestId("card-delete-account")).toBeInTheDocument();
    expect(screen.queryByTestId("dialog-delete-account")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-open-delete-account"));
    const confirm = screen.getByTestId("button-confirm-delete-account");
    expect(confirm).toBeDisabled();
    fireEvent.change(screen.getByTestId("input-delete-account-password"), { target: { value: "wrong-password" } });
    expect(confirm).toBeDisabled();
    fireEvent.click(screen.getByTestId("checkbox-delete-account-confirm"));
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);

    await waitFor(() => expect(calls.some(
      ({ url, method, body }) => url.includes("/api/auth/account")
        && method === "DELETE"
        && JSON.parse(body ?? "{}").currentPassword === "wrong-password",
    )).toBe(true));
    expect(await screen.findByTestId("text-delete-account-error")).toHaveTextContent("Incorrect password");

    fireEvent.click(screen.getByTestId("button-cancel-delete-account"));
    fireEvent.click(screen.getByTestId("button-open-delete-account"));
    expect(screen.getByTestId("input-delete-account-password")).toHaveValue("");
    expect(screen.getByTestId("checkbox-delete-account-confirm")).not.toBeChecked();
    expect(screen.getByTestId("button-confirm-delete-account")).toBeDisabled();
  });
});