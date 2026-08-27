import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for DailySummarySettings
void main() {
  final instance = DailySummarySettingsBuilder();
  // TODO add properties to the builder and call build()

  group(DailySummarySettings, () {
    // bool enabled
    test('to test the property `enabled`', () async {
      // TODO
    });

    // HH:MM 24h local time the digest should fire
    // String time
    test('to test the property `time`', () async {
      // TODO
    });

    // IANA timezone the time is interpreted in
    // String timezone
    test('to test the property `timezone`', () async {
      // TODO
    });

    // bool pushDailySummary
    test('to test the property `pushDailySummary`', () async {
      // TODO
    });

    // YYYY-MM-DD in user's TZ; null if never sent
    // String lastSentDate
    test('to test the property `lastSentDate`', () async {
      // TODO
    });

  });
}
