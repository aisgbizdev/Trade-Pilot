import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for FundamentalCitations
void main() {
  final instance = FundamentalCitationsBuilder();
  // TODO add properties to the builder and call build()

  group(FundamentalCitations, () {
    // News headlines the AI cited (matched against the snapshot in fundamentalContext.newsItems).
    // BuiltList<String> newsTitles
    test('to test the property `newsTitles`', () async {
      // TODO
    });

    // Calendar event names the AI cited (matched against the snapshot in fundamentalContext.calendarEvents).
    // BuiltList<String> calendarEvents
    test('to test the property `calendarEvents`', () async {
      // TODO
    });

  });
}
