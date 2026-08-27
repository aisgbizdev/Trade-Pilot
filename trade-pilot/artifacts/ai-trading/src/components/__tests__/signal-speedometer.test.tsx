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

  it("xs preset uses a fixed, non-shrinkable wrapper so it can't collapse flat in tight flex-rows", () => {
    // Reproduces the regression from Task #86: the per-row `SignalCell` on the
    // Analyze indicators panel renders the gauge inside a flex-row with a
    // sibling `min-w-[2.75rem]` label. If the gauge wrapper is allowed to
    // flex-shrink, the SVG arc renders as an almost-flat sliver. Lock both
    // the wrapper width and the SVG aspect-ratio.
    render(
      <Wrapper>
        <div style={{ display: "flex", alignItems: "center", gap: 6, width: 90 }}>
          <SignalSpeedometer
            buy={2}
            sell={1}
            neutral={0}
            size="xs"
            showCounts={false}
            showCenterLabel={false}
            testId="xs-cell-gauge"
          />
          <span style={{ minWidth: "2.75rem" }}>Buy</span>
        </div>
      </Wrapper>,
    );

    const root = screen.getByTestId("xs-cell-gauge");
    // The wrapper is the sized container — it must be a fixed width and
    // explicitly non-shrinkable so a sibling label can't squeeze it.
    expect(root.className).toMatch(/\bshrink-0\b/);
    expect(root.className).toMatch(/\bw-14\b/);
    // The wrapper must NOT use plain `w-full` for the xs preset, otherwise it
    // gets dragged down to a sliver inside a tight flex-row.
    expect(root.className).not.toMatch(/\bw-full\b/);

    const svg = root.querySelector("svg");
    expect(svg).not.toBeNull();
    // The half-circle viewBox aspect (100:60) must be preserved so the gauge
    // never visually flattens — even when the rendered width changes.
    const viewBox = svg?.getAttribute("viewBox") ?? "";
    expect(viewBox).toBe("0 0 100 60");
    // Compute the aspect implied by viewBox + preserveAspectRatio="meet" +
    // h-auto. Anything below ~0.4 means the gauge would visually flatten,
    // which is exactly the regression Task #86 fixes.
    const [, , vbW, vbH] = viewBox.split(/\s+/).map(Number);
    const aspect = vbH / vbW;
    expect(aspect).toBeGreaterThan(0.4);
    // `preserveAspectRatio` must keep the arc's aspect locked rather than
    // letting it stretch flat.
    const par = svg?.getAttribute("preserveAspectRatio");
    expect(par === null || par === "" || /meet/.test(par)).toBe(true);
    // Class must let height auto-scale with width, so the SVG can't be
    // forced into a zero-height box by a parent that only sets width.
    expect(svg?.getAttribute("class") ?? "").toMatch(/\bh-auto\b/);

    // Sanity: the actual needle was rendered (i.e. drawing happened, not
    // an empty SVG shell), so the gauge isn't silently empty either.
    expect(root.querySelector("[data-testid='speedometer-needle']"))
      .not.toBeNull();
  });

  it("sm and md presets keep `w-full` and the half-circle viewBox so the larger summary gauges still stretch to fill their column without flattening", () => {
    render(
      <Wrapper>
        <div>
          <SignalSpeedometer
            buy={4}
            sell={2}
            neutral={1}
            size="sm"
            showCounts={false}
            showCenterLabel={false}
            testId="sm-summary-gauge"
          />
          <SignalSpeedometer
            buy={4}
            sell={2}
            neutral={1}
            size="md"
            testId="md-overall-gauge"
          />
        </div>
      </Wrapper>,
    );

    for (const id of ["sm-summary-gauge", "md-overall-gauge"]) {
      const root = screen.getByTestId(id);
      // sm/md must still expand with their column (w-full present, surrounded
      // by other utility classes) so the larger gauges don't visually shrink.
      expect(root.className).toMatch(/(?:^|\s)w-full(?:\s|$)/);
      const svg = root.querySelector("svg");
      expect(svg, `${id} should still render its SVG`).not.toBeNull();
      expect(svg?.getAttribute("viewBox")).toBe("0 0 100 60");
    }
  });

  it("renders unique gradient ids when multiple speedometers share a page", () => {
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
