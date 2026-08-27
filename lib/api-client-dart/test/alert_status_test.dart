import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for AlertStatus
void main() {
  final instance = AlertStatusBuilder();
  // TODO add properties to the builder and call build()

  group(AlertStatus, () {
    // Convenience flag — true when at least one un-triggered, un-cancelled, in-validity alert exists.
    // bool enabled
    test('to test the property `enabled`', () async {
      // TODO
    });

    // Number of currently armed levels (un-triggered, un-cancelled, in-validity).
    // int armedCount
    test('to test the property `armedCount`', () async {
      // TODO
    });

    // BuiltList<AlertLevelRow> levels
    test('to test the property `levels`', () async {
      // TODO
    });

  });
}
