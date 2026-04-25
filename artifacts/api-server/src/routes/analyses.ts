import { Router } from "express";
import { db } from "../lib/db";
import { analyses, feedback, notifications, users } from "@workspace/db/schema";
import { eq, and, desc, count, sql, gte, lte, ilike } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { generateAnalysis, getValidUntil, type BeginnerAIOutput, type ProAIOutput } from "../lib/openai";
import { getIndicators, formatIndicatorsForPrompt } from "../lib/historical";
import { getRelevantNews, formatNewsForPrompt } from "../lib/news";
import { getRelevantCalendar, formatCalendarForPrompt } from "../lib/calendar";

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
      await db.insert(notifications).values(
        admins.map((a) => ({
          userId: a.id,
          title: "Peringatan: Error AI Berulang",
          message: `Lebih dari ${AI_ERROR_THRESHOLD} kegagalan analisis AI terjadi dalam 1 jam terakhir. Periksa koneksi dan konfigurasi AI.`,
          type: "error" as const,
        }))
      );
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

  const weekly: { week: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const c = all.filter(
      (a) =>
        new Date(a.createdAt) >= weekStart && new Date(a.createdAt) < weekEnd
    ).length;
    weekly.push({
      week: `${weekStart.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}`,
      count: c,
    });
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

  const contextParts: string[] = [];

  await Promise.allSettled([
    getIndicators(instrument).then((ind) => {
      if (ind) contextParts.push(formatIndicatorsForPrompt(ind));
    }),
    getRelevantNews(instrument).then((news) => {
      if (news.length) contextParts.push(formatNewsForPrompt(news, instrument));
    }),
    getRelevantCalendar(instrument).then((events) => {
      if (events.length) contextParts.push(formatCalendarForPrompt(events, instrument));
    }),
  ]);

  const indicatorContext = contextParts.length ? contextParts.join("\n") : undefined;
  const typedMode = mode as "beginner" | "pro";
  let aiResult: Awaited<ReturnType<typeof generateAnalysis>>;
  try {
    aiResult = await generateAnalysis(instrument, timeframe, typedMode, userInputContext, indicatorContext);
  } catch (aiErr) {
    void trackAiError();
    throw aiErr;
  }
  const validUntil = getValidUntil(timeframe);

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

  const [analysis] = await db
    .insert(analyses)
    .values({
      userId: req.userId!,
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
      ...modeSpecificFields,
    })
    .returning();

  await db.insert(notifications).values({
    userId: req.userId!,
    title: "Analisis Selesai",
    message: `Analisis ${instrument} (${timeframe}, ${typedMode === "beginner" ? "Pemula" : "Pro"}) telah selesai diproses.`,
    type: "info",
  });

  res.status(201).json(analysis);
});

router.get("/analyses", requireAuth, async (req: AuthRequest, res) => {
  const page = Number(req.query["page"] ?? 1);
  const limit = Number(req.query["limit"] ?? 20);
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
