import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LandingPage from "../landing";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/");
  vi.stubGlobal("IntersectionObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("LandingPage market preview disclosure", () => {
  it("keeps the preview and its request closed until opened, then allows closing it", async () => {
    const { calls } = installFetchMock([
      (url) => url.includes("/api/landing/preview")
        ? jsonResponse({
            status: "success",
            instrument: "XAU/USD",
            timeframe: "1D",
            generatedAt: "2026-09-27T06:00:00.000Z",
            isStale: false,
            price: 4284.13,
            tradingBias: "bearish",
            confidenceMin: 60,
            confidenceMax: 70,
            preferredSide: "sell",
            levels: null,
          })
        : null,
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><LandingPage /></Wrapper>);

    const toggle = screen.getByTestId("button-toggle-sample-analysis");
    const section = screen.getByTestId("section-sample-analysis");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", section.id);
    expect(section).not.toBeVisible();
    expect(screen.queryByTestId("section-product-preview")).not.toBeInTheDocument();
    expect(calls.filter(({ url }) => url.includes("/api/landing/preview"))).toHaveLength(0);
    expect(screen.getByTestId("button-get-started")).toHaveAttribute("href", "/register");
    expect(screen.getByTestId("button-sign-in")).toHaveAttribute("href", "/login");
    expect(screen.getByTestId("link-footer-privacy")).toBeVisible();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(section).toBeVisible();
    expect(await screen.findByTestId("landing-preview-status")).toHaveTextContent("Live D1");
    await waitFor(() => expect(calls.filter(({ url }) => url.includes("/api/landing/preview"))).toHaveLength(1));
    expect(screen.getByTestId("landing-preview-login")).toHaveAttribute("href", "/login");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(section).not.toBeVisible();
    expect(screen.queryByTestId("section-product-preview")).not.toBeInTheDocument();
  });

  it("translates the disclosure labels when the language changes", () => {
    installFetchMock([
      (url) => url.includes("/api/landing/preview")
        ? jsonResponse({
            status: "success", instrument: "XAU/USD", timeframe: "1D",
            generatedAt: "2026-09-27T06:00:00.000Z", isStale: false, price: 4284.13,
            tradingBias: "bearish", confidenceMin: 60, confidenceMax: 70,
            preferredSide: "sell", levels: null,
          })
        : null,
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><LandingPage /></Wrapper>);
    const toggle = screen.getByTestId("button-toggle-sample-analysis");
    expect(toggle).toHaveTextContent("View Market Snapshot");
    fireEvent.click(screen.getByTestId("button-language-toggle"));
    expect(toggle).toHaveTextContent("Lihat Kondisi Pasar");
    fireEvent.click(toggle);
    expect(toggle).toHaveTextContent("Tutup Kondisi Pasar");
    fireEvent.click(screen.getByTestId("button-language-toggle"));
    expect(toggle).toHaveTextContent("Hide Market Snapshot");
  });
});

describe("LandingPage: app download CTA", () => {
  it("links to the real App Store and Play Store listings, in both the download section and the footer", () => {
    installFetchMock([]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><LandingPage /></Wrapper>);

    // Rendered twice on purpose — once in the dedicated download section,
    // once again (compact) in the footer.
    const appStoreLinks = screen.getAllByTestId("link-download-app-store");
    const playStoreLinks = screen.getAllByTestId("link-download-play-store");
    expect(appStoreLinks).toHaveLength(2);
    expect(playStoreLinks).toHaveLength(2);
    for (const link of appStoreLinks) {
      expect(link).toHaveAttribute("href", "https://apps.apple.com/id/app/tradepilot-id/id6807276937");
    }
    for (const link of playStoreLinks) {
      expect(link).toHaveAttribute(
        "href",
        "https://play.google.com/store/apps/details?id=id.tradepilot.app&pcampaignid=web_share",
      );
    }
  });
});