import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import GuidePage from "../guide";
import { installFetchMock, jsonResponse, makeWrapper } from "./test-helpers";

describe("GuidePage Progression", () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn();
  });
  afterEach(() => {
    localStorage.clear();
    // clear URL params
    window.history.replaceState(null, "", "/");
  });

  it("marks article as complete and hits progression activity endpoint", async () => {
    let progressionCalled = false;
    let progressionBody: any = null;

    installFetchMock([
      (url, init) => {
        if (url.includes("/api/progression/evidence") && init?.method === "POST") {
          return jsonResponse({
            token: "mock_evidence_token",
            source: "guide_completion",
            subject: "how-ai-works",
            minimumCompleteAt: new Date(Date.now() - 1000).toISOString() // already elapsed
          });
        }
        if (url.includes("/api/progression/activity") && init?.method === "POST") {
          progressionCalled = true;
          progressionBody = JSON.parse(init.body as string);
          return jsonResponse({ awarded: true, xp: 50, reason: "guide_completion" });
        }
        return null;
      }
    ]);

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <GuidePage />
      </Wrapper>
    );

    // Open first category first article
    // "how-ai-works" is the first article ID in GUIDE_CATEGORIES
    const articleBtn = await screen.findByTestId("guide-article-how-ai-works");
    expect(articleBtn).toBeInTheDocument();
    expect(screen.queryByTestId("button-guide-back-to-profile")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(articleBtn);
    });

    // Mark complete button should be visible at the bottom
    const markCompleteBtn = await screen.findByTestId("button-mark-guide-complete");
    expect(markCompleteBtn).toBeInTheDocument();
    const backToGuide = screen.getByTestId("button-guide-back-to-list");
    expect(backToGuide).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(markCompleteBtn);
    });

    await waitFor(() => expect(progressionCalled).toBe(true));
    expect(progressionBody.token).toBe("mock_evidence_token");
    fireEvent.click(screen.getByTestId("button-guide-back-to-list"));
    expect(await screen.findByTestId("guide-article-completed-how-ai-works")).toBeInTheDocument();
  });

  it("shows completed articles from the progression catalog after reload", async () => {
    installFetchMock([
      (url, init) => {
        if (url.includes("/api/progression/catalog") && (!init?.method || init.method === "GET")) {
          return jsonResponse({
            achievements: [],
            completedGuideIds: ["how-ai-works", "analysis-workflow"],
          });
        }
        return null;
      },
    ]);

    const { Wrapper } = makeWrapper();
    render(<Wrapper><GuidePage /></Wrapper>);

    expect(await screen.findByTestId("guide-article-completed-how-ai-works")).toBeInTheDocument();
    expect(screen.getByTestId("guide-quick-start-completed-analysis-workflow")).toBeInTheDocument();
    expect(screen.queryByTestId("guide-article-completed-feature-map")).not.toBeInTheDocument();
  });

  it.each(["personal-progression", "timeframe-risk-map"] as const)(
    "starts completion evidence for the %s article",
    async (articleId) => {
      let requestedGuideId: string | null = null;
      window.history.replaceState(null, "", `/guide?article=${articleId}`);

      installFetchMock([
        (url, init) => {
          if (url.includes("/api/progression/evidence") && init?.method === "POST") {
            requestedGuideId = JSON.parse(init.body as string).guideId;
            return jsonResponse({
              token: "mock_evidence_token",
              source: "guide_completion",
              subject: articleId,
              minimumCompleteAt: new Date(Date.now() + 20_000).toISOString(),
            });
          }
          return null;
        },
      ]);

      const { Wrapper } = makeWrapper();
      render(
        <Wrapper>
          <GuidePage />
        </Wrapper>,
      );

      await waitFor(() => expect(requestedGuideId).toBe(articleId));
      expect(screen.getByTestId("button-mark-guide-complete")).toBeDisabled();
    },
  );

  it("keeps article state in sync with browser back and forward navigation", async () => {
    installFetchMock([
      (url, init) => {
        if (url.includes("/api/progression/evidence") && init?.method === "POST") {
          return jsonResponse({
            token: "mock_evidence_token",
            source: "guide_completion",
            subject: "how-ai-works",
            minimumCompleteAt: new Date(Date.now() + 20_000).toISOString(),
          });
        }
        return null;
      },
    ]);

    const { Wrapper } = makeWrapper();
    render(
      <Wrapper>
        <GuidePage />
      </Wrapper>,
    );

    fireEvent.click(await screen.findByTestId("guide-article-how-ai-works"));
    expect(window.location.search).toContain("article=how-ai-works");
    expect(screen.getByTestId("button-guide-back-to-list")).toBeInTheDocument();

    window.history.replaceState(null, "", "/guide");
    fireEvent(window, new PopStateEvent("popstate"));
    expect(await screen.findByTestId("guide-article-how-ai-works")).toBeInTheDocument();

    window.history.replaceState(
      null,
      "",
      "/guide?category=getting-started&article=how-ai-works",
    );
    fireEvent(window, new PopStateEvent("popstate"));
    expect(await screen.findByTestId("button-guide-back-to-list")).toBeInTheDocument();
  });

  it("opens article cards with Enter and Space", async () => {
    installFetchMock([
      (url, init) => {
        if (url.includes("/api/progression/evidence") && init?.method === "POST") {
          const guideId = JSON.parse(init.body as string).guideId;
          return jsonResponse({
            token: `mock_${guideId}`,
            source: "guide_completion",
            subject: guideId,
            minimumCompleteAt: new Date(Date.now() + 20_000).toISOString(),
          });
        }
        return null;
      },
    ]);
    const user = userEvent.setup();
    const { Wrapper } = makeWrapper();
    render(<Wrapper><GuidePage /></Wrapper>);

    const firstArticle = await screen.findByTestId("guide-article-how-ai-works");
    expect(firstArticle.tagName).toBe("BUTTON");
    firstArticle.focus();
    await user.keyboard("{Enter}");
    expect(window.location.search).toContain("article=how-ai-works");

    await user.click(screen.getByTestId("button-guide-back-to-list"));
    const secondArticle = await screen.findByTestId("guide-article-feature-map");
    secondArticle.focus();
    await user.keyboard("[Space]");
    expect(window.location.search).toContain("article=feature-map");
  });

  it("offers Quick Start paths and opens the History & Performance guide by deep link", async () => {
    installFetchMock([
      (url, init) => {
        if (url.includes("/api/progression/evidence") && init?.method === "POST") {
          return jsonResponse({
            token: "mock_evidence_token",
            source: "guide_completion",
            subject: "history-performance",
            minimumCompleteAt: new Date(Date.now() + 20_000).toISOString(),
          });
        }
        return null;
      },
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><GuidePage /></Wrapper>);

    expect(await screen.findByTestId("guide-quick-start-analysis-workflow")).toBeInTheDocument();
    expect(screen.getByTestId("guide-quick-start-adaptive-position-plan")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("guide-quick-start-history-performance"));

    expect(window.location.search).toContain("article=history-performance");
    expect(await screen.findByText("Using History & Performance")).toBeInTheDocument();
    expect(screen.getByText("Summary and History tabs")).toBeInTheDocument();
    expect(screen.getByText("Why minimum sample matters")).toBeInTheDocument();
    expect(screen.getByText(/Other Instruments groups every other market/)).toBeInTheDocument();
  });

  it("makes Psychology & Discipline discoverable without replacing the article list", async () => {
    installFetchMock();
    const { Wrapper } = makeWrapper();
    render(<Wrapper><GuidePage /></Wrapper>);

    expect(await screen.findByText("Swipe to see more categories")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("guide-psychology-spotlight"));

    expect(window.location.search).toContain("category=psychology");
    expect(await screen.findByTestId("guide-article-fomo")).toBeInTheDocument();
    expect(screen.queryByTestId("guide-article-how-ai-works")).not.toBeInTheDocument();
  });

  it("finds guide content through search and follows its related topic", async () => {
    installFetchMock([
      (url, init) => {
        if (url.includes("/api/progression/evidence") && init?.method === "POST") {
          const guideId = JSON.parse(init.body as string).guideId;
          return jsonResponse({
            token: `mock_${guideId}`,
            source: "guide_completion",
            subject: guideId,
            minimumCompleteAt: new Date(Date.now() + 20_000).toISOString(),
          });
        }
        return null;
      },
    ]);
    const { Wrapper } = makeWrapper();
    render(<Wrapper><GuidePage /></Wrapper>);

    fireEvent.change(await screen.findByTestId("input-guide-search"), {
      target: { value: "minimum sample" },
    });
    expect(await screen.findByTestId("guide-article-history-performance")).toBeInTheDocument();
    expect(screen.queryByTestId("guide-article-how-ai-works")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("guide-article-history-performance"));
    fireEvent.click(await screen.findByRole("button", { name: "Read the full topic" }));

    expect(window.location.search).toContain("article=analysis-workflow");
    expect(await screen.findByText("From Instrument Selection to a Usable Analysis")).toBeInTheDocument();
  });
});
