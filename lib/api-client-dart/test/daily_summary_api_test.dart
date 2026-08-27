import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for DailySummaryApi
void main() {
  final instance = TradePilotApiClient().getDailySummaryApi();

  group(DailySummaryApi, () {
    // Get current user's daily summary settings + today's digest
    //
    //Future<DailySummaryResponse> getDailySummary() async
    test('test getDailySummary', () async {
      // TODO
    });

    // Update daily summary settings (enabled, time, timezone)
    //
    //Future<DailySummarySettings> updateDailySummarySettings(DailySummarySettingsUpdate dailySummarySettingsUpdate) async
    test('test updateDailySummarySettings', () async {
      // TODO
    });

  });
}
