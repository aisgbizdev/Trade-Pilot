import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for TraderMirrorApi
void main() {
  final instance = TradePilotApiClient().getTraderMirrorApi();

  group(TraderMirrorApi, () {
    // Behavioural insights about the caller as a trader (task
    //
    //Future<TraderMirrorResponse> getTraderMirrorInsights() async
    test('test getTraderMirrorInsights', () async {
      // TODO
    });

  });
}
