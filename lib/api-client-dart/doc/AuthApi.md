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
[**logout**](AuthApi.md#logout) | **POST** /auth/logout | Logout user
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

