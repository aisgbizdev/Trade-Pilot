# trade_pilot_api_client.api.DailySummaryApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getDailySummary**](DailySummaryApi.md#getdailysummary) | **GET** /me/daily-summary | Get current user&#39;s daily summary settings + today&#39;s digest
[**updateDailySummarySettings**](DailySummaryApi.md#updatedailysummarysettings) | **PUT** /me/daily-summary | Update daily summary settings (enabled, time, timezone)


# **getDailySummary**
> DailySummaryResponse getDailySummary()

Get current user's daily summary settings + today's digest

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getDailySummaryApi();

try {
    final response = api.getDailySummary();
    print(response);
} on DioException catch (e) {
    print('Exception when calling DailySummaryApi->getDailySummary: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**DailySummaryResponse**](DailySummaryResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateDailySummarySettings**
> DailySummarySettings updateDailySummarySettings(dailySummarySettingsUpdate)

Update daily summary settings (enabled, time, timezone)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getDailySummaryApi();
final DailySummarySettingsUpdate dailySummarySettingsUpdate = ; // DailySummarySettingsUpdate | 

try {
    final response = api.updateDailySummarySettings(dailySummarySettingsUpdate);
    print(response);
} on DioException catch (e) {
    print('Exception when calling DailySummaryApi->updateDailySummarySettings: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dailySummarySettingsUpdate** | [**DailySummarySettingsUpdate**](DailySummarySettingsUpdate.md)|  | 

### Return type

[**DailySummarySettings**](DailySummarySettings.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

