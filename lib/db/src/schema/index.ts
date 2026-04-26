import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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
