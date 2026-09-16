import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for AppleNativeLoginBody
void main() {
  final instance = AppleNativeLoginBodyBuilder();
  // TODO add properties to the builder and call build()

  group(AppleNativeLoginBody, () {
    // Apple identity token (JWT) from the device's native Sign in with Apple SDK. Never logged.
    // String identityToken
    test('to test the property `identityToken`', () async {
      // TODO
    });

    // Apple authorization code from the same native sign-in. Never logged.
    // String authorizationCode
    test('to test the property `authorizationCode`', () async {
      // TODO
    });

    // The RAW nonce the client generated before sending its SHA-256 hash to Apple. Never logged.
    // String nonce
    test('to test the property `nonce`', () async {
      // TODO
    });

    // Optional, only present on the first authorization. Used only as a display-name candidate when creating a brand-new account.
    // String givenName
    test('to test the property `givenName`', () async {
      // TODO
    });

    // Optional, only present on the first authorization. Used only as a display-name candidate when creating a brand-new account.
    // String familyName
    test('to test the property `familyName`', () async {
      // TODO
    });

  });
}
