# trade_pilot_api_client.api.PerformanceApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPerformanceSummary**](PerformanceApi.md#getperformancesummary) | **GET** /performance/summary | Public AI transparency dashboard (task


# **getPerformanceSummary**
> PerformanceSummary getPerformanceSummary(window)

Public AI transparency dashboard (task

Anonymised, aggregated outcome ledger across every analysis the AI has produced inside the rolling window. No per-user data is included — this is the AI's own track record. Every segment (by instrument, FX session, market condition) is gated by a minimum-sample guardrail so a 3-trade hot streak never reads as a confident win rate. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getPerformanceApi();
final int window = 56; // int | Rolling window in days. Only 30 or 90 are accepted; anything else falls back to 30.

try {
    final response = api.getPerformanceSummary(window);
    print(response);
} on DioException catch (e) {
    print('Exception when calling PerformanceApi->getPerformanceSummary: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **window** | **int**| Rolling window in days. Only 30 or 90 are accepted; anything else falls back to 30. | [optional] [default to 30]

### Return type

[**PerformanceSummary**](PerformanceSummary.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

