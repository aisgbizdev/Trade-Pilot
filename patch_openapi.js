const fs = require('fs');

const original = fs.readFileSync('lib/api-spec/openapi.yaml', 'utf8');

const pathsBlock = `
  /analyses/guardrails:
    get:
      operationId: getGuardrails
      tags: [analyses]
      summary: Detect active soft warnings for the requested instrument
      parameters:
        - name: instrument
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  signals:
                    type: array
                    items:
                      type: object
                      additionalProperties: true
                  prefs:
                    type: object
                    additionalProperties: true
  /analyses/guardrails/telemetry:
    post:
      operationId: recordGuardrailTelemetry
      tags: [analyses]
      summary: Record impression or override of a guardrail
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [kind]
              properties:
                kind: { type: string }
                instrument: { type: string }
                proceeded: { type: boolean }
                metadata: { type: object, additionalProperties: true }
      responses:
        "201":
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  ok: { type: boolean }
                  id: { type: integer }
  /analyses/guardrails/{id}/wait:
    post:
      operationId: waitGuardrail
      tags: [analyses]
      summary: Record an explicit decision to wait
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        "201":
          description: OK
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionAward" } } }
        "200":
          description: OK
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionAward" } } }
`;

let newYaml = original.replace('  /healthz:', pathsBlock + '\n  /healthz:');

fs.writeFileSync('lib/api-spec/openapi.yaml', newYaml);
