import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for TopupsApi
void main() {
  final instance = TradePilotApiClient().getTopupsApi();

  group(TopupsApi, () {
    // Submit a manual top-up request for admin review
    //
    //Future<TopupRequest> createTopupRequest(CreateTopupRequestBody createTopupRequestBody) async
    test('test createTopupRequest', () async {
      // TODO
    });

    // Get the authenticated user's analysis credit balance
    //
    //Future<CreditBalance> getCreditBalance() async
    test('test getCreditBalance', () async {
      // TODO
    });

    // List the authenticated user's own top-up request history
    //
    //Future<TopupRequestList> getMyTopupRequests({ int page, int limit }) async
    test('test getMyTopupRequests', () async {
      // TODO
    });

    // Get the current Rupiah-to-credit conversion rate and QRIS image URL
    //
    //Future<TopupConfig> getTopupConfig() async
    test('test getTopupConfig', () async {
      // TODO
    });

  });
}
