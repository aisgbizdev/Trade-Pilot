import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for NativePushTestResult
void main() {
  final instance = NativePushTestResultBuilder();
  // TODO add properties to the builder and call build()

  group(NativePushTestResult, () {
    // Number of registered mobile device tokens targeted
    // int targeted
    test('to test the property `targeted`', () async {
      // TODO
    });

    // Number of messages accepted by FCM
    // int accepted
    test('to test the property `accepted`', () async {
      // TODO
    });

    // Failure category for each message not accepted by FCM
    // BuiltList<String> failures
    test('to test the property `failures`', () async {
      // TODO
    });

  });
}
