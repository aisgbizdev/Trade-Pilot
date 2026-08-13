import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for PerformanceApi
void main() {
  final instance = TradePilotApiClient().getPerformanceApi();

  group(PerformanceApi, () {
    // Public AI transparency dashboard (task
    //
    // Anonymised, aggregated outcome ledger across every analysis the AI has produced inside the rolling window. No per-user data is included — this is the AI's own track record. Every segment (by instrument, FX session, market condition) is gated by a minimum-sample guardrail so a 3-trade hot streak never reads as a confident win rate. 
    //
    //Future<PerformanceSummary> getPerformanceSummary({ int window }) async
    test('test getPerformanceSummary', () async {
      // TODO
    });

  });
}
