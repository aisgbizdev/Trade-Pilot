import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for SuperadminApi
void main() {
  final instance = TradePilotApiClient().getSuperadminApi();

  group(SuperadminApi, () {
    // Add a tag to a user
    //
    //Future<TagsList> addUserTag(int id, AddUserTagBody addUserTagBody) async
    test('test addUserTag', () async {
      // TODO
    });

    // Create new user (superadmin only)
    //
    //Future<User> createUser(CreateUserBody createUserBody) async
    test('test createUser', () async {
      // TODO
    });

    // Delete user (superadmin only)
    //
    //Future<MessageResponse> deleteUser(int id) async
    test('test deleteUser', () async {
      // TODO
    });

    // List all distinct tags assigned to users
    //
    //Future<TagsList> getAllTags() async
    test('test getAllTags', () async {
      // TODO
    });

    // Get all users (superadmin only)
    //
    //Future<UsersList> getAllUsers({ String search, int page, int limit }) async
    test('test getAllUsers', () async {
      // TODO
    });

    // Get all tags for a specific user
    //
    //Future<TagsList> getUserTags(int id) async
    test('test getUserTags', () async {
      // TODO
    });

    // Remove a tag from a user
    //
    //Future<TagsList> removeUserTag(int id, String tag) async
    test('test removeUserTag', () async {
      // TODO
    });

    // Reset user password (superadmin only)
    //
    //Future<MessageResponse> resetUserPassword(int id, ResetUserPasswordBody resetUserPasswordBody) async
    test('test resetUserPassword', () async {
      // TODO
    });

    // Set or clear a per-user analysis-quota override
    //
    // Each field is either a positive integer (override for just this user) or null (clear the override, revert to the global default from PATCH /superadmin/quota-settings). 
    //
    //Future<UserQuota> updateUserQuota(int id, UpdateUserQuotaBody updateUserQuotaBody) async
    test('test updateUserQuota', () async {
      // TODO
    });

    // Update user role (superadmin only)
    //
    //Future<User> updateUserRole(int id, UpdateUserRoleBody updateUserRoleBody) async
    test('test updateUserRole', () async {
      // TODO
    });

  });
}
