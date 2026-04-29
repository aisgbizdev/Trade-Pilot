/**
 * Component test for `<SignalSpeedometer>` — the half-circle gauge that
 * replaces the old horizontal "garis" bar in the Technical Indicators
 * panel and the 5-segment bar in the Analysis Detail bias card.
 *
 * Asserts the needle angle (read off the `data-angle` attribute set by
 * the SVG) lands in the correct zone for bullish, bearish, neutral, and
 * empty inputs, and that the optional counts row + center label can be
 * toggled off for the bias use-case.
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { SignalSpeedometer, angleFromCounts } from "../signal-speedometer";
import { LanguageProvider } from "@/lib/i18n";

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

function readAngle(testId = "signal-speedometer"): number {
  const root = screen.getByTestId(testId);
  const needle = root.querySelector<SVGElement>(
    "[data-testid='speedometer-needle']",
  );
  expect(needle).not.toBeNull();
  const raw = needle?.getAttribute("data-angle") ?? "0";
  return Number.parseFloat(raw);
}

describe("angleFromCounts (pure helper)", () => {
  it("returns 0 when there are no signals at all", () => {
    expect(angleFromCounts(0, 0, 0)).toBe(0);
  });

  it("returns +90 (Strong Buy) when every signal is a buy", () => {
    expect(angleFromCounts(8, 0, 0)).toBe(90);
  });

  it("returns -90 (Strong Sell) when every signal is a sell", () => {
    expect(angleFromCounts(0, 8, 0)).toBe(-90);
  });

  it("returns 0 when buy and sell are perfectly balanced", () => {
    expect(angleFromCounts(3, 3, 0)).toBe(0);
  });

  it("scales linearly with the net lean", () => {
    // (buy - sell) / total = (3 - 1) / 5 = 0.4 → 36°
    expect(angleFromCounts(3, 1, 1)).toBeCloseTo(36, 5);
    // (buy - sell) / total = (1 - 3) / 5 = -0.4 → -36°
    expect(angleFromCounts(1, 3, 1)).toBeCloseTo(-36, 5);
  });
});

describe("<SignalSpeedometer>", () => {
  it("renders a needle in the bullish half (angle > 0) when buys dominate", () => {
    render(
      <Wrapper>
        <SignalSpeedometer buy={6} sell={1} neutral={2} />
      </Wrapper>,
    );

    const angle = readAngle();
    expect(angle).toBeGreaterThan(0);
    expect(screen.getByTestId("signal-speedometer").getAttribute("data-lean"))
      .toBe("bullish");
  });

  it("renders a needle in the bearish half (angle < 0) when sells dominate", () => {
    render(
      <Wrapper>
        <SignalSpeedometer buy={1} sell={6} neutral={2} />
      </Wrapper>,
    );

    const angle = readAngle();
    expect(angle).toBeLessThan(0);
    expect(screen.getByTestId("signal-speedometer").getAttribute("data-lean"))
      .toBe("bearish");
  });

  it("renders a centered needle when buys and sells are balanced", () => {
    render(
      <Wrapper>
        <SignalSpeedometer buy={3} sell={3} neutral={4} />
      </Wrapper>,
    );

    const angle = readAngle();
    expect(angle).toBeCloseTo(0, 5);
    expect(screen.getByTestId("signal-speedometer").getAttribute("data-lean"))
      .toBe("neutral");
  });

  it("falls back to angle 0 and the neutral lean when every count is zero", () => {
    render(
      <Wrapper>
        <SignalSpeedometer buy={0} sell={0} neutral={0} />
      </Wrapper>,
    );

    expect(readAngle()).toBe(0);
    expect(screen.getByTestId("signal-speedometer").getAttribute("data-lean"))
      .toBe("neutral");
  });

  it("hides the counts row and the center label when both flags are off", () => {
    render(
      <Wrapper>
        <SignalSpeedometer
          buy={3}
          sell={1}
          neutral={1}
          showCounts={false}
          showCenterLabel={false}
          testId="bias-gauge"
        />
      </Wrapper>,
    );

    // Center label and counts row are both suppressed for the bias use-case;
    // the only text content beyond the SVG should be empty.
    const root = screen.getByTestId("bias-gauge");
    // Counts use the localized "Bullish" / "Bearish" labels, so verifying
    // their absence is the cleanest signal that `showCounts` was honoured.
    expect(root.textContent ?? "").toBe("");
    // The SVG itself still rendered.
    expect(root.querySelector("svg")).not.toBeNull();
    // Needle is still present so the bias use-case still has a pointer.
    expect(root.querySelector("[data-testid='speedometer-needle']"))
      .not.toBeNull();
  });

  it("uses the provided test id and exposes the needle angle for assertions", () => {
    render(
      <Wrapper>
        <SignalSpeedometer
          buy={4}
          sell={0}
          neutral={0}
          testId="speedometer-overall"
        />
      </Wrapper>,
    );

    const angle = readAngle("speedometer-overall");
    expect(angle).toBe(90);
  });

  it("renders unique gradient ids when multiple speedometers share a page", () => {
    // Regression guard: the Technical Indicators panel renders three gauges
    // (overall / oscillator / MA) and the Analysis Detail page adds a
    // fourth (bias). If two SVGs reused the same `<linearGradient>` id the
    // browser would resolve `url(#…)` to whichever element it found first
    // and silently restyle the other gauges. The component derives its
    // ids from React's `useId()` so each instance must end up with its
    // own.
    render(
      <Wrapper>
        <div>
          <SignalSpeedometer buy={3} sell={1} neutral={1} testId="gauge-a" />
          <SignalSpeedometer buy={1} sell={3} neutral={1} testId="gauge-b" />
        </div>
      </Wrapper>,
    );

    const a = screen.getByTestId("gauge-a");
    const b = screen.getByTestId("gauge-b");

    const gradIdsA = Array.from(a.querySelectorAll("linearGradient")).map((g) => g.id);
    const gradIdsB = Array.from(b.querySelectorAll("linearGradient")).map((g) => g.id);

    expect(gradIdsA.length).toBeGreaterThan(0);
    expect(gradIdsB.length).toBeGreaterThan(0);
    // No overlap between the two instances' gradient id pools.
    for (const id of gradIdsA) {
      expect(gradIdsB).not.toContain(id);
    }
  });
});
