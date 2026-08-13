import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for FilterPresetsApi
void main() {
  final instance = TradePilotApiClient().getFilterPresetsApi();

  group(FilterPresetsApi, () {
    // Save the current filter combination as a named preset
    //
    //Future<FilterPreset> createFilterPreset(CreateFilterPresetBody createFilterPresetBody) async
    test('test createFilterPreset', () async {
      // TODO
    });

    // Delete a preset
    //
    //Future deleteFilterPreset(int id) async
    test('test deleteFilterPreset', () async {
      // TODO
    });

    // List the signed-in user's saved filter presets
    //
    //Future<FilterPresetList> listFilterPresets() async
    test('test listFilterPresets', () async {
      // TODO
    });

    // Rename an existing preset
    //
    //Future<FilterPreset> renameFilterPreset(int id, RenameFilterPresetBody renameFilterPresetBody) async
    test('test renameFilterPreset', () async {
      // TODO
    });

  });
}
