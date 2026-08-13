import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for NotificationsApi
void main() {
  final instance = TradePilotApiClient().getNotificationsApi();

  group(NotificationsApi, () {
    // Get notifications for current user
    //
    //Future<NotificationsList> getNotifications({ bool unreadOnly }) async
    test('test getNotifications', () async {
      // TODO
    });

    // Mark all notifications as read
    //
    //Future<MessageResponse> markAllNotificationsRead() async
    test('test markAllNotificationsRead', () async {
      // TODO
    });

    // Mark single notification as read
    //
    //Future<MessageResponse> markNotificationRead(int id) async
    test('test markNotificationRead', () async {
      // TODO
    });

  });
}
