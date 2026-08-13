import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for PushApi
void main() {
  final instance = TradePilotApiClient().getPushApi();

  group(PushApi, () {
    // Get current user's push notification preferences
    //
    //Future<PushPrefs> getPushPrefs() async
    test('test getPushPrefs', () async {
      // TODO
    });

    // Get the VAPID public key for Web Push subscription
    //
    //Future<PushPublicKey> getPushPublicKey() async
    test('test getPushPublicKey', () async {
      // TODO
    });

    // Check whether the current user has any active push subscription
    //
    //Future<PushSubscriptionStatus> getPushSubscriptionStatus() async
    test('test getPushSubscriptionStatus', () async {
      // TODO
    });

    // Send a sample push notification to the calling user's subscribed devices
    //
    // Lets a signed-in user verify their phone actually pops up an OS-level notification. Sends to every subscription endpoint registered for the caller. Per-user rate limited so a misbehaving client cannot spam their own devices. 
    //
    //Future<PushTestResult> sendPushTest() async
    test('test sendPushTest', () async {
      // TODO
    });

    // Register a Web Push subscription for the current user
    //
    //Future<MessageResponse> subscribePush(PushSubscriptionBody pushSubscriptionBody) async
    test('test subscribePush', () async {
      // TODO
    });

    // Remove a Web Push subscription for the current user
    //
    //Future<MessageResponse> unsubscribePush(PushUnsubscribeBody pushUnsubscribeBody) async
    test('test unsubscribePush', () async {
      // TODO
    });

    // Update push notification preferences
    //
    //Future<PushPrefs> updatePushPrefs(PushPrefsUpdate pushPrefsUpdate) async
    test('test updatePushPrefs', () async {
      // TODO
    });

  });
}
