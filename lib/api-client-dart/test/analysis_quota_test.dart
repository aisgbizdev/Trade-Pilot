import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';

// tests for AnalysisQuota
void main() {
  final instance = AnalysisQuotaBuilder();
  // TODO add properties to the builder and call build()

  group(AnalysisQuota, () {
    // True for admin/super_admin, who bypass quota
    // bool unlimited
    test('to test the property `unlimited`', () async {
      // TODO
    });

    // AnalysisQuotaHourly hourly
    test('to test the property `hourly`', () async {
      // TODO
    });

    // AnalysisQuotaHourly daily
    test('to test the property `daily`', () async {
      // TODO
    });

  });
}
