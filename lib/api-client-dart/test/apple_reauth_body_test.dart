import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for AppleReauthBody
void main() {
  final instance = AppleReauthBodyBuilder();
  // TODO add properties to the builder and call build()

  group(AppleReauthBody, () {
    // A FRESH Apple identity token for the same account. Never logged.
    // String identityToken
    test('to test the property `identityToken`', () async {
      // TODO
    });

    // A FRESH Apple authorization code from the same sign-in. Never logged.
    // String authorizationCode
    test('to test the property `authorizationCode`', () async {
      // TODO
    });

    // The RAW nonce used for this fresh sign-in. Never logged.
    // String nonce
    test('to test the property `nonce`', () async {
      // TODO
    });

  });
}
