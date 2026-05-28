import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import type { ReactNode } from "react";

import { LanguageProvider } from "@/lib/i18n";

const mockSignals = vi.fn();
const mockTelemetry = vi.fn();

vi.mock("@/hooks/use-anti-pattern-signals", async () => {
  const actual = await vi.importActual<Record<string, unknown>>(
    "@/hooks/use-anti-pattern-signals",
  );
  return {
    ...actual,
    useAntiPatternSignals: () => mockSignals(),
    useLogGuardrailEvent: () => ({ mutate: mockTelemetry }),
  };
});

import { AntiPatternGuardrails } from "../anti-pattern-guardrails";

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe("AntiPatternGuardrails", () => {
  beforeEach(() => {
    mockSignals.mockReset();
    mockTelemetry.mockReset();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing when there are no signals", () => {
    mockSignals.mockReturnValue({ data: { signals: [], prefs: {} } });
    const { container } = render(
      <Wrapper>
        <AntiPatternGuardrails instrument="EUR/USD" />
      </Wrapper>,
    );
    expect(container.querySelector('[data-testid="anti-pattern-guardrails"]')).toBeNull();
  });

  it("renders a revenge card and fires appearance telemetry once per (kind,instrument)", () => {
    mockSignals.mockReturnValue({
      data: {
        signals: [
          {
            kind: "revenge",
            instrument: "EUR/USD",
            minutesSinceLoss: 2,
            lossPnlPercent: "0.8",
          },
        ],
        prefs: {},
      },
    });
    const { rerender } = render(
      <Wrapper>
        <AntiPatternGuardrails instrument="EUR/USD" />
      </Wrapper>,
    );
    expect(screen.getByTestId("guardrail-revenge")).toBeTruthy();
    expect(mockTelemetry).toHaveBeenCalledTimes(1);
    expect(mockTelemetry).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "revenge", proceeded: false }),
    );
    rerender(
      <Wrapper>
        <AntiPatternGuardrails instrument="EUR/USD" />
      </Wrapper>,
    );
    // Same (kind,instrument) — must not log a duplicate appearance.
    expect(mockTelemetry).toHaveBeenCalledTimes(1);
  });

  it("logs proceeded:true for every visible signal when parent invokes the ref", () => {
    mockSignals.mockReturnValue({
      data: {
        signals: [
          { kind: "revenge", instrument: "EUR/USD", minutesSinceLoss: 1, lossPnlPercent: null },
          { kind: "overtrading", scope: "hour", count: 5, limit: 5 },
        ],
        prefs: {},
      },
    });
    const ref: { current: (() => void) | null } = { current: null };
    render(
      <Wrapper>
        <AntiPatternGuardrails instrument="EUR/USD" proceedHandleRef={ref} />
      </Wrapper>,
    );
    // 2 appearance logs.
    expect(mockTelemetry).toHaveBeenCalledTimes(2);
    expect(typeof ref.current).toBe("function");
    act(() => {
      ref.current?.();
    });
    // +2 proceeded logs.
    expect(mockTelemetry).toHaveBeenCalledTimes(4);
    expect(mockTelemetry).toHaveBeenLastCalledWith(
      expect.objectContaining({ proceeded: true }),
    );
  });

  it("ticks the cooling-off countdown without refetching the API", () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);
    mockSignals.mockReturnValue({
      data: {
        signals: [
          {
            kind: "cooling_off",
            untilEpochMs: now + 5 * 60_000,
            minutesRemaining: 5,
            lossPnlPercent: "1.5",
            thresholdPct: 1,
          },
        ],
        prefs: {},
      },
    });
    render(
      <Wrapper>
        <AntiPatternGuardrails instrument="EUR/USD" />
      </Wrapper>,
    );
    expect(screen.getByTestId("guardrail-cooling_off").textContent).toContain("5");
    // Advance 2 minutes — countdown should drop to ~3 min.
    act(() => {
      vi.advanceTimersByTime(2 * 60_000);
    });
    expect(screen.getByTestId("guardrail-cooling_off").textContent).toContain("3");
    // Advance past expiry — the card hides itself client-side.
    act(() => {
      vi.advanceTimersByTime(4 * 60_000);
    });
    expect(screen.queryByTestId("guardrail-cooling_off")).toBeNull();
  });
});
