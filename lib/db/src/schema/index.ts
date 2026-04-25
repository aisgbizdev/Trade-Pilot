import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
