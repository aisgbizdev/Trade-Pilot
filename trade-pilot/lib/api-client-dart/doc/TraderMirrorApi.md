# trade_pilot_api_client.api.TraderMirrorApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTraderMirrorInsights**](TraderMirrorApi.md#gettradermirrorinsights) | **GET** /mirror/insights | Behavioural insights about the caller as a trader (task


# **getTraderMirrorInsights**
> TraderMirrorResponse getTraderMirrorInsights()

Behavioural insights about the caller as a trader (task

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTraderMirrorApi();

try {
    final response = api.getTraderMirrorInsights();
    print(response);
} on DioException catch (e) {
    print('Exception when calling TraderMirrorApi->getTraderMirrorInsights: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TraderMirrorResponse**](TraderMirrorResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

