import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for AuthApi
void main() {
  final instance = TradePilotApiClient().getAuthApi();

  group(AuthApi, () {
    // Change own password
    //
    //Future<MessageResponse> changePassword(ChangePasswordBody changePasswordBody) async
    test('test changePassword', () async {
      // TODO
    });

    // Change security question
    //
    //Future<MessageResponse> changeSecurityQuestion(ChangeSecurityQuestionBody changeSecurityQuestionBody) async
    test('test changeSecurityQuestion', () async {
      // TODO
    });

    // Get security question for email
    //
    //Future<SecurityQuestionResponse> getForgotPasswordQuestion(ForgotPasswordQuestionBody forgotPasswordQuestionBody) async
    test('test getForgotPasswordQuestion', () async {
      // TODO
    });

    // Get current user
    //
    //Future<User> getMe() async
    test('test getMe', () async {
      // TODO
    });

    // Login user
    //
    //Future<AuthResponse> login(LoginBody loginBody) async
    test('test login', () async {
      // TODO
    });

    // Logout user
    //
    //Future<MessageResponse> logout() async
    test('test logout', () async {
      // TODO
    });

    // Register new user
    //
    //Future<AuthResponse> register(RegisterBody registerBody) async
    test('test register', () async {
      // TODO
    });

    // Reset password with token
    //
    //Future<MessageResponse> resetPassword(ResetPasswordBody resetPasswordBody) async
    test('test resetPassword', () async {
      // TODO
    });

    // Update user profile
    //
    //Future<User> updateProfile(UpdateProfileBody updateProfileBody) async
    test('test updateProfile', () async {
      // TODO
    });

    // Verify security answer and get reset token
    //
    //Future<ResetTokenResponse> verifySecurityAnswer(VerifySecurityAnswerBody verifySecurityAnswerBody) async
    test('test verifySecurityAnswer', () async {
      // TODO
    });

  });
}
