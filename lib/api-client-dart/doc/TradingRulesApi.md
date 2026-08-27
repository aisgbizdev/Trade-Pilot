# trade_pilot_api_client.api.TradingRulesApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getStandardTradingRules**](TradingRulesApi.md#getstandardtradingrules) | **GET** /trading-rules/standard | Get the fixed TP Standard Trading Rules


# **getStandardTradingRules**
> StandardTradingRules getStandardTradingRules()

Get the fixed TP Standard Trading Rules

Broker-neutral disclosure for the single TP Standard Trading Rules definition. This endpoint intentionally has no broker selector.

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTradingRulesApi();

try {
    final response = api.getStandardTradingRules();
    print(response);
} on DioException catch (e) {
    print('Exception when calling TradingRulesApi->getStandardTradingRules: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**StandardTradingRules**](StandardTradingRules.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

