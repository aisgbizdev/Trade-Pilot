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
  };
});

const mockWait = vi.fn();
const mockInvalidate = vi.fn();
const mockToast = vi.fn();

vi.mock("@workspace/api-client-react", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("@workspace/api-client-react");
  return {
    ...actual,
    useRecordGuardrailTelemetry: () => ({ mutate: mockTelemetry }),
    useWaitGuardrail: () => ({ mutate: mockWait }),
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: mockInvalidate }),
  };
});

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

import { AntiPatternGuardrails } from "../anti-pattern-guardrails";

function Wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe("AntiPatternGuardrails", () => {
  beforeEach(() => {
    mockSignals.mockReset();
    mockTelemetry.mockReset();
    mockWait.mockReset();
    mockInvalidate.mockReset();
    mockToast.mockReset();
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
      expect.objectContaining({ data: expect.objectContaining({ kind: "revenge", proceeded: false }) }),
      expect.anything()
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
      expect.objectContaining({ data: expect.objectContaining({ proceeded: true }) })
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

  it("submits explicit safe wait guardrail telemetry when Wait Safely is clicked", () => {
    mockSignals.mockReturnValue({
      data: {
        signals: [
          {
            kind: "high_risk_window",
            event: { name: "NFP", currency: "USD", impact: "high", epochMs: 123 },
            minutesUntil: 5,
          },
        ],
        prefs: {},
      },
    });

    mockTelemetry.mockImplementation((req, options) => {
      if (options?.onSuccess) options.onSuccess({ ok: true, id: 999 });
    });

    const onSafeWait = vi.fn();
    render(
      <Wrapper>
        <AntiPatternGuardrails instrument="EUR/USD" onSafeWait={onSafeWait} />
      </Wrapper>,
    );

    // Initial log
    expect(mockTelemetry).toHaveBeenCalledTimes(1);

    const safeWaitBtn = screen.getByText(/Wait Safely|Tahan Diri/i);

    mockWait.mockImplementation((req, options) => {
      if (options?.onSuccess) options.onSuccess({ awarded: true, xp: 50 });
    });

    act(() => {
      safeWaitBtn.click();
    });

    expect(mockWait).toHaveBeenCalledTimes(1);
    expect(mockWait).toHaveBeenCalledWith(
      expect.objectContaining({ id: 999 }),
      expect.anything()
    );
    expect(onSafeWait).toHaveBeenCalledTimes(1);
  });
});
