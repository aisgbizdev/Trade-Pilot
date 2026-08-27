# trade_pilot_api_client.api.WatchlistApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addWatchlistItem**](WatchlistApi.md#addwatchlistitem) | **POST** /watchlist | Star an instrument
[**getWatchlist**](WatchlistApi.md#getwatchlist) | **GET** /watchlist | Get the current user&#39;s instrument watchlist
[**removeWatchlistItem**](WatchlistApi.md#removewatchlistitem) | **DELETE** /watchlist/{instrument} | Unstar an instrument


# **addWatchlistItem**
> WatchlistItem addWatchlistItem(addWatchlistBody)

Star an instrument

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getWatchlistApi();
final AddWatchlistBody addWatchlistBody = ; // AddWatchlistBody | 

try {
    final response = api.addWatchlistItem(addWatchlistBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WatchlistApi->addWatchlistItem: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addWatchlistBody** | [**AddWatchlistBody**](AddWatchlistBody.md)|  | 

### Return type

[**WatchlistItem**](WatchlistItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getWatchlist**
> Watchlist getWatchlist()

Get the current user's instrument watchlist

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getWatchlistApi();

try {
    final response = api.getWatchlist();
    print(response);
} on DioException catch (e) {
    print('Exception when calling WatchlistApi->getWatchlist: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Watchlist**](Watchlist.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeWatchlistItem**
> MessageResponse removeWatchlistItem(instrument)

Unstar an instrument

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getWatchlistApi();
final String instrument = instrument_example; // String | 

try {
    final response = api.removeWatchlistItem(instrument);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WatchlistApi->removeWatchlistItem: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **instrument** | **String**|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

