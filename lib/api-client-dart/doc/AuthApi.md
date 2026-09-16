# trade_pilot_api_client.api.AuthApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changePassword**](AuthApi.md#changepassword) | **PATCH** /auth/password | Change own password
[**changeSecurityQuestion**](AuthApi.md#changesecurityquestion) | **PATCH** /auth/security-question | Change security question
[**deleteAccount**](AuthApi.md#deleteaccount) | **DELETE** /auth/account | Permanently delete the current user&#39;s own account
[**getForgotPasswordQuestion**](AuthApi.md#getforgotpasswordquestion) | **POST** /auth/forgot-password/question | Get security question for email
[**getMe**](AuthApi.md#getme) | **GET** /auth/me | Get current user
[**login**](AuthApi.md#login) | **POST** /auth/login | Login user
[**loginWithAppleNative**](AuthApi.md#loginwithapplenative) | **POST** /auth/apple/native | Exchange a native Sign in with Apple identity token for a TradePilot session
[**loginWithGoogleNative**](AuthApi.md#loginwithgooglenative) | **POST** /auth/google/native | Exchange a native-app Google ID token for a TradePilot session
[**logout**](AuthApi.md#logout) | **POST** /auth/logout | Logout user
[**reauthenticateWithApple**](AuthApi.md#reauthenticatewithapple) | **POST** /auth/reauth/apple | Prove identity with a fresh Apple identity token for a sensitive operation
[**reauthenticateWithGoogle**](AuthApi.md#reauthenticatewithgoogle) | **POST** /auth/reauth/google | Prove identity with a fresh Google ID token for a sensitive operation
[**register**](AuthApi.md#register) | **POST** /auth/register | Register new user
[**resetPassword**](AuthApi.md#resetpassword) | **POST** /auth/forgot-password/reset | Reset password with token
[**updateProfile**](AuthApi.md#updateprofile) | **PATCH** /auth/profile | Update user profile
[**verifySecurityAnswer**](AuthApi.md#verifysecurityanswer) | **POST** /auth/forgot-password/verify | Verify security answer and get reset token


# **changePassword**
> MessageResponse changePassword(changePasswordBody)

Change own password

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final ChangePasswordBody changePasswordBody = ; // ChangePasswordBody | 

try {
    final response = api.changePassword(changePasswordBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->changePassword: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **changePasswordBody** | [**ChangePasswordBody**](ChangePasswordBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **changeSecurityQuestion**
> MessageResponse changeSecurityQuestion(changeSecurityQuestionBody)

Change security question

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final ChangeSecurityQuestionBody changeSecurityQuestionBody = ; // ChangeSecurityQuestionBody | 

try {
    final response = api.changeSecurityQuestion(changeSecurityQuestionBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->changeSecurityQuestion: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **changeSecurityQuestionBody** | [**ChangeSecurityQuestionBody**](ChangeSecurityQuestionBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAccount**
> MessageResponse deleteAccount(deleteAccountBody)

Permanently delete the current user's own account

Re-authenticates with `currentPassword`, then permanently deletes the authenticated user's account and every row that references it (analyses, notifications, sessions, push subscriptions, native push devices, journal entries, watchlist, alerts, etc.) via cascading foreign keys. Cannot be used to delete another user's account — the target is always the authenticated caller.

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final DeleteAccountBody deleteAccountBody = ; // DeleteAccountBody | 

try {
    final response = api.deleteAccount(deleteAccountBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->deleteAccount: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteAccountBody** | [**DeleteAccountBody**](DeleteAccountBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getForgotPasswordQuestion**
> SecurityQuestionResponse getForgotPasswordQuestion(forgotPasswordQuestionBody)

Get security question for email

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final ForgotPasswordQuestionBody forgotPasswordQuestionBody = ; // ForgotPasswordQuestionBody | 

try {
    final response = api.getForgotPasswordQuestion(forgotPasswordQuestionBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->getForgotPasswordQuestion: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **forgotPasswordQuestionBody** | [**ForgotPasswordQuestionBody**](ForgotPasswordQuestionBody.md)|  | 

### Return type

[**SecurityQuestionResponse**](SecurityQuestionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMe**
> User getMe()

Get current user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();

try {
    final response = api.getMe();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->getMe: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**User**](User.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **login**
> AuthResponse login(loginBody)

Login user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final LoginBody loginBody = ; // LoginBody | 

try {
    final response = api.login(loginBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->login: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginBody** | [**LoginBody**](LoginBody.md)|  | 

### Return type

[**AuthResponse**](AuthResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loginWithAppleNative**
> AuthResponse loginWithAppleNative(appleNativeLoginBody)

Exchange a native Sign in with Apple identity token for a TradePilot session

For mobile apps that obtain an **identity token** + **authorization code** with Apple's native Sign in with Apple SDK. The client generates a random raw nonce, sends its SHA-256 hash to Apple, and posts the raw nonce here alongside the identity token.  The server verifies the identity token's signature against Apple's published JWKS (never a bare decode), its issuer, audience (against `APPLE_ALLOWED_CLIENT_IDS`), expiry, and that the token's `nonce` claim equals SHA-256(raw nonce) — then independently exchanges the authorization code with Apple's own token endpoint as a second, server-to-server proof that it is genuine, unexpired, and unused. It then upserts the account (match apple_id → link by verified email → create) and returns a normal TradePilot Bearer session. No cookie is set or required. The response never contains the Apple identity token, authorization code, or any Apple token-endpoint credential.  `givenName`/`familyName` are only ever used as a display-name candidate when creating a brand-new account — Apple only sends them on the very first authorization for this app, and a later login succeeds on `sub` alone even with no name or email in the token. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final AppleNativeLoginBody appleNativeLoginBody = ; // AppleNativeLoginBody | 

try {
    final response = api.loginWithAppleNative(appleNativeLoginBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->loginWithAppleNative: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appleNativeLoginBody** | [**AppleNativeLoginBody**](AppleNativeLoginBody.md)|  | 

### Return type

[**AuthResponse**](AuthResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loginWithGoogleNative**
> AuthResponse loginWithGoogleNative(googleNativeLoginBody)

Exchange a native-app Google ID token for a TradePilot session

For mobile apps that obtain a Google **ID token** with the native Google SDK. The server verifies the token (signature, issuer, audience against the configured allowlist, expiry, verified email), upserts the account (match google_id → link by verified email → create), and returns a normal TradePilot Bearer session. No cookie is set or required. The response never contains the Google token. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final GoogleNativeLoginBody googleNativeLoginBody = ; // GoogleNativeLoginBody | 

try {
    final response = api.loginWithGoogleNative(googleNativeLoginBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->loginWithGoogleNative: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **googleNativeLoginBody** | [**GoogleNativeLoginBody**](GoogleNativeLoginBody.md)|  | 

### Return type

[**AuthResponse**](AuthResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
> MessageResponse logout()

Logout user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();

try {
    final response = api.logout();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->logout: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reauthenticateWithApple**
> AppleReauthResponse reauthenticateWithApple(appleReauthBody)

Prove identity with a fresh Apple identity token for a sensitive operation

A live session alone is not sufficient for sensitive operations on an Apple-only account. The client repeats the native Sign in with Apple flow to obtain a **fresh** identity token + authorization code + raw nonce and posts them here; on success the server returns a short-lived (≤5 min), single-use `reauthToken` bound to the user and to the `delete_account` purpose — the same token shape and the same consumer (DELETE /auth/account) as POST /auth/reauth/google. The Apple `sub` in the fresh token must match the signed-in account's stored `apple_id`. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';
// TODO Configure API key authorization: sessionCookie
//defaultApiClient.getAuthentication<ApiKeyAuth>('sessionCookie').apiKey = 'YOUR_API_KEY';
// uncomment below to setup prefix (e.g. Bearer) for API key, if needed
//defaultApiClient.getAuthentication<ApiKeyAuth>('sessionCookie').apiKeyPrefix = 'Bearer';

final api = TradePilotApiClient().getAuthApi();
final AppleReauthBody appleReauthBody = ; // AppleReauthBody | 

try {
    final response = api.reauthenticateWithApple(appleReauthBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->reauthenticateWithApple: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appleReauthBody** | [**AppleReauthBody**](AppleReauthBody.md)|  | 

### Return type

[**AppleReauthResponse**](AppleReauthResponse.md)

### Authorization

[sessionCookie](../README.md#sessionCookie), [bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reauthenticateWithGoogle**
> GoogleReauthResponse reauthenticateWithGoogle(googleReauthBody)

Prove identity with a fresh Google ID token for a sensitive operation

A live session alone is not sufficient for sensitive operations on a Google-only account. The client obtains a **fresh** Google ID token and posts it here; on success the server returns a short-lived (≤5 min), single-use `reauthToken` bound to the user and to the `delete_account` purpose. Currently consumed by DELETE /auth/account. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';
// TODO Configure API key authorization: sessionCookie
//defaultApiClient.getAuthentication<ApiKeyAuth>('sessionCookie').apiKey = 'YOUR_API_KEY';
// uncomment below to setup prefix (e.g. Bearer) for API key, if needed
//defaultApiClient.getAuthentication<ApiKeyAuth>('sessionCookie').apiKeyPrefix = 'Bearer';

final api = TradePilotApiClient().getAuthApi();
final GoogleReauthBody googleReauthBody = ; // GoogleReauthBody | 

try {
    final response = api.reauthenticateWithGoogle(googleReauthBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->reauthenticateWithGoogle: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **googleReauthBody** | [**GoogleReauthBody**](GoogleReauthBody.md)|  | 

### Return type

[**GoogleReauthResponse**](GoogleReauthResponse.md)

### Authorization

[sessionCookie](../README.md#sessionCookie), [bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **register**
> AuthResponse register(registerBody)

Register new user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final RegisterBody registerBody = ; // RegisterBody | 

try {
    final response = api.register(registerBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->register: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registerBody** | [**RegisterBody**](RegisterBody.md)|  | 

### Return type

[**AuthResponse**](AuthResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resetPassword**
> MessageResponse resetPassword(resetPasswordBody)

Reset password with token

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final ResetPasswordBody resetPasswordBody = ; // ResetPasswordBody | 

try {
    final response = api.resetPassword(resetPasswordBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->resetPassword: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resetPasswordBody** | [**ResetPasswordBody**](ResetPasswordBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProfile**
> User updateProfile(updateProfileBody)

Update user profile

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final UpdateProfileBody updateProfileBody = ; // UpdateProfileBody | 

try {
    final response = api.updateProfile(updateProfileBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->updateProfile: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateProfileBody** | [**UpdateProfileBody**](UpdateProfileBody.md)|  | 

### Return type

[**User**](User.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifySecurityAnswer**
> ResetTokenResponse verifySecurityAnswer(verifySecurityAnswerBody)

Verify security answer and get reset token

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAuthApi();
final VerifySecurityAnswerBody verifySecurityAnswerBody = ; // VerifySecurityAnswerBody | 

try {
    final response = api.verifySecurityAnswer(verifySecurityAnswerBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->verifySecurityAnswer: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **verifySecurityAnswerBody** | [**VerifySecurityAnswerBody**](VerifySecurityAnswerBody.md)|  | 

### Return type

[**ResetTokenResponse**](ResetTokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

