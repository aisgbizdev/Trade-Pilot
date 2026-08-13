import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for AlertLevelRow
void main() {
  final instance = AlertLevelRowBuilder();
  // TODO add properties to the builder and call build()

  group(AlertLevelRow, () {
    // String level
    test('to test the property `level`', () async {
      // TODO
    });

    // String side
    test('to test the property `side`', () async {
      // TODO
    });

    // AI-generated level price, stored verbatim for precision.
    // String price
    test('to test the property `price`', () async {
      // TODO
    });

    // Which way price must move from the spot at arm time to fire the alert. `above` = fire when live ≥ price; `below` = fire when live ≤ price. 
    // String direction
    test('to test the property `direction`', () async {
      // TODO
    });

    // DateTime triggeredAt
    test('to test the property `triggeredAt`', () async {
      // TODO
    });

    // Live price the watcher saw when it fired the alert.
    // String triggeredPrice
    test('to test the property `triggeredPrice`', () async {
      // TODO
    });

    // DateTime cancelledAt
    test('to test the property `cancelledAt`', () async {
      // TODO
    });

  });
}
