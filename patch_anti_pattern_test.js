const fs = require('fs');

let code = fs.readFileSync('artifacts/ai-trading/src/components/__tests__/anti-pattern-guardrails.test.tsx', 'utf8');

code = code.replace(`vi.mock("@/hooks/use-anti-pattern-signals", async () => {
  const actual = await vi.importActual<Record<string, unknown>>(
    "@/hooks/use-anti-pattern-signals",
  );
  return {
    ...actual,
    useAntiPatternSignals: () => mockSignals(),
    useLogGuardrailEvent: () => ({ mutate: mockTelemetry }),
  };
});`, `vi.mock("@/hooks/use-anti-pattern-signals", async () => {
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
}));`);

code = code.replace(`  beforeEach(() => {
    mockSignals.mockReset();
    mockTelemetry.mockReset();
  });`, `  beforeEach(() => {
    mockSignals.mockReset();
    mockTelemetry.mockReset();
    mockWait.mockReset();
    mockInvalidate.mockReset();
    mockToast.mockReset();
  });`);

fs.writeFileSync('artifacts/ai-trading/src/components/__tests__/anti-pattern-guardrails.test.tsx', code);
