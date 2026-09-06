# trade_pilot_api_client.api.NativePushApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**registerNativePushDevice**](NativePushApi.md#registernativepushdevice) | **POST** /native-push/register | Register (or transfer ownership of) a native push device token
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

