import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for AnalyticsEventBody
void main() {
  final instance = AnalyticsEventBodyBuilder();
  // TODO add properties to the builder and call build()

  group(AnalyticsEventBody, () {
    // Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is
    // String eventType
    test('to test the property `eventType`', () async {
      // TODO
    });

    // Route path at event time (mainly for page_view)
    // String path
    test('to test the property `path`', () async {
      // TODO
    });

    // Small free-form context (e.g. {instrument, timeframe}). Capped server-side to a few KB.
    // BuiltMap<String, JsonObject> metadata
    test('to test the property `metadata`', () async {
      // TODO
    });

  });
}
