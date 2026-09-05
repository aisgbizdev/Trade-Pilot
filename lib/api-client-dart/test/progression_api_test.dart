import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for ProgressionApi
void main() {
  final instance = TradePilotApiClient().getProgressionApi();

  group(ProgressionApi, () {
    // Get private achievement catalog and unlock state
    //
    //Future<ProgressionCatalog> getProgressionCatalog() async
    test('test getProgressionCatalog', () async {
      // TODO
    });

    // Get private append-only XP history
    //
    //Future<ProgressionHistory> getProgressionHistory({ int limit }) async
    test('test getProgressionHistory', () async {
      // TODO
    });

    // Get the authenticated user's private progression summary
    //
    //Future<ProgressionSummary> getProgressionSummary() async
    test('test getProgressionSummary', () async {
      // TODO
    });

    // Record a server-verifiable checklist or guide completion
    //
    //Future<ProgressionAward> recordProgressionActivity(ProgressionActivityInput progressionActivityInput) async
    test('test recordProgressionActivity', () async {
      // TODO
    });

  });
}
