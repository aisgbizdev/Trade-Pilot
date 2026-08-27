import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for BroadcastNotificationBody
void main() {
  final instance = BroadcastNotificationBodyBuilder();
  // TODO add properties to the builder and call build()

  group(BroadcastNotificationBody, () {
    // String title
    test('to test the property `title`', () async {
      // TODO
    });

    // String message
    test('to test the property `message`', () async {
      // TODO
    });

    // String type (default value: 'info')
    test('to test the property `type`', () async {
      // TODO
    });

    // String audienceType (default value: 'all')
    test('to test the property `audienceType`', () async {
      // TODO
    });

    // Role name when audienceType=role; tag name when audienceType=tag
    // String audienceValue
    test('to test the property `audienceValue`', () async {
      // TODO
    });

    // Deprecated: use audienceType=role + audienceValue instead
    // String targetRole
    test('to test the property `targetRole`', () async {
      // TODO
    });

  });
}
