import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for JournalStats
void main() {
  final instance = JournalStatsBuilder();
  // TODO add properties to the builder and call build()

  group(JournalStats, () {
    // JournalStatsTotals totals
    test('to test the property `totals`', () async {
      // TODO
    });

    // wins / (wins + losses); null when no resolved trades.
    // num winRate
    test('to test the property `winRate`', () async {
      // TODO
    });

    // num avgPnlPercent
    test('to test the property `avgPnlPercent`', () async {
      // TODO
    });

    // num avgPnlAmount
    test('to test the property `avgPnlAmount`', () async {
      // TODO
    });

    // JournalGroupStat bestInstrument
    test('to test the property `bestInstrument`', () async {
      // TODO
    });

    // JournalGroupStat worstInstrument
    test('to test the property `worstInstrument`', () async {
      // TODO
    });

    // JournalGroupStat bestSession
    test('to test the property `bestSession`', () async {
      // TODO
    });

    // JournalGroupStat worstSession
    test('to test the property `worstSession`', () async {
      // TODO
    });

  });
}
