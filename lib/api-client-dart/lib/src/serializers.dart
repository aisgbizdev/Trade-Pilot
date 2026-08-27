//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_import

import 'package:one_of_serializer/any_of_serializer.dart';
import 'package:one_of_serializer/one_of_serializer.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/serializer.dart';
import 'package:built_value/standard_json_plugin.dart';
import 'package:built_value/iso_8601_date_time_serializer.dart';
import 'package:trade_pilot_api_client/src/date_serializer.dart';
import 'package:trade_pilot_api_client/src/model/date.dart';

import 'package:trade_pilot_api_client/src/model/add_user_tag_body.dart';
import 'package:trade_pilot_api_client/src/model/add_watchlist_body.dart';
import 'package:trade_pilot_api_client/src/model/admin_feedback_list.dart';
import 'package:trade_pilot_api_client/src/model/admin_feedback_row.dart';
import 'package:trade_pilot_api_client/src/model/admin_stats.dart';
import 'package:trade_pilot_api_client/src/model/admin_stats_mode_breakdown.dart';
import 'package:trade_pilot_api_client/src/model/alert_level_row.dart';
import 'package:trade_pilot_api_client/src/model/alert_status.dart';
import 'package:trade_pilot_api_client/src/model/analyses_list.dart';
import 'package:trade_pilot_api_client/src/model/analyses_summary.dart';
import 'package:trade_pilot_api_client/src/model/analysis.dart';
import 'package:trade_pilot_api_client/src/model/analysis_note_response.dart';
import 'package:trade_pilot_api_client/src/model/analysis_outcomes_summary.dart';
import 'package:trade_pilot_api_client/src/model/analysis_quota.dart';
import 'package:trade_pilot_api_client/src/model/analysis_quota_hourly.dart';
import 'package:trade_pilot_api_client/src/model/analytics_event_body.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_by_instrument_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_by_model_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_daily_tokens_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_top_users_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_token_stats_totals.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_browser_breakdown_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_country_breakdown_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_daily_activity_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_device_breakdown_inner.dart';
import 'package:trade_pilot_api_client/src/model/analytics_usage_stats_feature_breakdown_inner.dart';
import 'package:trade_pilot_api_client/src/model/auth_response.dart';
import 'package:trade_pilot_api_client/src/model/broadcast.dart';
import 'package:trade_pilot_api_client/src/model/broadcast_notification_body.dart';
import 'package:trade_pilot_api_client/src/model/broadcast_send_result.dart';
import 'package:trade_pilot_api_client/src/model/broadcasts_list.dart';
import 'package:trade_pilot_api_client/src/model/change_password_body.dart';
import 'package:trade_pilot_api_client/src/model/change_security_question_body.dart';
import 'package:trade_pilot_api_client/src/model/create_analysis_body.dart';
import 'package:trade_pilot_api_client/src/model/create_filter_preset_body.dart';
import 'package:trade_pilot_api_client/src/model/create_journal_entry_body.dart';
import 'package:trade_pilot_api_client/src/model/create_journal_entry_body_entry_price.dart';
import 'package:trade_pilot_api_client/src/model/create_user_body.dart';
import 'package:trade_pilot_api_client/src/model/create_user_price_alert_body.dart';
import 'package:trade_pilot_api_client/src/model/daily_summary_analysis.dart';
import 'package:trade_pilot_api_client/src/model/daily_summary_response.dart';
import 'package:trade_pilot_api_client/src/model/daily_summary_settings.dart';
import 'package:trade_pilot_api_client/src/model/daily_summary_settings_update.dart';
import 'package:trade_pilot_api_client/src/model/daily_summary_today.dart';
import 'package:trade_pilot_api_client/src/model/delete_account_body.dart';
import 'package:trade_pilot_api_client/src/model/error_response.dart';
import 'package:trade_pilot_api_client/src/model/feedback.dart';
import 'package:trade_pilot_api_client/src/model/feedback_body.dart';
import 'package:trade_pilot_api_client/src/model/feedback_list.dart';
import 'package:trade_pilot_api_client/src/model/feedback_with_details.dart';
import 'package:trade_pilot_api_client/src/model/filter_preset.dart';
import 'package:trade_pilot_api_client/src/model/filter_preset_filters.dart';
import 'package:trade_pilot_api_client/src/model/filter_preset_list.dart';
import 'package:trade_pilot_api_client/src/model/forgot_password_question_body.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_calendar_event.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_citations.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_context.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_drift.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_drift_citation.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_news_item.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_news_source.dart';
import 'package:trade_pilot_api_client/src/model/health_status.dart';
import 'package:trade_pilot_api_client/src/model/journal_entry.dart';
import 'package:trade_pilot_api_client/src/model/journal_entry_list.dart';
import 'package:trade_pilot_api_client/src/model/journal_group_stat.dart';
import 'package:trade_pilot_api_client/src/model/journal_sentiment.dart';
import 'package:trade_pilot_api_client/src/model/journal_stats.dart';
import 'package:trade_pilot_api_client/src/model/journal_stats_totals.dart';
import 'package:trade_pilot_api_client/src/model/login_body.dart';
import 'package:trade_pilot_api_client/src/model/market_intelligence.dart';
import 'package:trade_pilot_api_client/src/model/market_intelligence_response.dart';
import 'package:trade_pilot_api_client/src/model/market_intelligence_technical.dart';
import 'package:trade_pilot_api_client/src/model/message_response.dart';
import 'package:trade_pilot_api_client/src/model/mirror_gated_insight.dart';
import 'package:trade_pilot_api_client/src/model/mirror_group_stat.dart';
import 'package:trade_pilot_api_client/src/model/native_push_register_body.dart';
import 'package:trade_pilot_api_client/src/model/native_push_unregister_body.dart';
import 'package:trade_pilot_api_client/src/model/notification.dart';
import 'package:trade_pilot_api_client/src/model/notifications_list.dart';
import 'package:trade_pilot_api_client/src/model/outbound_click_body.dart';
import 'package:trade_pilot_api_client/src/model/outbound_click_stats.dart';
import 'package:trade_pilot_api_client/src/model/outbound_click_stats_by_placement_inner.dart';
import 'package:trade_pilot_api_client/src/model/outbound_click_stats_by_target_inner.dart';
import 'package:trade_pilot_api_client/src/model/performance_banner.dart';
import 'package:trade_pilot_api_client/src/model/performance_bucket.dart';
import 'package:trade_pilot_api_client/src/model/performance_min_samples.dart';
import 'package:trade_pilot_api_client/src/model/performance_overall.dart';
import 'package:trade_pilot_api_client/src/model/performance_segment.dart';
import 'package:trade_pilot_api_client/src/model/performance_summary.dart';
import 'package:trade_pilot_api_client/src/model/personal_analytics.dart';
import 'package:trade_pilot_api_client/src/model/personal_analytics_top_instruments_inner.dart';
import 'package:trade_pilot_api_client/src/model/personal_analytics_weekly_data_inner.dart';
import 'package:trade_pilot_api_client/src/model/push_prefs.dart';
import 'package:trade_pilot_api_client/src/model/push_prefs_update.dart';
import 'package:trade_pilot_api_client/src/model/push_public_key.dart';
import 'package:trade_pilot_api_client/src/model/push_subscription_body.dart';
import 'package:trade_pilot_api_client/src/model/push_subscription_keys.dart';
import 'package:trade_pilot_api_client/src/model/push_subscription_status.dart';
import 'package:trade_pilot_api_client/src/model/push_test_result.dart';
import 'package:trade_pilot_api_client/src/model/push_unsubscribe_body.dart';
import 'package:trade_pilot_api_client/src/model/recent_instruments.dart';
import 'package:trade_pilot_api_client/src/model/recent_instruments_instruments_inner.dart';
import 'package:trade_pilot_api_client/src/model/refresh_fundamentals_response.dart';
import 'package:trade_pilot_api_client/src/model/register_body.dart';
import 'package:trade_pilot_api_client/src/model/rename_filter_preset_body.dart';
import 'package:trade_pilot_api_client/src/model/reset_password_body.dart';
import 'package:trade_pilot_api_client/src/model/reset_token_response.dart';
import 'package:trade_pilot_api_client/src/model/reset_user_password_body.dart';
import 'package:trade_pilot_api_client/src/model/security_question_response.dart';
import 'package:trade_pilot_api_client/src/model/set_analysis_note_request.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rule_account.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rule_instrument.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rule_instrument_trading_hours.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rule_text.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rules.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rules_fixed_rate.dart';
import 'package:trade_pilot_api_client/src/model/tags_list.dart';
import 'package:trade_pilot_api_client/src/model/trade_plan.dart';
import 'package:trade_pilot_api_client/src/model/trade_side.dart';
import 'package:trade_pilot_api_client/src/model/trader_mirror_highlight.dart';
import 'package:trade_pilot_api_client/src/model/trader_mirror_insights.dart';
import 'package:trade_pilot_api_client/src/model/trader_mirror_response.dart';
import 'package:trade_pilot_api_client/src/model/update_journal_entry_body.dart';
import 'package:trade_pilot_api_client/src/model/update_profile_body.dart';
import 'package:trade_pilot_api_client/src/model/update_user_quota_body.dart';
import 'package:trade_pilot_api_client/src/model/update_user_role_body.dart';
import 'package:trade_pilot_api_client/src/model/upload_url_request.dart';
import 'package:trade_pilot_api_client/src/model/upload_url_response.dart';
import 'package:trade_pilot_api_client/src/model/user.dart';
import 'package:trade_pilot_api_client/src/model/user_price_alert.dart';
import 'package:trade_pilot_api_client/src/model/user_price_alert_list.dart';
import 'package:trade_pilot_api_client/src/model/user_quota.dart';
import 'package:trade_pilot_api_client/src/model/user_with_stats.dart';
import 'package:trade_pilot_api_client/src/model/users_list.dart';
import 'package:trade_pilot_api_client/src/model/verify_security_answer_body.dart';
import 'package:trade_pilot_api_client/src/model/watchlist.dart';
import 'package:trade_pilot_api_client/src/model/watchlist_item.dart';

part 'serializers.g.dart';

@SerializersFor([
  AddUserTagBody,
  AddWatchlistBody,
  AdminFeedbackList,
  AdminFeedbackRow,
  AdminStats,
  AdminStatsModeBreakdown,
  AlertLevelRow,
  AlertStatus,
  AnalysesList,
  AnalysesSummary,
  Analysis,
  AnalysisNoteResponse,
  AnalysisOutcomesSummary,
  AnalysisQuota,
  AnalysisQuotaHourly,
  AnalyticsEventBody,
  AnalyticsTokenStats,
  AnalyticsTokenStatsByInstrumentInner,
  AnalyticsTokenStatsByModelInner,
  AnalyticsTokenStatsDailyTokensInner,
  AnalyticsTokenStatsTopUsersInner,
  AnalyticsTokenStatsTotals,
  AnalyticsUsageStats,
  AnalyticsUsageStatsBrowserBreakdownInner,
  AnalyticsUsageStatsCountryBreakdownInner,
  AnalyticsUsageStatsDailyActivityInner,
  AnalyticsUsageStatsDeviceBreakdownInner,
  AnalyticsUsageStatsFeatureBreakdownInner,
  AuthResponse,
  Broadcast,
  BroadcastNotificationBody,
  BroadcastSendResult,
  BroadcastsList,
  ChangePasswordBody,
  ChangeSecurityQuestionBody,
  CreateAnalysisBody,
  CreateFilterPresetBody,
  CreateJournalEntryBody,
  CreateJournalEntryBodyEntryPrice,
  CreateUserBody,
  CreateUserPriceAlertBody,
  DailySummaryAnalysis,
  DailySummaryResponse,
  DailySummarySettings,
  DailySummarySettingsUpdate,
  DailySummaryToday,
  DeleteAccountBody,
  ErrorResponse,
  Feedback,
  FeedbackBody,
  FeedbackList,
  FeedbackWithDetails,
  FilterPreset,
  FilterPresetFilters,
  FilterPresetList,
  ForgotPasswordQuestionBody,
  FundamentalCalendarEvent,
  FundamentalCitations,
  FundamentalContext,
  FundamentalDrift,
  FundamentalDriftCitation,
  FundamentalNewsItem,
  FundamentalNewsSource,
  HealthStatus,
  JournalEntry,
  JournalEntryList,
  JournalGroupStat,
  JournalSentiment,
  JournalStats,
  JournalStatsTotals,
  LoginBody,
  MarketIntelligence,
  MarketIntelligenceResponse,
  MarketIntelligenceTechnical,
  MessageResponse,
  MirrorGatedInsight,
  MirrorGroupStat,
  NativePushRegisterBody,
  NativePushUnregisterBody,
  Notification,
  NotificationsList,
  OutboundClickBody,
  OutboundClickStats,
  OutboundClickStatsByPlacementInner,
  OutboundClickStatsByTargetInner,
  PerformanceBanner,
  PerformanceBucket,
  PerformanceMinSamples,
  PerformanceOverall,
  PerformanceSegment,
  PerformanceSummary,
  PersonalAnalytics,
  PersonalAnalyticsTopInstrumentsInner,
  PersonalAnalyticsWeeklyDataInner,
  PushPrefs,
  PushPrefsUpdate,
  PushPublicKey,
  PushSubscriptionBody,
  PushSubscriptionKeys,
  PushSubscriptionStatus,
  PushTestResult,
  PushUnsubscribeBody,
  RecentInstruments,
  RecentInstrumentsInstrumentsInner,
  RefreshFundamentalsResponse,
  RegisterBody,
  RenameFilterPresetBody,
  ResetPasswordBody,
  ResetTokenResponse,
  ResetUserPasswordBody,
  SecurityQuestionResponse,
  SetAnalysisNoteRequest,
  StandardTradingRuleAccount,
  StandardTradingRuleInstrument,
  StandardTradingRuleInstrumentTradingHours,
  StandardTradingRuleText,
  StandardTradingRules,
  StandardTradingRulesFixedRate,
  TagsList,
  TradePlan,
  TradeSide,
  TraderMirrorHighlight,
  TraderMirrorInsights,
  TraderMirrorResponse,
  UpdateJournalEntryBody,
  UpdateProfileBody,
  UpdateUserQuotaBody,
  UpdateUserRoleBody,
  UploadUrlRequest,
  UploadUrlResponse,
  User,
  UserPriceAlert,
  UserPriceAlertList,
  UserQuota,
  UserWithStats,
  UsersList,
  VerifySecurityAnswerBody,
  Watchlist,
  WatchlistItem,
])
Serializers serializers = (_$serializers.toBuilder()
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(WatchlistItem)]),
        () => ListBuilder<WatchlistItem>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(FilterPreset)]),
        () => ListBuilder<FilterPreset>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(OutboundClickStatsByPlacementInner)]),
        () => ListBuilder<OutboundClickStatsByPlacementInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(StandardTradingRuleInstrument)]),
        () => ListBuilder<StandardTradingRuleInstrument>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsUsageStatsDeviceBreakdownInner)]),
        () => ListBuilder<AnalyticsUsageStatsDeviceBreakdownInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(FundamentalCalendarEvent)]),
        () => ListBuilder<FundamentalCalendarEvent>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(Broadcast)]),
        () => ListBuilder<Broadcast>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(FundamentalNewsSource)]),
        () => ListBuilder<FundamentalNewsSource>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(PersonalAnalyticsTopInstrumentsInner)]),
        () => ListBuilder<PersonalAnalyticsTopInstrumentsInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(UserWithStats)]),
        () => ListBuilder<UserWithStats>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsUsageStatsFeatureBreakdownInner)]),
        () => ListBuilder<AnalyticsUsageStatsFeatureBreakdownInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(PerformanceBucket)]),
        () => ListBuilder<PerformanceBucket>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(Analysis)]),
        () => ListBuilder<Analysis>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsTokenStatsByModelInner)]),
        () => ListBuilder<AnalyticsTokenStatsByModelInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsUsageStatsCountryBreakdownInner)]),
        () => ListBuilder<AnalyticsUsageStatsCountryBreakdownInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsTokenStatsDailyTokensInner)]),
        () => ListBuilder<AnalyticsTokenStatsDailyTokensInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsTokenStatsByInstrumentInner)]),
        () => ListBuilder<AnalyticsTokenStatsByInstrumentInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AlertLevelRow)]),
        () => ListBuilder<AlertLevelRow>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsUsageStatsDailyActivityInner)]),
        () => ListBuilder<AnalyticsUsageStatsDailyActivityInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsUsageStatsBrowserBreakdownInner)]),
        () => ListBuilder<AnalyticsUsageStatsBrowserBreakdownInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(RecentInstrumentsInstrumentsInner)]),
        () => ListBuilder<RecentInstrumentsInstrumentsInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(OutboundClickStatsByTargetInner)]),
        () => ListBuilder<OutboundClickStatsByTargetInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(TraderMirrorHighlight)]),
        () => ListBuilder<TraderMirrorHighlight>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(DailySummaryAnalysis)]),
        () => ListBuilder<DailySummaryAnalysis>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(Notification)]),
        () => ListBuilder<Notification>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(JournalEntry)]),
        () => ListBuilder<JournalEntry>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(FeedbackWithDetails)]),
        () => ListBuilder<FeedbackWithDetails>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(UserPriceAlert)]),
        () => ListBuilder<UserPriceAlert>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(PersonalAnalyticsWeeklyDataInner)]),
        () => ListBuilder<PersonalAnalyticsWeeklyDataInner>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(FundamentalNewsItem)]),
        () => ListBuilder<FundamentalNewsItem>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
        () => MapBuilder<String, JsonObject?>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(String)]),
        () => ListBuilder<String>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(FundamentalDriftCitation)]),
        () => ListBuilder<FundamentalDriftCitation>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AdminFeedbackRow)]),
        () => ListBuilder<AdminFeedbackRow>(),
      )
      ..addBuilderFactory(
        const FullType(BuiltList, [FullType(AnalyticsTokenStatsTopUsersInner)]),
        () => ListBuilder<AnalyticsTokenStatsTopUsersInner>(),
      )
      ..add(const OneOfSerializer())
      ..add(const AnyOfSerializer())
      ..add(const DateSerializer())
      ..add(Iso8601DateTimeSerializer())
    ).build();

Serializers standardSerializers =
    (serializers.toBuilder()..addPlugin(StandardJsonPlugin())).build();
