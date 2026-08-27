import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for AnalysisOutcomesSummary
void main() {
  final instance = AnalysisOutcomesSummaryBuilder();
  // TODO add properties to the builder and call build()

  group(AnalysisOutcomesSummary, () {
    // int rangeDays
    test('to test the property `rangeDays`', () async {
      // TODO
    });

    // int total
    test('to test the property `total`', () async {
      // TODO
    });

    // int pending
    test('to test the property `pending`', () async {
      // TODO
    });

    // int tp1Hit
    test('to test the property `tp1Hit`', () async {
      // TODO
    });

    // int tp2Hit
    test('to test the property `tp2Hit`', () async {
      // TODO
    });

    // int slHit
    test('to test the property `slHit`', () async {
      // TODO
    });

    // int expired
    test('to test the property `expired`', () async {
      // TODO
    });

    // int invalidated
    test('to test the property `invalidated`', () async {
      // TODO
    });

    // Denominator used for tpHitRate / slHitRate. Equals tp1Hit + tp2Hit + slHit + expired (excludes pending and invalidated).
    // int scored
    test('to test the property `scored`', () async {
      // TODO
    });

    // (tp1Hit + tp2Hit) / scored. Null when scored == 0.
    // num tpHitRate
    test('to test the property `tpHitRate`', () async {
      // TODO
    });

    // slHit / scored. Null when scored == 0.
    // num slHitRate
    test('to test the property `slHitRate`', () async {
      // TODO
    });

  });
}
