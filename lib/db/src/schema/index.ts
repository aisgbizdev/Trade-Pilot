import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export type TradeSideShape = {
  entryZone: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  riskRewardRatio: string;
  rationale: string;
};

export type TradePlanShape = {
  preferredSide: "buy" | "sell" | "wait";
  buy: TradeSideShape;
  sell: TradeSideShape;
};

// Snapshot of the news + economic-calendar items the AI saw at analysis
// time so the saved-analysis page can render the same fundamental
// context the user (and the model) had — without re-fetching live data
// that may have moved on. Captured on the analyses row by the POST
// /api/analyses handler in `routes/analyses.ts`.
export type FundamentalNewsItemShape = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string | null;
  publishedAt: string;
};

export type FundamentalCalendarEventShape = {
  date: string;
  time: string | null;
  currency: string;
  event: string;
  impact: string | null;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
};

export type FundamentalContextShape = {
  newsItems: FundamentalNewsItemShape[];
  calendarEvents: FundamentalCalendarEventShape[];
};

// Provenance trail emitted by the AI: which news headlines + calendar
// event names it actually leaned on while writing the narrative. Lets
// the analysis-detail page inline-cite the matching cards next to
// `whyReason` / `keyDriversFundamental` / `marketContext` (task #89).
// Stored alongside `fundamentalContext` so the inline chips can match
// against the same persisted snapshot the AI was given.
export type FundamentalCitationsShape = {
  newsTitles: string[];
  calendarEvents: string[];
};

export const roleEnum = pgEnum("role", ["user", "admin", "super_admin"]);
export const modeEnum = pgEnum("mode", ["beginner", "pro"]);
export const marketConditionEnum = pgEnum("market_condition", [
  "trending_up",
  "trending_down",
  "ranging",
  "volatile",
]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high"]);
export const feedbackTypeEnum = pgEnum("feedback_type", [
  "useful",
  "not_useful",
]);
export const outcomeEnum = pgEnum("outcome", ["correct", "wrong", "unknown"]);
// Outcome of the AI's trade plan after the fact — did price actually touch
// TP1 / TP2 / SL within the analysis's validity window? Populated by the
// background resolver in `lib/outcomes.ts`, separate from the user-driven
// `outcomeEnum` above (which lives on the feedback table).
export const analysisOutcomeEnum = pgEnum("analysis_outcome", [
  "pending",
  "tp1_hit",
  "tp2_hit",
  "sl_hit",
  "expired",
  "invalidated",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "warning",
  "error",
]);
export const audienceTypeEnum = pgEnum("audience_type", [
  "all",
  "role",
  "tag",
]);

// Which AI-generated level a price_alerts row is watching. `entry` is the
// AI's preferred entry zone, `sl` the stop-loss, `tp1` / `tp2` the two
// take-profits. One analysis can arm up to 4 levels per side, but in v1
// we only arm levels for the AI's `preferredSide` (buy or sell), so each
// active analysis has at most 4 rows.
export const alertLevelEnum = pgEnum("alert_level", ["entry", "sl", "tp1", "tp2"]);
// Direction the price needs to cross to fire the alert. Computed at arm
// time from the spot price vs. the level: if spot is above the level,
// we fire `below` (price needs to fall to touch); if spot is below, we
// fire `above`. Stored explicitly so the watcher doesn't have to
// re-derive it (and stays correct even if our derivation logic changes
// later).
export const alertDirectionEnum = pgEnum("alert_direction", ["above", "below"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  role: roleEnum("role").notNull().default("user"),
  selectedMode: modeEnum("selected_mode").notNull().default("beginner"),
  themePreference: text("theme_preference").notNull().default("light"),
  onboardingCompleted: boolean("onboarding_completed")
    .notNull()
    .default(false),
  securityQuestion: text("security_question").notNull(),
  securityAnswerHash: text("security_answer_hash").notNull(),
  pushExpiry: boolean("push_expiry").notNull().default(true),
  pushBroadcast: boolean("push_broadcast").notNull().default(true),
  // Daily-summary push (task #113). Three columns control delivery:
  //  - `pushDailySummary`: alert-type opt-in, sits next to pushExpiry /
  //    pushBroadcast on the notifications page. When false, the
  //    scheduled push is suppressed (in-app notification still lands).
  //  - `dailySummaryEnabled`: master on/off for the daily-summary
  //    feature itself (separate from the alert-type switch so users
  //    can disable the digest entirely without touching push prefs).
  //  - `dailySummaryTime`: HH:MM in 24h local-time the digest should
  //    fire at (defaults to 07:00).
  //  - `dailySummaryTimezone`: IANA timezone the time is interpreted in
  //    (defaults to Asia/Jakarta — the project's primary user base).
  //  - `dailySummaryLastSentDate`: YYYY-MM-DD in the user's local
  //    timezone the last digest was sent on. Guards once-per-day
  //    idempotency even if the scheduler ticks multiple times after the
  //    user's scheduled time.
  pushDailySummary: boolean("push_daily_summary").notNull().default(true),
  // Tier 1 push categories (task #140). Same opt-out pattern as the
  // older `pushExpiry` / `pushBroadcast` toggles — when false the
  // OS-level push is suppressed but the in-app notification still
  // surfaces in /notifications. Defaults true so the feature is on for
  // existing accounts without forcing a re-onboarding step.
  pushMarketNews: boolean("push_market_news").notNull().default(true),
  pushCalendarEvents: boolean("push_calendar_events").notNull().default(true),
  // Tier 2 push categories (task #141). Same opt-out pattern as the
  // Tier 1 toggles above — false suppresses OS push only, the in-app
  // notification row still surfaces in /notifications.
  pushPriceAnomaly: boolean("push_price_anomaly").notNull().default(true),
  pushWeeklyRecap: boolean("push_weekly_recap").notNull().default(true),
  pushSignalFlip: boolean("push_signal_flip").notNull().default(true),
  // UI language preference ("en" / "id") — synced from the client
  // i18n provider so background dispatchers (e.g. weekly trader-mirror
  // report, task #162) can render OS push + in-app notification copy
  // in the user's chosen language without depending on per-request
  // headers. Defaults "en" for safety.
  lang: text("lang").notNull().default("en"),
  // Tier 3 push (task #142) — habit & retention nudges. Conservative
  // defaults: dormancy nudge is opt-in (false), onboarding is opt-out
  // (true) and only ever fires once per user.
  //  - `marketOpenSessions`: which FX sessions the user wants a 5-min
  //    pre-open ping for. Empty array = feature off. Stored as jsonb
  //    string array (project convention — see dailyDigests.instruments)
  //    rather than pg text[] so adding session names later is migration-
  //    free.
  //  - `pushDormancyNudge`: opt-in for the "we miss you" weekly nudge.
  //    `dormancyNudgeStreak` is a backoff counter — incremented every
  //    time we send a nudge without the user coming back, reset on any
  //    new analysis. After 3 unanswered nudges the dispatcher auto-
  //    pauses the toggle (set to false) so we stop spamming dead users.
  //    `dormancyLastNudgeAt` is the timestamp of the last nudge — used
  //    to enforce the ≥7d cap.
  //  - `pushOnboarding`: opt-out flag for the 24h-after-signup empty-
  //    watchlist nudge. `onboardingNudgeSentAt` is the one-shot marker
  //    (non-null = already sent, never send again).
  //  - `disengageStreaks` / `disengageNoticeCategory`: shared
  //    auto-disengage engine state. The worker counts consecutive
  //    unread-after-48h notifications per category; after 3 it flips
  //    the matching opt-out boolean to false and stamps the category
  //    name in `disengageNoticeCategory` so the UI can render a
  //    one-time banner explaining what happened.
  marketOpenSessions: jsonb("market_open_sessions").$type<string[]>().notNull().default([]),
  pushDormancyNudge: boolean("push_dormancy_nudge").notNull().default(false),
  pushOnboarding: boolean("push_onboarding").notNull().default(true),
  dormancyNudgeStreak: integer("dormancy_nudge_streak").notNull().default(0),
  dormancyLastNudgeAt: timestamp("dormancy_last_nudge_at"),
  onboardingNudgeSentAt: timestamp("onboarding_nudge_sent_at"),
  disengageStreaks: jsonb("disengage_streaks").$type<Record<string, number>>().notNull().default({}),
  disengageNoticeCategory: text("disengage_notice_category"),
  // Per-category ISO timestamp: when set, the auto-disengage worker
  // ignores notifications older than this for that category. Stamped
  // (a) when the worker hits the pause threshold, and (b) when the
  // user re-opts into a category whose toggle was previously auto-
  // flipped off. Without it, historical unread rows in the 30-day
  // lookback would re-trigger pause/banner on every tick.
  disengageCheckpoints: jsonb("disengage_checkpoints").$type<Record<string, string>>().notNull().default({}),
  // Anti-pattern guardrails (task #163). Soft warnings shown above the
  // analyse button when the user is about to revenge-trade, overtrade,
  // or open a position right before a known high-risk window. Each
  // category has an individual opt-out so a power user can silence the
  // overtrading nag while keeping the imminent-event reminder. Default
  // ON for the three signals (low-noise + protective), OFF for the
  // cooling-off mode (it imposes a 30-min countdown that some users
  // will find too restrictive, so we wait for explicit opt-in).
  guardrailRevenge: boolean("guardrail_revenge").notNull().default(true),
  guardrailOvertrading: boolean("guardrail_overtrading").notNull().default(true),
  guardrailHighRisk: boolean("guardrail_high_risk").notNull().default(true),
  coolingOffEnabled: boolean("cooling_off_enabled").notNull().default(false),
  dailySummaryEnabled: boolean("daily_summary_enabled").notNull().default(false),
  dailySummaryTime: text("daily_summary_time").notNull().default("07:00"),
  dailySummaryTimezone: text("daily_summary_timezone").notNull().default("Asia/Jakarta"),
  dailySummaryLastSentDate: text("daily_summary_last_sent_date"),
  // Persistent brute-force protection for /auth/forgot-password/verify.
  // The IP+email rate limiter is in-memory (resets on restart) and
  // bypassable via IP rotation; these columns layer a per-account
  // counter + temporary lockout that survives restarts and applies no
  // matter where the wrong-answer attempts come from.
  failedResetAttempts: integer("failed_reset_attempts").notNull().default(0),
  resetLockedUntil: timestamp("reset_locked_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  instrument: text("instrument").notNull(),
  timeframe: text("timeframe").notNull(),
  mode: modeEnum("mode").notNull(),
  userInputContext: text("user_input_context"),
  rawAiOutput: text("raw_ai_output"),
  validUntil: timestamp("valid_until").notNull(),
  marketCondition: marketConditionEnum("market_condition").notNull(),
  riskLevel: riskLevelEnum("risk_level").notNull(),
  confidenceMin: integer("confidence_min").notNull(),
  confidenceMax: integer("confidence_max").notNull(),
  mainScenario: text("main_scenario"),
  alternativeScenario: text("alternative_scenario"),
  whyReason: text("why_reason"),
  failureConditions: text("failure_conditions"),
  baseCase: text("base_case"),
  bullishScenario: text("bullish_scenario"),
  bearishScenario: text("bearish_scenario"),
  keyDriversTechnical: text("key_drivers_technical"),
  keyDriversFundamental: text("key_drivers_fundamental"),
  marketContext: text("market_context"),
  invalidationConditions: text("invalidation_conditions"),
  uncertaintyNotes: text("uncertainty_notes"),
  tradingBias: text("trading_bias"),
  opportunity: text("opportunity"),
  risk: text("risk"),
  // Snapshot of the technical-indicator tally at analysis time so the saved
  // analysis page can render the same Market Context Summary card the user
  // saw on the Analyze tab. Nullable: legacy rows + intraday timeframes
  // without indicator support won't have these.
  techBuyCount: integer("tech_buy_count"),
  techSellCount: integer("tech_sell_count"),
  techNeutralCount: integer("tech_neutral_count"),
  // Structured trade plan (entry/SL/TP for both buy and sell scenarios)
  // generated by the AI and anchored to the latest closing price. Stored as
  // JSONB so the saved analysis page can render concrete suggested levels
  // without re-prompting the model. Nullable for legacy rows + cases where
  // no anchor price was available at analysis time.
  tradePlan: jsonb("trade_plan").$type<TradePlanShape>(),
  // Snapshot of the news headlines + economic-calendar events the AI
  // saw when generating this analysis (task #88). Lets the saved
  // analysis page render the *same* fundamental context the model used,
  // and gives us provenance to verify that fundamental commentary is
  // grounded in real, citable sources rather than fabricated. Nullable
  // for legacy rows + cases where both upstream feeds were down.
  fundamentalContext: jsonb("fundamental_context").$type<FundamentalContextShape>(),
  // Which subset of `fundamentalContext` the AI actually cited in the
  // narrative blocks (task #89). Stored as JSONB so the saved-analysis
  // page can render inline source chips next to the AI's reasoning.
  // Nullable for legacy rows + analyses where the AI didn't lean on
  // any fundamental input.
  fundamentalCitations: jsonb("fundamental_citations").$type<FundamentalCitationsShape>(),
  // After-the-fact resolution of the AI's trade plan: did price actually
  // touch TP1 / TP2 / SL inside the validity window, or did the window
  // expire first? Populated by the background resolver in `lib/outcomes.ts`.
  // `outcomeStatus` defaults to 'pending' for new rows; `outcomeResolvedAt`
  // is the bar timestamp the trigger was hit on (or validUntil for
  // 'expired'); `outcomeCheckedAt` records when the resolver last looked.
  outcomeStatus: analysisOutcomeEnum("outcome_status").notNull().default("pending"),
  outcomeResolvedAt: timestamp("outcome_resolved_at"),
  outcomeCheckedAt: timestamp("outcome_checked_at"),
  // Private per-analysis trading journal note written by the owning user
  // (task #111). Plain text only — never fed into the AI prompt and never
  // exposed across users (ownership is already enforced by analyses.userId).
  // `userNoteUpdatedAt` is stamped server-side on every PUT so the
  // detail-page "Saved · {time}" indicator reflects the actual persisted
  // write, not the client clock.
  userNote: text("user_note"),
  userNoteUpdatedAt: timestamp("user_note_updated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id")
    .notNull()
    .references(() => analyses.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  feedbackType: feedbackTypeEnum("feedback_type").notNull(),
  outcome: outcomeEnum("outcome"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    targetRole: roleEnum("target_role"),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: notificationTypeEnum("type").notNull().default("info"),
    readAt: timestamp("read_at"),
    // Category tag used by the anti-annoyance engine in
    // `lib/notification-guards.ts` (task #140) to count per-category
    // sends inside a rolling window without depending on title/message
    // string-matching. Existing jobs can leave it null — the guards
    // only care about rows that opt into a category.
    category: text("category"),
    // Cross-run dedupe key (task #140). When set, the dispatcher
    // checks for an existing row with the same key before inserting,
    // so a 5-minute job tick can never deliver the same news/calendar
    // event twice to the same user. Postgres unique constraints allow
    // multiple NULLs, so legacy rows without a key coexist fine.
    dedupeKey: text("dedupe_key"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    dedupeKeyUnique: uniqueIndex("notifications_dedupe_key_unique").on(t.dedupeKey),
  }),
);

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userTags = pgTable(
  "user_tags",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userTagUnique: uniqueIndex("user_tags_user_tag_unique").on(t.userId, t.tag),
  }),
);

// Outbound click telemetry for sponsor / partner links (SOLID PRIME demo
// account CTA, TikTok @solid.prime live-analysis link, etc). userId is
// nullable because most surfaces — splash, landing header/footer/CTA — are
// reachable while signed out. `placement` is a stable slug (e.g.
// `landing-cta`) so the admin breakdown stays meaningful even after copy
// changes; `target` is the partner key (`sg-berjangka` or `tiktok`).
export const outboundClicks = pgTable("outbound_clicks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  placement: text("placement").notNull(),
  target: text("target").notNull(),
  lang: text("lang"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// One row per AI-generated level (entry / SL / TP1 / TP2) the user has
// opted in to be pinged about. The background watcher in `price-alerts.ts`
// polls live prices, fires a Web Push the first time `levelPrice` is
// crossed in `triggerDirection`, and stamps `triggeredAt`. Once a row's
// `validUntil` passes or any SL/TP on the same analysis fires, the
// remaining rows for that analysis are `cancelledAt`'d so the user
// doesn't keep getting alerts on a trade that already resolved.
export const priceAlerts = pgTable(
  "price_alerts",
  {
    id: serial("id").primaryKey(),
    analysisId: integer("analysis_id")
      .notNull()
      .references(() => analyses.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    instrument: text("instrument").notNull(),
    // Trade side this level belongs to ("buy" or "sell"). Stored as text
    // rather than a new enum because the existing TradePlanShape side
    // values are already a free-form union — keeping them aligned.
    side: text("side").notNull(),
    level: alertLevelEnum("level").notNull(),
    // The actual price the watcher compares against. Stored as text to
    // preserve the AI's exact precision (e.g. "1.08573") without falling
    // into numeric/float rounding — parsed back to a Number in the
    // watcher.
    levelPrice: text("level_price").notNull(),
    triggerDirection: alertDirectionEnum("trigger_direction").notNull(),
    validUntil: timestamp("valid_until").notNull(),
    triggeredAt: timestamp("triggered_at"),
    // Price the watcher saw when it decided the level had been crossed.
    // Logged for debugging "why did this fire?" support questions.
    triggeredPrice: text("triggered_price"),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    // The watcher tick scans by `(triggeredAt IS NULL, cancelledAt IS NULL,
    // validUntil > now)` grouped by instrument — this composite index keeps
    // that scan cheap as the table grows.
    activeByInstrument: uniqueIndex("price_alerts_unique_per_analysis_level").on(
      t.analysisId,
      t.level,
      t.side,
    ),
  }),
);

// One row per (user, calendar-day-in-user-TZ) once the morning digest
// has been generated and pushed (task #113). Persisted so:
//  1. The scheduler can idempotently skip users whose digest already
//     ran today even if the worker restarts mid-day.
//  2. The `/daily-summary` landing page can render the exact set of
//     analyses the push referenced (looked up by `analysisIds`) instead
//     of re-querying "latest" which would drift if newer analyses landed
//     after the digest fired.
// `kind` distinguishes a `full` digest (newly-generated or recently-
// reused analyses) from a `quota_only` digest sent when the user's
// hourly/daily AI quota was already exhausted (we still send something
// useful — the user's most recent existing analyses for the picked
// instruments).
export const dailyDigests = pgTable(
  "daily_digests",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // YYYY-MM-DD in the user's chosen IANA timezone — NOT a UTC date.
    // Stored as text so timezone arithmetic stays in JS and we don't
    // need to coerce a `date` column through pg's session timezone.
    digestDate: text("digest_date").notNull(),
    kind: text("kind").notNull(), // 'full' | 'quota_only'
    // The 3 instruments the digest covered, in display order.
    instruments: jsonb("instruments").notNull().$type<string[]>(),
    // FK-less list of analyses.id rows surfaced by this digest. We don't
    // model a separate join table because the order matters (it's the
    // same order as `instruments`) and the count is bounded at 3.
    analysisIds: jsonb("analysis_ids").notNull().$type<number[]>(),
    // Plain-text body sent in the push notification, persisted so the
    // landing page can echo it back ("you were told: X") for context.
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    // One digest per user per local day — the scheduler relies on this
    // unique constraint as a hard backstop against duplicate pushes.
    perUserPerDay: uniqueIndex("daily_digests_user_day_unique").on(t.userId, t.digestDate),
  }),
);

// Saved history-page filter combinations a user can recall with one tap
// (task #129). `filters` mirrors the URL-derived FilterState the history
// page already uses (mode + instruments[] + timeframes[] + from/to + q),
// stored as JSONB so adding a new filter key later doesn't need a
// migration. The (userId, name) unique constraint enforces "no two
// presets with the same name for one user" at the DB level, so a
// concurrent double-create can't slip through the validate-then-insert
// race in the route handler.
export const filterPresets = pgTable(
  "filter_presets",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    filters: jsonb("filters").notNull().$type<FilterPresetShape>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    perUserNameUnique: uniqueIndex("filter_presets_user_name_unique").on(
      t.userId,
      t.name,
    ),
  }),
);

export type FilterPresetShape = {
  mode: "beginner" | "pro" | "";
  instruments: string[];
  timeframes: string[];
  from: string;
  to: string;
  q: string;
};

// Per-user instrument watchlist (task #109). One row per starred
// instrument; uniqueness is enforced at the DB level so a double-tap
// on the star button can't create duplicates. Read by the "My
// Watchlist" dashboard section, which joins each row to live quotes
// + the user's most recent analysis for that instrument.
export const watchlistItems = pgTable(
  "watchlist_items",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    instrument: text("instrument").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userInstrumentUnique: uniqueIndex("watchlist_items_user_instrument_unique").on(
      t.userId,
      t.instrument,
    ),
  }),
);

// User-defined standalone price alerts (task #148). Unlike `priceAlerts`
// above (which is tied to AI-generated entry/SL/TP levels on a specific
// analysis), each row here represents a manual "ping me when EUR/USD
// crosses 1.0900 from below" request the user typed in themselves. The
// background checker in `user-price-alerts.ts` compares the live tick
// against `targetPrice` and `lastSeenPrice` — only fires on an actual
// *crossing* between the two ticks, so an alert created with the price
// already above its `above`-target does NOT fire on the very next poll.
// One-shot: once fired (or deleted) the row's `status` flips and it is
// excluded from the watcher loop forever.
export const userAlertStatusEnum = pgEnum("user_alert_status", [
  "active",
  "triggered",
  "cancelled",
]);

export const userPriceAlerts = pgTable("user_price_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  instrument: text("instrument").notNull(),
  // Stored as text to preserve the exact precision the user typed (e.g.
  // "1.08573") without falling into numeric/float rounding — parsed back
  // to a Number in the watcher.
  targetPrice: text("target_price").notNull(),
  triggerDirection: alertDirectionEnum("trigger_direction").notNull(),
  // Optional one-line user note ("EUR/USD breakout above 1.09").
  note: text("note"),
  // UI language at create time ("en" / "id") — used by the push
  // dispatcher so the OS notification is rendered in the language the
  // user was using when they set the alert. Defaults "en" for safety.
  lang: text("lang").notNull().default("en"),
  status: userAlertStatusEnum("status").notNull().default("active"),
  // Spot price last seen by the checker (or at create time). The
  // watcher only fires when the previous tick was on the *wrong* side
  // of the target and the current tick is on the right side — this is
  // the anti-false-fire guard that keeps "above 1.09" from triggering
  // immediately for a user who set it while EUR/USD was already at 1.10.
  lastSeenPrice: text("last_seen_price"),
  triggeredAt: timestamp("triggered_at"),
  triggeredPrice: text("triggered_price"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Manual post-trade journal entries (task #161). Each row is a user-
// reported log of an actual trade they took (or chose to pass on),
// optionally linked back to the AI analysis that informed it. Keys on
// `userId` + nullable `analysisId` (one analysis can spawn multiple
// journal entries, e.g. a partial scale-out). Prices/PnL are stored as
// text to preserve the exact precision the user typed (mirrors the
// `user_price_alerts.target_price` convention). The note body is
// private and never fed into any AI prompt.
export const tradeSideEnum = pgEnum("trade_side", ["buy", "sell"]);
export const tradeOutcomeEnum = pgEnum("trade_outcome", [
  "win",
  "loss",
  "breakeven",
  "open",
  "skipped",
]);

export const tradeJournal = pgTable("trade_journal", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Nullable: users can journal a trade with no AI analysis behind it
  // ("walked into something on the chart"). When the source analysis
  // is later deleted we keep the row but null the FK — the trade still
  // happened.
  analysisId: integer("analysis_id").references(() => analyses.id, {
    onDelete: "set null",
  }),
  instrument: text("instrument").notNull(),
  side: tradeSideEnum("side").notNull(),
  // Numeric strings — kept verbatim (no float rounding). Entry is
  // required when `tookTrade` is true; exit/pnl are populated once the
  // trade is closed. For `tookTrade=false` (skipped) the user logs only
  // an outcome of "skipped" + reason in the note.
  entryPrice: text("entry_price"),
  exitPrice: text("exit_price"),
  quantity: text("quantity"),
  pnlAmount: text("pnl_amount"),
  pnlPercent: text("pnl_percent"),
  outcome: tradeOutcomeEnum("outcome").notNull().default("open"),
  // Free-form mood tag (e.g. "confident", "fomo", "revenge"). Loose
  // string so the UI can present a recommended chip set without locking
  // the schema. Capped server-side.
  mood: text("mood"),
  note: text("note"),
  // When the trade was opened (user-provided; defaults to createdAt on
  // insert). Used by the session-tag derivation in the stats endpoint
  // so "best session" reflects when the user *traded*, not when they
  // happened to log it later in the evening.
  tradedAt: timestamp("traded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const broadcasts = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  audienceType: audienceTypeEnum("audience_type").notNull(),
  audienceValue: text("audience_value"),
  recipientCount: integer("recipient_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type UserTag = typeof userTags.$inferSelect;
export type Broadcast = typeof broadcasts.$inferSelect;
export type NewBroadcast = typeof broadcasts.$inferInsert;
export type OutboundClick = typeof outboundClicks.$inferSelect;
export type NewOutboundClick = typeof outboundClicks.$inferInsert;
export type PriceAlert = typeof priceAlerts.$inferSelect;
export type NewPriceAlert = typeof priceAlerts.$inferInsert;
export type DailyDigest = typeof dailyDigests.$inferSelect;
export type NewDailyDigest = typeof dailyDigests.$inferInsert;
export type FilterPreset = typeof filterPresets.$inferSelect;
export type NewFilterPreset = typeof filterPresets.$inferInsert;
export type UserPriceAlert = typeof userPriceAlerts.$inferSelect;
export type NewUserPriceAlert = typeof userPriceAlerts.$inferInsert;
export type TradeJournalEntry = typeof tradeJournal.$inferSelect;
export type NewTradeJournalEntry = typeof tradeJournal.$inferInsert;

// Anti-pattern guardrail telemetry (task #163). One row each time a
// soft warning is shown to the user. `proceeded` flips to true if the
// user pressed "Analyse anyway" after seeing the warning; null/false
// means the warning was shown and either dismissed or the page
// unmounted before they clicked through. Feeds the Mirror digest
// (task #162) and the personal-analytics page.
export const guardrailKindEnum = pgEnum("guardrail_kind", [
  "revenge",
  "overtrading",
  "high_risk_window",
  "unusual_hour",
  "cooling_off",
]);

export const guardrailEvents = pgTable("guardrail_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: guardrailKindEnum("kind").notNull(),
  instrument: text("instrument"),
  firedAt: timestamp("fired_at").notNull().defaultNow(),
  proceeded: boolean("proceeded").notNull().default(false),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
});

export type GuardrailEvent = typeof guardrailEvents.$inferSelect;
export type NewGuardrailEvent = typeof guardrailEvents.$inferInsert;
