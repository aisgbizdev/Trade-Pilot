import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for WebHandoffBody
void main() {
  final instance = WebHandoffBodyBuilder();
  // TODO add properties to the builder and call build()

  group(WebHandoffBody, () {
    // Relative path to land on after the browser session is established. Must match an exact-match allowlist server-side (currently only \"/topup\") — any other value, a full URL, or a protocol-relative \"//host\" is rejected with 400.
    // String next
    test('to test the property `next`', () async {
      // TODO
    });

  });
}
