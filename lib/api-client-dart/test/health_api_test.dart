import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for HealthApi
void main() {
  final instance = TradePilotApiClient().getHealthApi();

  group(HealthApi, () {
    // Health check
    //
    //Future<HealthStatus> healthCheck() async
    test('test healthCheck', () async {
      // TODO
    });

  });
}
