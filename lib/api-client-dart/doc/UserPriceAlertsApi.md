# trade_pilot_api_client.api.UserPriceAlertsApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUserPriceAlert**](UserPriceAlertsApi.md#createuserpricealert) | **POST** /user-price-alerts | Create a new price alert for an instrument
[**deleteUserPriceAlert**](UserPriceAlertsApi.md#deleteuserpricealert) | **DELETE** /user-price-alerts/{id} | Delete one of the user&#39;s price alerts
[**listUserPriceAlerts**](UserPriceAlertsApi.md#listuserpricealerts) | **GET** /user-price-alerts | List the current user&#39;s price alerts (active + recently triggered)


# **createUserPriceAlert**
> UserPriceAlert createUserPriceAlert(createUserPriceAlertBody)

Create a new price alert for an instrument

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getUserPriceAlertsApi();
final CreateUserPriceAlertBody createUserPriceAlertBody = ; // CreateUserPriceAlertBody | 

try {
    final response = api.createUserPriceAlert(createUserPriceAlertBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserPriceAlertsApi->createUserPriceAlert: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createUserPriceAlertBody** | [**CreateUserPriceAlertBody**](CreateUserPriceAlertBody.md)|  | 

### Return type

[**UserPriceAlert**](UserPriceAlert.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteUserPriceAlert**
> MessageResponse deleteUserPriceAlert(id)

Delete one of the user's price alerts

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getUserPriceAlertsApi();
final int id = 56; // int | 

try {
    final response = api.deleteUserPriceAlert(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserPriceAlertsApi->deleteUserPriceAlert: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listUserPriceAlerts**
> UserPriceAlertList listUserPriceAlerts()

List the current user's price alerts (active + recently triggered)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getUserPriceAlertsApi();

try {
    final response = api.listUserPriceAlerts();
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserPriceAlertsApi->listUserPriceAlerts: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**UserPriceAlertList**](UserPriceAlertList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

