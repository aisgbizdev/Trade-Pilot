const fs = require('fs');
const original = fs.readFileSync('lib/api-spec/openapi.yaml', 'utf8');

const progressionPaths = `
  /progression/summary:
    get:
      operationId: getProgressionSummary
      tags: [progression]
      summary: Get the authenticated user's private progression summary
      responses:
        "200":
          description: Private progression summary
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionSummary" } } }
        "401": { description: Not authenticated }
  /progression/catalog:
    get:
      operationId: getProgressionCatalog
      tags: [progression]
      summary: Get private achievement catalog and unlock state
      responses:
        "200":
          description: Achievement catalog
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionCatalog" } } }
  /progression/history:
    get:
      operationId: getProgressionHistory
      tags: [progression]
      summary: Get private append-only XP history
      parameters:
        - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100 } }
      responses:
        "200":
          description: XP ledger entries
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionHistory" } } }
  /progression/activity:
    post:
      operationId: recordProgressionActivity
      tags: [progression]
      summary: Record a server-verifiable checklist or guide completion
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionActivityInput" } } }
      responses:
        "201":
          description: Activity awarded XP
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionAward" } } }
        "200":
          description: Duplicate, cap, or insufficient-quality activity
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionAward" } } }
        "400": { description: Invalid activity }
  /progression/evidence:
    post:
      operationId: startProgressionEvidence
      tags: [progression]
      summary: Issue a one-time server evidence token for a known guide or checklist
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionEvidenceStartInput" } } }
      responses:
        "201":
          description: One-time completion evidence
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionEvidenceSession" } } }
  /admin/progression/audit:
    get:
      operationId: getProgressionAudit
      tags: [admin]
      summary: Read-only progression ledger audit; never a leaderboard
      parameters:
        - { name: userId, in: query, schema: { type: integer } }
      responses:
        "200":
          description: Auditable ledger rows
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionAudit" } } }
        "401": { description: Not authenticated }
        "403": { description: Admin access required }
  /admin/progression/backfill:
    post:
      operationId: backfillProgression
      tags: [admin]
      summary: Safely backfill only unequivocal historical progression evidence
      responses:
        "200":
          description: Idempotent backfill result
          content: { application/json: { schema: { $ref: "#/components/schemas/ProgressionBackfillResult" } } }
        "403": { description: Admin access required }
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

const schemasBlock = `
    ProgressionSummary:
      type: object
      required: [totalXp, level, masteryLevel, rank, currentLevelXp, nextLevelXp, currentStreak, longestStreak]
      properties:
        totalXp: { type: integer, minimum: 0 }
        level: { type: integer, minimum: 1, maximum: 100 }
        masteryLevel: { type: integer, minimum: 0 }
        rank: { type: string }
        currentLevelXp: { type: integer, minimum: 0, description: Absolute XP floor for current level }
        nextLevelXp: { type: integer, minimum: 1, description: Absolute XP target for next level or Mastery step }
        currentStreak: { type: integer, minimum: 0 }
        longestStreak: { type: integer, minimum: 0 }
    ProgressionAchievement:
      type: object
      required: [key, unlocked, unlockedAt]
      properties:
        key: { type: string }
        unlocked: { type: boolean }
        unlockedAt: { type: ["string", "null"], format: date-time }
    ProgressionCatalog:
      type: object
      required: [achievements]
      properties:
        achievements: { type: array, items: { $ref: "#/components/schemas/ProgressionAchievement" } }
    ProgressionLedgerEntry:
      type: object
      required: [id, source, xp, dayBucket, ruleVersion, createdAt]
      properties:
        id: { type: integer }
        source: { type: string }
        xp: { type: integer }
        dayBucket: { type: string }
        ruleVersion: { type: string }
        createdAt: { type: string, format: date-time }
    ProgressionHistory:
      type: object
      required: [entries]
      properties:
        entries: { type: array, items: { $ref: "#/components/schemas/ProgressionLedgerEntry" } }
    ProgressionActivityInput:
      type: object
      required: [token]
      properties:
        token: { type: string, minLength: 32 }
    ProgressionEvidenceStartInput:
      type: object
      required: [source]
      properties:
        source: { type: string, enum: [pre_analysis_checklist, guide_completion] }
        guideId: { type: string, enum: [how-ai-works, feature-map, reading-analysis, validity-confidence, adaptive-plan, analysis-workflow, bias-confidence-validity, levels-chart, technical-fundamental, standard-plan, adaptive-position-plan, account-rules, terms] }
        checklist:
          type: object
          required: [instrument, timeframe]
          properties:
            instrument: { type: string }
            timeframe: { type: string }
    ProgressionEvidenceSession:
      type: object
      required: [token, source, subject, minimumCompleteAt]
      properties:
        token: { type: string }
        source: { type: string }
        subject: { type: string }
        minimumCompleteAt: { type: string, format: date-time }
    ProgressionAward:
      type: object
      required: [awarded, xp]
      properties:
        awarded: { type: boolean }
        xp: { type: integer }
        reason: { type: string }
    ProgressionAuditEntry:
      type: object
      required: [id, userId, source, sourceEventId, xp, dayBucket, ruleVersion, metadata, createdAt]
      properties:
        id: { type: integer }
        userId: { type: integer }
        source: { type: string }
        sourceEventId: { type: string }
        xp: { type: integer }
        dayBucket: { type: string }
        ruleVersion: { type: string }
        metadata: { type: object, additionalProperties: true }
        createdAt: { type: string, format: date-time }
    ProgressionAudit:
      type: object
      required: [entries]
      properties:
        entries: { type: array, items: { $ref: "#/components/schemas/ProgressionAuditEntry" } }
    ProgressionBackfillResult:
      type: object
      required: [awarded, scanned, ruleVersion]
      properties:
        awarded: { type: integer, minimum: 0 }
        scanned: { type: integer, minimum: 0 }
        ruleVersion: { type: string }
`;

let newYaml = original.replace('  /healthz:', progressionPaths + '\n  /healthz:');
newYaml = newYaml.replace('    StandardTradingRules:', schemasBlock + '\n    StandardTradingRules:');

fs.writeFileSync('lib/api-spec/openapi.yaml', newYaml);
