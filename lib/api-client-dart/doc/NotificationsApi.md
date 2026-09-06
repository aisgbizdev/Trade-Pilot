# trade_pilot_api_client.api.NotificationsApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getNotifications**](NotificationsApi.md#getnotifications) | **GET** /notifications | Get notifications for current user
[**markAllNotificationsRead**](NotificationsApi.md#markallnotificationsread) | **PATCH** /notifications/read-all | Mark all notifications as read
[**markNotificationRead**](NotificationsApi.md#marknotificationread) | **PATCH** /notifications/{id}/read | Mark single notification as read


# **getNotifications**
> NotificationsList getNotifications(unreadOnly)

Get notifications for current user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getNotificationsApi();
final bool unreadOnly = true; // bool | 

try {
    final response = api.getNotifications(unreadOnly);
    print(response);
} on DioException catch (e) {
    print('Exception when calling NotificationsApi->getNotifications: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unreadOnly** | **bool**|  | [optional] 

### Return type

[**NotificationsList**](NotificationsList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **markAllNotificationsRead**
> MessageResponse markAllNotificationsRead()

Mark all notifications as read

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getNotificationsApi();

try {
    final response = api.markAllNotificationsRead();
    print(response);
} on DioException catch (e) {
    print('Exception when calling NotificationsApi->markAllNotificationsRead: $e\n');
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

# **markNotificationRead**
> MessageResponse markNotificationRead(id)

Mark single notification as read

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getNotificationsApi();
final int id = 56; // int | 

try {
    final response = api.markNotificationRead(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling NotificationsApi->markNotificationRead: $e\n');
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

