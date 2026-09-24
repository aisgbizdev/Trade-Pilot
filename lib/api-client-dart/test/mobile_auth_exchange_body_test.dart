import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for MobileAuthExchangeBody
void main() {
  final instance = MobileAuthExchangeBodyBuilder();
  // TODO add properties to the builder and call build()

  group(MobileAuthExchangeBody, () {
    // The opaque one-time code from the `code=` param of the id.tradepilot.app://auth/callback deep link.
    // String code
    test('to test the property `code`', () async {
      // TODO
    });

    // The PKCE code_verifier that produced the code_challenge originally sent to the mobile /start endpoint.
    // String codeVerifier
    test('to test the property `codeVerifier`', () async {
      // TODO
    });

  });
}
