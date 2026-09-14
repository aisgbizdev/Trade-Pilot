# trade_pilot_api_client.api.NativePushApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**registerNativePushDevice**](NativePushApi.md#registernativepushdevice) | **POST** /native-push/register | Register (or transfer ownership of) a native push device token
[**sendNativePushTest**](NativePushApi.md#sendnativepushtest) | **POST** /native-push/test | Send a sample FCM push to the caller&#39;s own registered mobile devices
[**unregisterNativePushDevice**](NativePushApi.md#unregisternativepushdevice) | **DELETE** /native-push/unregister | Remove the caller&#39;s own native push device registration


# **registerNativePushDevice**
> MessageResponse registerNativePushDevice(nativePushRegisterBody)

Register (or transfer ownership of) a native push device token

Upserts on the globally-unique device token: if the same physical device token was previously registered under a different account, ownership transfers to the current authenticated user (the correct behavior when a device logs out and a different user logs in).

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getNativePushApi();
final NativePushRegisterBody nativePushRegisterBody = ; // NativePushRegisterBody | 

try {
    final response = api.registerNativePushDevice(nativePushRegisterBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling NativePushApi->registerNativePushDevice: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nativePushRegisterBody** | [**NativePushRegisterBody**](NativePushRegisterBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendNativePushTest**
> NativePushTestResult sendNativePushTest()

Send a sample FCM push to the caller's own registered mobile devices

Native-channel equivalent of POST /push/test. Sends one sample notification through the exact `sendNativePushToUser` code path production uses, so a passing result is real proof the FCM HTTP v1 wiring works. Authenticated + per-user rate limited. Does not accept a device token or a URL from the request body. Unlike /push/test, the outcome reflects FCM's per-message acceptance — see NativePushTestResult. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getNativePushApi();

try {
    final response = api.sendNativePushTest();
    print(response);
} on DioException catch (e) {
    print('Exception when calling NativePushApi->sendNativePushTest: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**NativePushTestResult**](NativePushTestResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unregisterNativePushDevice**
> MessageResponse unregisterNativePushDevice(nativePushUnregisterBody)

Remove the caller's own native push device registration

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getNativePushApi();
final NativePushUnregisterBody nativePushUnregisterBody = ; // NativePushUnregisterBody | 

try {
    final response = api.unregisterNativePushDevice(nativePushUnregisterBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling NativePushApi->unregisterNativePushDevice: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nativePushUnregisterBody** | [**NativePushUnregisterBody**](NativePushUnregisterBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

