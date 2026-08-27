import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for JournalSentiment
void main() {
  final instance = JournalSentimentBuilder();
  // TODO add properties to the builder and call build()

  group(JournalSentiment, () {
    // String instrument
    test('to test the property `instrument`', () async {
      // TODO
    });

    // int windowDays
    test('to test the property `windowDays`', () async {
      // TODO
    });

    // int minSampleSize
    test('to test the property `minSampleSize`', () async {
      // TODO
    });

    // int minDistinctTraders
    test('to test the property `minDistinctTraders`', () async {
      // TODO
    });

    // Number of directional (buy/sell) entries in the window. Null when `gated` is true (suppressed to prevent membership inference on thin instruments).
    // int sampleSize
    test('to test the property `sampleSize`', () async {
      // TODO
    });

    // Number of distinct user IDs contributing entries. Null when `gated` is true.
    // int distinctTraders
    test('to test the property `distinctTraders`', () async {
      // TODO
    });

    // True when sample is below thresholds; percentages, sampleSize, and distinctTraders are all null.
    // bool gated
    test('to test the property `gated`', () async {
      // TODO
    });

    // int buyPct
    test('to test the property `buyPct`', () async {
      // TODO
    });

    // int sellPct
    test('to test the property `sellPct`', () async {
      // TODO
    });

  });
}
