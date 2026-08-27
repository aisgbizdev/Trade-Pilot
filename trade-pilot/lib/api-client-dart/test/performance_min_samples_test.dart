import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for PerformanceMinSamples
void main() {
  final instance = PerformanceMinSamplesBuilder();
  // TODO add properties to the builder and call build()

  group(PerformanceMinSamples, () {
    // Minimum resolved analyses per bucket before that bucket renders.
    // int bucket
    test('to test the property `bucket`', () async {
      // TODO
    });

    // Minimum resolved analyses overall before any segment renders.
    // int overall
    test('to test the property `overall`', () async {
      // TODO
    });

    // Minimum resolved analyses in the recent window before the current-state banner makes a claim.
    // int banner
    test('to test the property `banner`', () async {
      // TODO
    });

  });
}
