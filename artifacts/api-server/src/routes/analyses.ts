import { Router } from "express";
import { db } from "../lib/db";
import { analyses, feedback, notifications, users } from "@workspace/db/schema";
import { eq, and, desc, count, sql, gte, lte, ilike } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { generateAnalysis, getValidUntil, type BeginnerAIOutput, type ProAIOutput } from "../lib/openai";
import { getIndicators, formatIndicatorsForPrompt, isSupportedIndicatorTimeframe } from "../lib/historical";
import { getRelevantNews, formatNewsForPrompt } from "../lib/news";
import { getRelevantCalendar, formatCalendarForPrompt } from "../lib/calendar";
import { notificationsEmitter } from "../lib/notifications-emitter";

let aiErrorCount = 0;
let aiErrorWindowStart = Date.now();
const AI_ERROR_THRESHOLD = 3;
const AI_ERROR_WINDOW_MS = 60 * 60 * 1000;

async function trackAiError(): Promise<void> {
  const now = Date.now();
  if (now - aiErrorWindowStart > AI_ERROR_WINDOW_MS) {
    aiErrorCount = 0;
    aiErrorWindowStart = now;
  }
  aiErrorCount += 1;
  if (aiErrorCount >= AI_ERROR_THRESHOLD) {
    aiErrorCount = 0;
    const admins = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`${users.role} IN ('admin', 'super_admin')`);
    if (admins.length > 0) {
      const errorTitle = "Peringatan: Error AI Berulang";
      const errorMessage = `Lebih dari ${AI_ERROR_THRESHOLD} kegagalan analisis AI terjadi dalam 1 jam terakhir. Periksa koneksi dan konfigurasi AI.`;
      await db.insert(notifications).values(
        admins.map((a) => ({
          userId: a.id,
          title: errorTitle,
          message: errorMessage,
          type: "error" as const,
        }))
      );
      const nowIso = new Date().toISOString();
      for (const a of admins) {
        notificationsEmitter.emitForUser(a.id, {
          title: errorTitle,
          message: errorMessage,
          type: "error",
          createdAt: nowIso,
        });
      }
    }
  }
}

const router = Router();

router.get("/analyses/summary", requireAuth, async (req: AuthRequest, res) => {
  const [result] = await db
    .select({
      total: count(analyses.id),
      beginnerCount: sql<number>`sum(case when ${analyses.mode} = 'beginner' then 1 else 0 end)`,
      proCount: sql<number>`sum(case when ${analyses.mode} = 'pro' then 1 else 0 end)`,
      avgConfidenceMin: sql<number>`avg(${analyses.confidenceMin})`,
      avgConfidenceMax: sql<number>`avg(${analyses.confidenceMax})`,
    })
    .from(analyses)
    .where(eq(analyses.userId, req.userId!));

  res.json({
    totalAnalyses: Number(result.total),
    beginnerCount: Number(result.beginnerCount ?? 0),
    proCount: Number(result.proCount ?? 0),
    avgConfidenceMin: result.avgConfidenceMin ? Number(result.avgConfidenceMin) : null,
    avgConfidenceMax: result.avgConfidenceMax ? Number(result.avgConfidenceMax) : null,
    recentAnalyses: [],
  });
});

router.get("/analyses/recent-instruments", requireAuth, async (req: AuthRequest, res) => {
  const rows = await db
    .selectDistinct({
      instrument: analyses.instrument,
      createdAt: analyses.createdAt,
      mode: analyses.mode,
    })
    .from(analyses)
    .where(eq(analyses.userId, req.userId!))
    .orderBy(desc(analyses.createdAt))
    .limit(10);

  const seen = new Set<string>();
  const unique = rows.filter((r) => {
    if (seen.has(r.instrument)) return false;
    seen.add(r.instrument);
    return true;
  }).slice(0, 3);

  res.json({
    instruments: unique.map((r) => ({
      instrument: r.instrument,
      lastAnalyzedAt: r.createdAt.toISOString(),
      mode: r.mode,
    })),
  });
});

router.get("/analyses/quota", requireAuth, async (req: AuthRequest, res) => {
  const isPrivilegedRole = req.userRole === "admin" || req.userRole === "super_admin";
  if (isPrivilegedRole) {
    res.json({
      unlimited: true,
      hourly: { limit: ANALYSIS_QUOTA_PER_HOUR, used: 0, remaining: ANALYSIS_QUOTA_PER_HOUR },
      daily: { limit: ANALYSIS_QUOTA_PER_DAY, used: 0, remaining: ANALYSIS_QUOTA_PER_DAY },
    });
    return;
  }

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [usage] = await db
    .select({
      hourly: sql<number>`sum(case when ${analyses.createdAt} >= ${hourAgo} then 1 else 0 end)`,
      daily: sql<number>`sum(case when ${analyses.createdAt} >= ${dayAgo} then 1 else 0 end)`,
    })
    .from(analyses)
    .where(and(eq(analyses.userId, req.userId!), gte(analyses.createdAt, dayAgo)));

  const hourlyUsed = Number(usage?.hourly ?? 0);
  const dailyUsed = Number(usage?.daily ?? 0);

  res.json({
    unlimited: false,
    hourly: {
      limit: ANALYSIS_QUOTA_PER_HOUR,
      used: hourlyUsed,
      remaining: Math.max(0, ANALYSIS_QUOTA_PER_HOUR - hourlyUsed),
    },
    daily: {
      limit: ANALYSIS_QUOTA_PER_DAY,
      used: dailyUsed,
      remaining: Math.max(0, ANALYSIS_QUOTA_PER_DAY - dailyUsed),
    },
  });
});

router.get("/analyses/personal-analytics", requireAuth, async (req: AuthRequest, res) => {
  const all = await db
    .select({
      id: analyses.id,
      mode: analyses.mode,
      instrument: analyses.instrument,
      createdAt: analyses.createdAt,
    })
    .from(analyses)
    .where(eq(analyses.userId, req.userId!))
    .orderBy(desc(analyses.createdAt));

  const now = new Date();
  const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const total = all.length;
  const thisMonth = all.filter((a) => new Date(a.createdAt) >= thisMonthStart).length;
  const thisWeek = all.filter((a) => new Date(a.createdAt) >= thisWeekStart).length;

  const instrumentCount: Record<string, number> = {};
  const modeCount: Record<string, number> = {};

  for (const a of all) {
    instrumentCount[a.instrument] = (instrumentCount[a.instrument] ?? 0) + 1;
    modeCount[a.mode] = (modeCount[a.mode] ?? 0) + 1;
  }

  const topInstruments = Object.entries(instrumentCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([instrument, count]) => ({ instrument, count }));

  const dominantMode =
    (modeCount["pro"] ?? 0) > (modeCount["beginner"] ?? 0) ? "pro" : "beginner";

  const feedbackRows = await db
    .select({ feedbackType: feedback.feedbackType, outcome: feedback.outcome })
    .from(feedback)
    .where(eq(feedback.userId, req.userId!));

  const totalFeedback = feedbackRows.length;
  const correctCount = feedbackRows.filter((f) => f.outcome === "correct").length;
  const accuracyRate =
    totalFeedback > 0 ? Math.round((correctCount / totalFeedback) * 100) : null;

  const rangeRaw = typeof req.query["range"] === "string" ? req.query["range"] : "weekly";
  const range: "daily" | "weekly" | "monthly" =
    rangeRaw === "daily" || rangeRaw === "monthly" ? rangeRaw : "weekly";

  const weekly: { week: string; count: number }[] = [];

  if (range === "daily") {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(startOfToday.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const c = all.filter(
        (a) => new Date(a.createdAt) >= dayStart && new Date(a.createdAt) < dayEnd,
      ).length;
      weekly.push({
        week: dayStart.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
        count: c,
      });
    }
  } else if (range === "monthly") {
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const c = all.filter(
        (a) => new Date(a.createdAt) >= monthStart && new Date(a.createdAt) < monthEnd,
      ).length;
      weekly.push({
        week: monthStart.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
        count: c,
      });
    }
  } else {
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const c = all.filter(
        (a) => new Date(a.createdAt) >= weekStart && new Date(a.createdAt) < weekEnd,
      ).length;
      weekly.push({
        week: weekStart.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
        count: c,
      });
    }
  }

  res.json({
    totalAllTime: total,
    totalThisMonth: thisMonth,
    totalThisWeek: thisWeek,
    topInstruments,
    dominantMode,
    accuracyRate,
    feedbackCount: totalFeedback,
    weeklyData: weekly,
  });
});

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const ANALYSIS_QUOTA_PER_HOUR = parsePositiveInt(process.env["ANALYSIS_QUOTA_PER_HOUR"], 5);
const ANALYSIS_QUOTA_PER_DAY = parsePositiveInt(process.env["ANALYSIS_QUOTA_PER_DAY"], 20);
const ANALYSIS_LOCK_NAMESPACE = 4242;

type AIResult = Awaited<ReturnType<typeof generateAnalysis>>;
type AnalysisRow = typeof analyses.$inferSelect;
type QuotaOutcome =
  | { kind: "ok"; analysis: AnalysisRow }
  | { kind: "busy" }
  | { kind: "hour"; used: number }
  | { kind: "day"; used: number }
  | { kind: "aiError" };

router.post("/analyses", requireAuth, async (req: AuthRequest, res) => {
  const { instrument, timeframe, mode, userInputContext } = req.body;

  if (!instrument || !timeframe || !mode) {
    res.status(400).json({ error: "Instrumen, timeframe, dan mode wajib diisi" });
    return;
  }

  if (!["beginner", "pro"].includes(mode)) {
    res.status(400).json({ error: "Mode tidak valid" });
    return;
  }

  const userId = req.userId!;
  const typedMode = mode as "beginner" | "pro";
  const isPrivilegedRole = req.userRole === "admin" || req.userRole === "super_admin";

  // External context fetches are pure HTTP — do them outside any transaction.
  // Indicators only support daily/weekly today; skip them for intraday timeframes
  // so the AI is not fed stale daily data labelled as e.g. "1h".
  const indicatorTf = isSupportedIndicatorTimeframe(timeframe) ? timeframe : null;
  const contextParts: string[] = [];
  // Snapshot the overall buy/sell/neutral tally that drives the Market Context
  // Summary card on the Analyze tab so the saved analysis page can render the
  // same card later. Stays null when indicators were unavailable.
  let techCounts: { buy: number; sell: number; neutral: number } | null = null;
  await Promise.allSettled([
    indicatorTf
      ? getIndicators(instrument, indicatorTf).then((ind) => {
          if (ind) {
            contextParts.push(formatIndicatorsForPrompt(ind, indicatorTf));
            techCounts = {
              buy: ind.overallSummary.buy,
              sell: ind.overallSummary.sell,
              neutral: ind.overallSummary.neutral,
            };
          }
        })
      : Promise.resolve(),
    getRelevantNews(instrument).then((news) => {
      if (news.length) contextParts.push(formatNewsForPrompt(news, instrument));
    }),
    getRelevantCalendar(instrument).then((events) => {
      if (events.length) contextParts.push(formatCalendarForPrompt(events, instrument));
    }),
  ]);
  const indicatorContext = contextParts.length ? contextParts.join("\n") : undefined;

  const validUntil = getValidUntil(timeframe);

  const buildInsertValues = (aiResult: AIResult) => {
    const modeSpecificFields =
      typedMode === "beginner"
        ? {
            mainScenario: (aiResult as BeginnerAIOutput).mainScenario,
            alternativeScenario: (aiResult as BeginnerAIOutput).alternativeScenario,
            whyReason: (aiResult as BeginnerAIOutput).whyReason,
            failureConditions: (aiResult as BeginnerAIOutput).failureConditions,
          }
        : {
            baseCase: (aiResult as ProAIOutput).baseCase,
            bullishScenario: (aiResult as ProAIOutput).bullishScenario,
            bearishScenario: (aiResult as ProAIOutput).bearishScenario,
            keyDriversTechnical: (aiResult as ProAIOutput).keyDriversTechnical,
            keyDriversFundamental: (aiResult as ProAIOutput).keyDriversFundamental,
            marketContext: (aiResult as ProAIOutput).marketContext,
            invalidationConditions: (aiResult as ProAIOutput).invalidationConditions,
            uncertaintyNotes: (aiResult as ProAIOutput).uncertaintyNotes,
          };
    return {
      userId,
      instrument,
      timeframe,
      mode: typedMode,
      userInputContext: userInputContext ?? null,
      rawAiOutput: JSON.stringify(aiResult),
      validUntil,
      marketCondition: aiResult.marketCondition,
      riskLevel: aiResult.riskLevel,
      confidenceMin: aiResult.confidenceMin,
      confidenceMax: aiResult.confidenceMax,
      tradingBias: aiResult.tradingBias,
      opportunity: aiResult.opportunity,
      risk: aiResult.risk,
      techBuyCount: techCounts?.buy ?? null,
      techSellCount: techCounts?.sell ?? null,
      techNeutralCount: techCounts?.neutral ?? null,
      tradePlan: aiResult.tradePlan ?? null,
      ...modeSpecificFields,
    };
  };

  let outcome: QuotaOutcome;

  if (isPrivilegedRole) {
    let aiResult: AIResult;
    try {
      aiResult = await generateAnalysis(instrument, timeframe, typedMode, userInputContext, indicatorContext);
    } catch (aiErr) {
      void trackAiError();
      res.status(502).json({ error: "Layanan AI sedang tidak tersedia. Silakan coba lagi dalam beberapa saat." });
      return;
    }
    const [analysis] = await db.insert(analyses).values(buildInsertValues(aiResult)).returning();
    outcome = { kind: "ok", analysis };
  } else {
    // Atomically: take a per-user xact-scoped advisory lock, count usage,
    // call AI, and insert. The lock auto-releases on COMMIT/ROLLBACK so
    // concurrent requests for the same user cannot bypass the quota.
    outcome = await db.transaction<QuotaOutcome>(async (tx) => {
      const lockRow = await tx.execute(
        sql`SELECT pg_try_advisory_xact_lock(${ANALYSIS_LOCK_NAMESPACE}::int, ${userId}::int) AS acquired`
      );
      const acquired = (lockRow.rows?.[0] as { acquired?: boolean } | undefined)?.acquired === true;
      if (!acquired) return { kind: "busy" };

      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [usage] = await tx
        .select({
          hourly: sql<number>`sum(case when ${analyses.createdAt} >= ${hourAgo} then 1 else 0 end)`,
          daily: sql<number>`sum(case when ${analyses.createdAt} >= ${dayAgo} then 1 else 0 end)`,
        })
        .from(analyses)
        .where(and(eq(analyses.userId, userId), gte(analyses.createdAt, dayAgo)));

      const hourlyCount = Number(usage?.hourly ?? 0);
      const dailyCount = Number(usage?.daily ?? 0);

      if (hourlyCount >= ANALYSIS_QUOTA_PER_HOUR) {
        return { kind: "hour", used: hourlyCount };
      }
      if (dailyCount >= ANALYSIS_QUOTA_PER_DAY) {
        return { kind: "day", used: dailyCount };
      }

      let aiResult: AIResult;
      try {
        aiResult = await generateAnalysis(instrument, timeframe, typedMode, userInputContext, indicatorContext);
      } catch (aiErr) {
        return { kind: "aiError" };
      }

      const [analysis] = await tx.insert(analyses).values(buildInsertValues(aiResult)).returning();
      return { kind: "ok", analysis };
    });
  }

  if (outcome.kind === "busy") {
    res.status(429).set("Retry-After", "5").json({
      error: "Permintaan analisis sebelumnya masih diproses. Mohon tunggu sebentar.",
      quota: { scope: "concurrent" },
    });
    return;
  }
  if (outcome.kind === "hour") {
    res.status(429).set("Retry-After", "3600").json({
      error: `Batas analisis per jam tercapai (${ANALYSIS_QUOTA_PER_HOUR} analisis/jam). Silakan coba lagi dalam beberapa saat.`,
      quota: { scope: "hour", limit: ANALYSIS_QUOTA_PER_HOUR, used: outcome.used },
    });
    return;
  }
  if (outcome.kind === "day") {
    res.status(429).set("Retry-After", "86400").json({
      error: `Batas analisis harian tercapai (${ANALYSIS_QUOTA_PER_DAY} analisis/hari). Silakan coba lagi besok.`,
      quota: { scope: "day", limit: ANALYSIS_QUOTA_PER_DAY, used: outcome.used },
    });
    return;
  }
  if (outcome.kind === "aiError") {
    void trackAiError();
    res.status(502).json({ error: "Layanan AI sedang tidak tersedia. Silakan coba lagi dalam beberapa saat." });
    return;
  }

  const analysis = outcome.analysis;

  const completeTitle = "Analisis Selesai";
  const completeMessage = `Analisis ${instrument} (${timeframe}, ${typedMode === "beginner" ? "Pemula" : "Pro"}) telah selesai diproses.`;
  await db.insert(notifications).values({
    userId: req.userId!,
    title: completeTitle,
    message: completeMessage,
    type: "info",
  });
  notificationsEmitter.emitForUser(req.userId!, {
    title: completeTitle,
    message: completeMessage,
    type: "info",
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(analysis);
});

router.get("/analyses", requireAuth, async (req: AuthRequest, res) => {
  // Clamp pagination so a malicious or malformed `page` / `limit` (negative,
  // huge, NaN) cannot crash the query, blow up memory, or generate negative
  // OFFSETs. Mirrors the clamp pattern used by GET /superadmin/users.
  const rawPage = Number(req.query["page"] ?? 1);
  const rawLimit = Number(req.query["limit"] ?? 20);
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 100)
    : 20;
  const offset = (page - 1) * limit;
  const filterMode = req.query["mode"] as string | undefined;
  const filterInstrument = req.query["instrument"] as string | undefined;
  const filterFrom = req.query["from"] as string | undefined;
  const filterTo = req.query["to"] as string | undefined;

  const conditions = [eq(analyses.userId, req.userId!)];
  if (filterMode === "beginner" || filterMode === "pro") {
    conditions.push(eq(analyses.mode, filterMode));
  }
  if (filterInstrument) {
    conditions.push(ilike(analyses.instrument, `%${filterInstrument}%`));
  }
  if (filterFrom) {
    conditions.push(gte(analyses.createdAt, new Date(filterFrom)));
  }
  if (filterTo) {
    const toDate = new Date(filterTo);
    toDate.setHours(23, 59, 59, 999);
    conditions.push(lte(analyses.createdAt, toDate));
  }

  const whereClause = and(...conditions);

  const rows = await db
    .select()
    .from(analyses)
    .where(whereClause)
    .orderBy(desc(analyses.createdAt))
    .limit(limit)
    .offset(offset);

  const [total] = await db
    .select({ count: count(analyses.id) })
    .from(analyses)
    .where(whereClause);

  res.json({
    analyses: rows,
    total: Number(total.count),
    page,
    limit,
  });
});

router.get("/analyses/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params["id"]);

  const [analysis] = await db
    .select()
    .from(analyses)
    .where(and(eq(analyses.id, id), eq(analyses.userId, req.userId!)))
    .limit(1);

  if (!analysis) {
    res.status(404).json({ error: "Analisis tidak ditemukan" });
    return;
  }

  const [fb] = await db
    .select()
    .from(feedback)
    .where(
      and(eq(feedback.analysisId, id), eq(feedback.userId, req.userId!))
    )
    .limit(1);

  res.json({ ...analysis, feedback: fb ?? null });
});

router.post("/analyses/:id/feedback", requireAuth, async (req: AuthRequest, res) => {
  const analysisId = Number(req.params["id"]);
  const { feedbackType, outcome, note } = req.body;

  if (!feedbackType || !["useful", "not_useful"].includes(feedbackType)) {
    res.status(400).json({ error: "Feedback type tidak valid" });
    return;
  }

  const [analysis] = await db
    .select({ id: analyses.id })
    .from(analyses)
    .where(and(eq(analyses.id, analysisId), eq(analyses.userId, req.userId!)))
    .limit(1);

  if (!analysis) {
    res.status(404).json({ error: "Analisis tidak ditemukan" });
    return;
  }

  const existing = await db
    .select({ id: feedback.id })
    .from(feedback)
    .where(
      and(
        eq(feedback.analysisId, analysisId),
        eq(feedback.userId, req.userId!)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(feedback)
      .set({ feedbackType, outcome: outcome ?? null, note: note ?? null })
      .where(eq(feedback.id, existing[0].id))
      .returning();
    res.json(updated);
    return;
  }

  const [newFeedback] = await db
    .insert(feedback)
    .values({
      analysisId,
      userId: req.userId!,
      feedbackType,
      outcome: outcome ?? null,
      note: note ?? null,
    })
    .returning();

  res.status(201).json(newFeedback);
});

export default router;
