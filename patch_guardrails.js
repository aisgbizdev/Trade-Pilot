const fs = require('fs');

const path = 'artifacts/ai-trading/src/components/anti-pattern-guardrails.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/import \{.*?useLogGuardrailEvent,.*?\} from "@\/hooks\/use-anti-pattern-signals";/s, `import {
  useAntiPatternSignals,
  type GuardrailSignal,
  type GuardrailKind,
} from "@/hooks/use-anti-pattern-signals";
import { useRecordGuardrailTelemetry, useWaitGuardrail } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetProgressionSummaryQueryKey, getGetProgressionCatalogQueryKey, getGetProgressionHistoryQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/components/ui/use-toast";`);

fs.writeFileSync(path, code);
