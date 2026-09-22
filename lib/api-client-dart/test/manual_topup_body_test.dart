import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for ManualTopupBody
void main() {
  final instance = ManualTopupBodyBuilder();
  // TODO add properties to the builder and call build()

  group(ManualTopupBody, () {
    // int userId
    test('to test the property `userId`', () async {
      // TODO
    });

    // Not constrained to the fixed packages — admins can grant any amount/credits pair to resolve a top-up support case (e.g. a payment confirmed outside the app after proof upload failed).
    // int amountRupiah
    test('to test the property `amountRupiah`', () async {
      // TODO
    });

    // int credits
    test('to test the property `credits`', () async {
      // TODO
    });

    // Required audit trail — this bypasses the normal proof-upload verification entirely, so the reason must be recorded.
    // String note
    test('to test the property `note`', () async {
      // TODO
    });

  });
}
