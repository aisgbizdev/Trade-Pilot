import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for DokuCheckoutSession
void main() {
  final instance = DokuCheckoutSessionBuilder();
  // TODO add properties to the builder and call build()

  group(DokuCheckoutSession, () {
    // The credit_topup_requests row id (poll via GET /topups/doku/{id}/status).
    // int id
    test('to test the property `id`', () async {
      // TODO
    });

    // DOKU's hosted checkout page — redirect the browser here.
    // String paymentUrl
    test('to test the property `paymentUrl`', () async {
      // TODO
    });

    // DateTime expiresAt
    test('to test the property `expiresAt`', () async {
      // TODO
    });

  });
}
