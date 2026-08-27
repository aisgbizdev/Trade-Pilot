// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'serializers.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

Serializers _$serializers = (Serializers().toBuilder()
      ..add(AddUserTagBody.serializer)
      ..add(AddWatchlistBody.serializer)
      ..add(AdminFeedbackList.serializer)
      ..add(AdminFeedbackRow.serializer)
      ..add(AdminFeedbackRowFeedbackTypeEnum.serializer)
      ..add(AdminFeedbackRowOutcomeEnum.serializer)
      ..add(AdminStats.serializer)
      ..add(AdminStatsModeBreakdown.serializer)
      ..add(AlertLevelRow.serializer)
      ..add(AlertLevelRowDirectionEnum.serializer)
      ..add(AlertLevelRowLevelEnum.serializer)
      ..add(AlertLevelRowSideEnum.serializer)
      ..add(AlertStatus.serializer)
      ..add(AnalysesList.serializer)
      ..add(AnalysesSummary.serializer)
      ..add(Analysis.serializer)
      ..add(AnalysisModeEnum.serializer)
      ..add(AnalysisNoteResponse.serializer)
      ..add(AnalysisOutcomeStatusEnum.serializer)
      ..add(AnalysisOutcomesSummary.serializer)
      ..add(AnalysisQuota.serializer)
      ..add(AnalysisQuotaHourly.serializer)
      ..add(AnalyticsEventBody.serializer)
      ..add(AnalyticsEventBodyEventTypeEnum.serializer)
      ..add(AnalyticsTokenStats.serializer)
      ..add(AnalyticsTokenStatsByInstrumentInner.serializer)
      ..add(AnalyticsTokenStatsByModelInner.serializer)
      ..add(AnalyticsTokenStatsDailyTokensInner.serializer)
      ..add(AnalyticsTokenStatsTopUsersInner.serializer)
      ..add(AnalyticsTokenStatsTotals.serializer)
      ..add(AnalyticsUsageStats.serializer)
      ..add(AnalyticsUsageStatsBrowserBreakdownInner.serializer)
      ..add(AnalyticsUsageStatsCountryBreakdownInner.serializer)
      ..add(AnalyticsUsageStatsDailyActivityInner.serializer)
      ..add(AnalyticsUsageStatsDeviceBreakdownInner.serializer)
      ..add(AnalyticsUsageStatsFeatureBreakdownInner.serializer)
      ..add(AuthResponse.serializer)
      ..add(Broadcast.serializer)
      ..add(BroadcastAudienceTypeEnum.serializer)
      ..add(BroadcastNotificationBody.serializer)
      ..add(BroadcastNotificationBodyAudienceTypeEnum.serializer)
      ..add(BroadcastNotificationBodyTargetRoleEnum.serializer)
      ..add(BroadcastNotificationBodyTypeEnum.serializer)
      ..add(BroadcastSendResult.serializer)
      ..add(BroadcastsList.serializer)
      ..add(ChangePasswordBody.serializer)
      ..add(ChangeSecurityQuestionBody.serializer)
      ..add(CreateAnalysisBody.serializer)
      ..add(CreateAnalysisBodyModeEnum.serializer)
      ..add(CreateAnalysisBodyTimeframeEnum.serializer)
      ..add(CreateFilterPresetBody.serializer)
      ..add(CreateJournalEntryBody.serializer)
      ..add(CreateJournalEntryBodyEntryPrice.serializer)
      ..add(CreateJournalEntryBodyOutcomeEnum.serializer)
      ..add(CreateJournalEntryBodySideEnum.serializer)
      ..add(CreateUserBody.serializer)
      ..add(CreateUserBodyRoleEnum.serializer)
      ..add(CreateUserPriceAlertBody.serializer)
      ..add(CreateUserPriceAlertBodyLangEnum.serializer)
      ..add(CreateUserPriceAlertBodyTriggerDirectionEnum.serializer)
      ..add(DailySummaryAnalysis.serializer)
      ..add(DailySummaryResponse.serializer)
      ..add(DailySummarySettings.serializer)
      ..add(DailySummarySettingsUpdate.serializer)
      ..add(DailySummaryToday.serializer)
      ..add(DailySummaryTodayKindEnum.serializer)
      ..add(DeleteAccountBody.serializer)
      ..add(ErrorResponse.serializer)
      ..add(Feedback.serializer)
      ..add(FeedbackBody.serializer)
      ..add(FeedbackBodyFeedbackTypeEnum.serializer)
      ..add(FeedbackBodyOutcomeEnum.serializer)
      ..add(FeedbackFeedbackTypeEnum.serializer)
      ..add(FeedbackList.serializer)
      ..add(FeedbackOutcomeEnum.serializer)
      ..add(FeedbackWithDetails.serializer)
      ..add(FeedbackWithDetailsFeedbackTypeEnum.serializer)
      ..add(FeedbackWithDetailsOutcomeEnum.serializer)
      ..add(FilterPreset.serializer)
      ..add(FilterPresetFilters.serializer)
      ..add(FilterPresetFiltersModeEnum.serializer)
      ..add(FilterPresetList.serializer)
      ..add(ForgotPasswordQuestionBody.serializer)
      ..add(FundamentalCalendarEvent.serializer)
      ..add(FundamentalCitations.serializer)
      ..add(FundamentalContext.serializer)
      ..add(FundamentalDrift.serializer)
      ..add(FundamentalDriftCitation.serializer)
      ..add(FundamentalDriftCitationKindEnum.serializer)
      ..add(FundamentalNewsItem.serializer)
      ..add(HealthStatus.serializer)
      ..add(JournalEntry.serializer)
      ..add(JournalEntryList.serializer)
      ..add(JournalEntryOutcomeEnum.serializer)
      ..add(JournalEntrySideEnum.serializer)
      ..add(JournalGroupStat.serializer)
      ..add(JournalSentiment.serializer)
      ..add(JournalStats.serializer)
      ..add(JournalStatsTotals.serializer)
      ..add(LoginBody.serializer)
      ..add(MessageResponse.serializer)
      ..add(MirrorGatedInsight.serializer)
      ..add(MirrorGatedInsightReasonEnum.serializer)
      ..add(MirrorGroupStat.serializer)
      ..add(NativePushRegisterBody.serializer)
      ..add(NativePushRegisterBodyPlatformEnum.serializer)
      ..add(NativePushUnregisterBody.serializer)
      ..add(Notification.serializer)
      ..add(NotificationActionTypeEnum.serializer)
      ..add(NotificationTypeEnum.serializer)
      ..add(NotificationsList.serializer)
      ..add(OutboundClickBody.serializer)
      ..add(OutboundClickBodyLangEnum.serializer)
      ..add(OutboundClickBodyPlacementEnum.serializer)
      ..add(OutboundClickBodyTargetEnum.serializer)
      ..add(OutboundClickStats.serializer)
      ..add(OutboundClickStatsByPlacementInner.serializer)
      ..add(OutboundClickStatsByTargetInner.serializer)
      ..add(PerformanceBanner.serializer)
      ..add(PerformanceBannerSeverityEnum.serializer)
      ..add(PerformanceBucket.serializer)
      ..add(PerformanceMinSamples.serializer)
      ..add(PerformanceOverall.serializer)
      ..add(PerformanceSegment.serializer)
      ..add(PerformanceSummary.serializer)
      ..add(PerformanceSummaryWindowDaysEnum.serializer)
      ..add(PersonalAnalytics.serializer)
      ..add(PersonalAnalyticsTopInstrumentsInner.serializer)
      ..add(PersonalAnalyticsWeeklyDataInner.serializer)
      ..add(PushPrefs.serializer)
      ..add(PushPrefsMarketOpenSessionsEnum.serializer)
      ..add(PushPrefsUpdate.serializer)
      ..add(PushPrefsUpdateMarketOpenSessionsEnum.serializer)
      ..add(PushPublicKey.serializer)
      ..add(PushSubscriptionBody.serializer)
      ..add(PushSubscriptionKeys.serializer)
      ..add(PushSubscriptionStatus.serializer)
      ..add(PushTestResult.serializer)
      ..add(PushUnsubscribeBody.serializer)
      ..add(RecentInstruments.serializer)
      ..add(RecentInstrumentsInstrumentsInner.serializer)
      ..add(RefreshFundamentalsResponse.serializer)
      ..add(RegisterBody.serializer)
      ..add(RegisterBodySelectedModeEnum.serializer)
      ..add(RenameFilterPresetBody.serializer)
      ..add(ResetPasswordBody.serializer)
      ..add(ResetTokenResponse.serializer)
      ..add(ResetUserPasswordBody.serializer)
      ..add(SecurityQuestionResponse.serializer)
      ..add(SetAnalysisNoteRequest.serializer)
      ..add(StandardTradingRuleAccount.serializer)
      ..add(StandardTradingRuleInstrument.serializer)
      ..add(StandardTradingRuleInstrumentCodeEnum.serializer)
      ..add(StandardTradingRuleInstrumentContractUnitEnum.serializer)
      ..add(StandardTradingRuleInstrumentTradingHours.serializer)
      ..add(StandardTradingRuleText.serializer)
      ..add(StandardTradingRules.serializer)
      ..add(StandardTradingRulesFixedRate.serializer)
      ..add(TagsList.serializer)
      ..add(TradePlan.serializer)
      ..add(TradePlanPreferredSideEnum.serializer)
      ..add(TradeSide.serializer)
      ..add(TraderMirrorHighlight.serializer)
      ..add(TraderMirrorInsights.serializer)
      ..add(TraderMirrorResponse.serializer)
      ..add(UpdateJournalEntryBody.serializer)
      ..add(UpdateJournalEntryBodyOutcomeEnum.serializer)
      ..add(UpdateJournalEntryBodySideEnum.serializer)
      ..add(UpdateProfileBody.serializer)
      ..add(UpdateProfileBodyLangEnum.serializer)
      ..add(UpdateProfileBodySelectedModeEnum.serializer)
      ..add(UpdateProfileBodyThemePreferenceEnum.serializer)
      ..add(UpdateUserQuotaBody.serializer)
      ..add(UpdateUserRoleBody.serializer)
      ..add(UpdateUserRoleBodyRoleEnum.serializer)
      ..add(UploadUrlRequest.serializer)
      ..add(UploadUrlResponse.serializer)
      ..add(User.serializer)
      ..add(UserPriceAlert.serializer)
      ..add(UserPriceAlertList.serializer)
      ..add(UserPriceAlertStatusEnum.serializer)
      ..add(UserPriceAlertTriggerDirectionEnum.serializer)
      ..add(UserQuota.serializer)
      ..add(UserRoleEnum.serializer)
      ..add(UserSelectedModeEnum.serializer)
      ..add(UserThemePreferenceEnum.serializer)
      ..add(UserWithStats.serializer)
      ..add(UserWithStatsRoleEnum.serializer)
      ..add(UserWithStatsSelectedModeEnum.serializer)
      ..add(UsersList.serializer)
      ..add(VerifySecurityAnswerBody.serializer)
      ..add(Watchlist.serializer)
      ..add(WatchlistItem.serializer)
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(AdminFeedbackRow)]),
          () => ListBuilder<AdminFeedbackRow>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(AlertLevelRow)]),
          () => ListBuilder<AlertLevelRow>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Analysis)]),
          () => ListBuilder<Analysis>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Analysis)]),
          () => ListBuilder<Analysis>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsTokenStatsDailyTokensInner)]),
          () => ListBuilder<AnalyticsTokenStatsDailyTokensInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsTokenStatsByModelInner)]),
          () => ListBuilder<AnalyticsTokenStatsByModelInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsTokenStatsByInstrumentInner)]),
          () => ListBuilder<AnalyticsTokenStatsByInstrumentInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsTokenStatsTopUsersInner)]),
          () => ListBuilder<AnalyticsTokenStatsTopUsersInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsUsageStatsDailyActivityInner)]),
          () => ListBuilder<AnalyticsUsageStatsDailyActivityInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsUsageStatsFeatureBreakdownInner)]),
          () => ListBuilder<AnalyticsUsageStatsFeatureBreakdownInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsUsageStatsDeviceBreakdownInner)]),
          () => ListBuilder<AnalyticsUsageStatsDeviceBreakdownInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsUsageStatsBrowserBreakdownInner)]),
          () => ListBuilder<AnalyticsUsageStatsBrowserBreakdownInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(AnalyticsUsageStatsCountryBreakdownInner)]),
          () => ListBuilder<AnalyticsUsageStatsCountryBreakdownInner>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Broadcast)]),
          () => ListBuilder<Broadcast>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(FeedbackWithDetails)]),
          () => ListBuilder<FeedbackWithDetails>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(FilterPreset)]),
          () => ListBuilder<FilterPreset>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(FundamentalDriftCitation)]),
          () => ListBuilder<FundamentalDriftCitation>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(FundamentalNewsItem)]),
          () => ListBuilder<FundamentalNewsItem>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(FundamentalCalendarEvent)]),
          () => ListBuilder<FundamentalCalendarEvent>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JournalEntry)]),
          () => ListBuilder<JournalEntry>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Notification)]),
          () => ListBuilder<Notification>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(OutboundClickStatsByPlacementInner)]),
          () => ListBuilder<OutboundClickStatsByPlacementInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(OutboundClickStatsByTargetInner)]),
          () => ListBuilder<OutboundClickStatsByTargetInner>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(PerformanceBucket)]),
          () => ListBuilder<PerformanceBucket>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(PersonalAnalyticsTopInstrumentsInner)]),
          () => ListBuilder<PersonalAnalyticsTopInstrumentsInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(PersonalAnalyticsTopInstrumentsInner)]),
          () => ListBuilder<PersonalAnalyticsTopInstrumentsInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(PersonalAnalyticsWeeklyDataInner)]),
          () => ListBuilder<PersonalAnalyticsWeeklyDataInner>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(PushPrefsMarketOpenSessionsEnum)]),
          () => ListBuilder<PushPrefsMarketOpenSessionsEnum>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(PushPrefsUpdateMarketOpenSessionsEnum)]),
          () => ListBuilder<PushPrefsUpdateMarketOpenSessionsEnum>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(RecentInstrumentsInstrumentsInner)]),
          () => ListBuilder<RecentInstrumentsInstrumentsInner>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(StandardTradingRuleInstrument)]),
          () => ListBuilder<StandardTradingRuleInstrument>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(DailySummaryAnalysis)]),
          () => ListBuilder<DailySummaryAnalysis>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(TraderMirrorHighlight)]),
          () => ListBuilder<TraderMirrorHighlight>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(UserPriceAlert)]),
          () => ListBuilder<UserPriceAlert>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(UserWithStats)]),
          () => ListBuilder<UserWithStats>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(WatchlistItem)]),
          () => ListBuilder<WatchlistItem>())
      ..addBuilderFactory(
          const FullType(BuiltMap, const [
            const FullType(String),
            const FullType.nullable(JsonObject)
          ]),
          () => MapBuilder<String, JsonObject?>())
      ..addBuilderFactory(
          const FullType(BuiltMap, const [
            const FullType(String),
            const FullType.nullable(JsonObject)
          ]),
          () => MapBuilder<String, JsonObject?>()))
    .build();

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
