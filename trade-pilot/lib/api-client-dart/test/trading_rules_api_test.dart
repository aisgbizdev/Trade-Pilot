import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for TradingRulesApi
void main() {
  final instance = TradePilotApiClient().getTradingRulesApi();

  group(TradingRulesApi, () {
    // Get the fixed TP Standard Trading Rules
    //
    // Broker-neutral disclosure for the single TP Standard Trading Rules definition. This endpoint intentionally has no broker selector.
    //
    //Future<StandardTradingRules> getStandardTradingRules() async
    test('test getStandardTradingRules', () async {
      // TODO
    });

  });
}
