const fs = require('fs');
const path = 'artifacts/ai-trading/src/components/anti-pattern-guardrails.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace('const logEvent = useLogGuardrailEvent();', 
`const logEvent = useRecordGuardrailTelemetry();
  const waitEvent = useWaitGuardrail();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const telemetryIdsRef = useRef<Map<string, number>>(new Map());`);

code = code.replace(/logEvent\.mutate\(\{[\s\S]*?\}\);/g, (match) => {
  if (match.includes('proceeded: false')) {
     return `logEvent.mutate({
        data: {
          kind: s.kind,
          instrument,
          proceeded: false,
          metadata: getSignalMetadata(s)
        }
      }, {
        onSuccess: (res) => {
          if (res?.id) {
            telemetryIdsRef.current.set(k, res.id);
          }
        }
      });`;
  }
  if (match.includes('proceeded: true')) {
     return `logEvent.mutate({
          data: {
            kind: s.kind,
            instrument,
            proceeded: true,
            metadata: {
              explicitProceed: true,
              ...getSignalMetadata(s)
            }
          }
        });`;
  }
  return match;
});

fs.writeFileSync(path, code);
