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

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  targetRole: roleEnum("target_role"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull().default("info"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
