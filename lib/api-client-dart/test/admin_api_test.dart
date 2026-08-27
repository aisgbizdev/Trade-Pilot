import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for AdminApi
void main() {
  final instance = TradePilotApiClient().getAdminApi();

  group(AdminApi, () {
    // Broadcast notification to selected audience
    //
    //Future<BroadcastSendResult> broadcastNotification(BroadcastNotificationBody broadcastNotificationBody) async
    test('test broadcastNotification', () async {
      // TODO
    });

    // AI (OpenAI) token usage and estimated cost breakdown
    //
    //Future<AnalyticsTokenStats> getAdminAnalyticsTokens({ int days }) async
    test('test getAdminAnalyticsTokens', () async {
      // TODO
    });

    // Feature-usage, device, browser, and country breakdown from analytics events
    //
    //Future<AnalyticsUsageStats> getAdminAnalyticsUsage({ int days }) async
    test('test getAdminAnalyticsUsage', () async {
      // TODO
    });

    // List user feedback rows (admin only)
    //
    //Future<AdminFeedbackList> getAdminFeedback({ int page, int limit, String search, String feedbackType, Date from, Date to, int analysisId }) async
    test('test getAdminFeedback', () async {
      // TODO
    });

    // Get admin statistics
    //
    //Future<AdminStats> getAdminStats() async
    test('test getAdminStats', () async {
      // TODO
    });

    // Get all analyses (admin only)
    //
    //Future<AnalysesList> getAllAnalyses({ int page, int limit }) async
    test('test getAllAnalyses', () async {
      // TODO
    });

    // Broadcast history
    //
    //Future<BroadcastsList> getBroadcasts({ int page, int limit }) async
    test('test getBroadcasts', () async {
      // TODO
    });

    // Aggregated counts of sponsor / partner outbound link clicks
    //
    //Future<OutboundClickStats> getOutboundClickStats({ int days }) async
    test('test getOutboundClickStats', () async {
      // TODO
    });

  });
}
