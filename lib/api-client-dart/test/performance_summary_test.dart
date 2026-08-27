import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for PerformanceSummary
void main() {
  final instance = PerformanceSummaryBuilder();
  // TODO add properties to the builder and call build()

  group(PerformanceSummary, () {
    // int windowDays
    test('to test the property `windowDays`', () async {
      // TODO
    });

    // DateTime generatedAt
    test('to test the property `generatedAt`', () async {
      // TODO
    });

    // DateTime windowStart
    test('to test the property `windowStart`', () async {
      // TODO
    });

    // PerformanceMinSamples minSamples
    test('to test the property `minSamples`', () async {
      // TODO
    });

    // PerformanceOverall overall
    test('to test the property `overall`', () async {
      // TODO
    });

    // PerformanceBanner banner
    test('to test the property `banner`', () async {
      // TODO
    });

    // PerformanceSegment byInstrument
    test('to test the property `byInstrument`', () async {
      // TODO
    });

    // PerformanceSegment bySession
    test('to test the property `bySession`', () async {
      // TODO
    });

    // PerformanceSegment byCondition
    test('to test the property `byCondition`', () async {
      // TODO
    });

    // Deterministic regime classification derived from the stored indicator tally (trending / ranging / choppy). Replaces ADX where raw OHLC isn't kept per analysis.
    // PerformanceSegment byVolatility
    test('to test the property `byVolatility`', () async {
      // TODO
    });

    // news_week vs quiet_week, derived from whether the AI's fundamental snapshot included any high-impact calendar event at analysis time.
    // PerformanceSegment byNewsActivity
    test('to test the property `byNewsActivity`', () async {
      // TODO
    });

  });
}
