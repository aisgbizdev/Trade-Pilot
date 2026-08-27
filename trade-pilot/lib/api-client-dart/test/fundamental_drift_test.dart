import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for FundamentalDrift
void main() {
  final instance = FundamentalDriftBuilder();
  // TODO add properties to the builder and call build()

  group(FundamentalDrift, () {
    // Total citations the AI emitted at analysis time (newsTitles + calendarEvents).
    // int totalCitations
    test('to test the property `totalCitations`', () async {
      // TODO
    });

    // Original citations that no longer match any item in the fresh snapshot.
    // BuiltList<FundamentalDriftCitation> missingCitations
    test('to test the property `missingCitations`', () async {
      // TODO
    });

  });
}
