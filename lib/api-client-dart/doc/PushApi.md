# trade_pilot_api_client.api.PushApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPushPrefs**](PushApi.md#getpushprefs) | **GET** /push/prefs | Get current user&#39;s push notification preferences
[**getPushPublicKey**](PushApi.md#getpushpublickey) | **GET** /push/public-key | Get the VAPID public key for Web Push subscription
[**getPushSubscriptionStatus**](PushApi.md#getpushsubscriptionstatus) | **GET** /push/subscription-status | Check whether the current user has any active push subscription
[**sendPushTest**](PushApi.md#sendpushtest) | **POST** /push/test | Send a sample push notification to the calling user&#39;s subscribed devices
[**subscribePush**](PushApi.md#subscribepush) | **POST** /push/subscribe | Register a Web Push subscription for the current user
[**unsubscribePush**](PushApi.md#unsubscribepush) | **DELETE** /push/unsubscribe | Remove a Web Push subscription for the current user
[**updatePushPrefs**](PushApi.md#updatepushprefs) | **PATCH** /push/prefs | Update push notification preferences


# **getPushPrefs**
> PushPrefs getPushPrefs()

Get current user's push notification preferences

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getPushApi();

try {
    final response = api.getPushPrefs();
    print(response);
} on DioException catch (e) {
    print('Exception when calling PushApi->getPushPrefs: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PushPrefs**](PushPrefs.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPushPublicKey**
> PushPublicKey getPushPublicKey()

Get the VAPID public key for Web Push subscription

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getPushApi();

try {
    final response = api.getPushPublicKey();
    print(response);
} on DioException catch (e) {
    print('Exception when calling PushApi->getPushPublicKey: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PushPublicKey**](PushPublicKey.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPushSubscriptionStatus**
> PushSubscriptionStatus getPushSubscriptionStatus()

Check whether the current user has any active push subscription

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getPushApi();

try {
    final response = api.getPushSubscriptionStatus();
    print(response);
} on DioException catch (e) {
    print('Exception when calling PushApi->getPushSubscriptionStatus: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PushSubscriptionStatus**](PushSubscriptionStatus.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendPushTest**
> PushTestResult sendPushTest()

Send a sample push notification to the calling user's subscribed devices

Lets a signed-in user verify their phone actually pops up an OS-level notification. Sends to every subscription endpoint registered for the caller. Per-user rate limited so a misbehaving client cannot spam their own devices. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getPushApi();

try {
    final response = api.sendPushTest();
    print(response);
} on DioException catch (e) {
    print('Exception when calling PushApi->sendPushTest: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PushTestResult**](PushTestResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscribePush**
> MessageResponse subscribePush(pushSubscriptionBody)

Register a Web Push subscription for the current user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getPushApi();
final PushSubscriptionBody pushSubscriptionBody = ; // PushSubscriptionBody | 

try {
    final response = api.subscribePush(pushSubscriptionBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling PushApi->subscribePush: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pushSubscriptionBody** | [**PushSubscriptionBody**](PushSubscriptionBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unsubscribePush**
> MessageResponse unsubscribePush(pushUnsubscribeBody)

Remove a Web Push subscription for the current user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getPushApi();
final PushUnsubscribeBody pushUnsubscribeBody = ; // PushUnsubscribeBody | 

try {
    final response = api.unsubscribePush(pushUnsubscribeBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling PushApi->unsubscribePush: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pushUnsubscribeBody** | [**PushUnsubscribeBody**](PushUnsubscribeBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePushPrefs**
> PushPrefs updatePushPrefs(pushPrefsUpdate)

Update push notification preferences

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getPushApi();
final PushPrefsUpdate pushPrefsUpdate = ; // PushPrefsUpdate | 

try {
    final response = api.updatePushPrefs(pushPrefsUpdate);
    print(response);
} on DioException catch (e) {
    print('Exception when calling PushApi->updatePushPrefs: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pushPrefsUpdate** | [**PushPrefsUpdate**](PushPrefsUpdate.md)|  | 

### Return type

[**PushPrefs**](PushPrefs.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

