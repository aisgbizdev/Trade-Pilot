import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for UserPriceAlertsApi
void main() {
  final instance = TradePilotApiClient().getUserPriceAlertsApi();

  group(UserPriceAlertsApi, () {
    // Create a new price alert for an instrument
    //
    //Future<UserPriceAlert> createUserPriceAlert(CreateUserPriceAlertBody createUserPriceAlertBody) async
    test('test createUserPriceAlert', () async {
      // TODO
    });

    // Delete one of the user's price alerts
    //
    //Future<MessageResponse> deleteUserPriceAlert(int id) async
    test('test deleteUserPriceAlert', () async {
      // TODO
    });

    // List the current user's price alerts (active + recently triggered)
    //
    //Future<UserPriceAlertList> listUserPriceAlerts() async
    test('test listUserPriceAlerts', () async {
      // TODO
    });

  });
}
