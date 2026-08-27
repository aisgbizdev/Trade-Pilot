import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for NativePushApi
void main() {
  final instance = TradePilotApiClient().getNativePushApi();

  group(NativePushApi, () {
    // Register (or transfer ownership of) a native push device token
    //
    // Upserts on the globally-unique device token: if the same physical device token was previously registered under a different account, ownership transfers to the current authenticated user (the correct behavior when a device logs out and a different user logs in).
    //
    //Future<MessageResponse> registerNativePushDevice(NativePushRegisterBody nativePushRegisterBody) async
    test('test registerNativePushDevice', () async {
      // TODO
    });

    // Remove the caller's own native push device registration
    //
    //Future<MessageResponse> unregisterNativePushDevice(NativePushUnregisterBody nativePushUnregisterBody) async
    test('test unregisterNativePushDevice', () async {
      // TODO
    });

  });
}
