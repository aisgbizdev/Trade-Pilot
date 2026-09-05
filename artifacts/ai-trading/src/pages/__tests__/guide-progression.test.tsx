import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

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
});
