# trade_pilot_api_client.api.TopupsApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTopupRequest**](TopupsApi.md#createtopuprequest) | **POST** /topups | Submit a manual top-up request for admin review
[**getCreditBalance**](TopupsApi.md#getcreditbalance) | **GET** /topups/balance | Get the authenticated user&#39;s analysis credit balance
[**getMyTopupRequests**](TopupsApi.md#getmytopuprequests) | **GET** /topups/mine | List the authenticated user&#39;s own top-up request history
[**getTopupConfig**](TopupsApi.md#gettopupconfig) | **GET** /topups/config | Get the current Rupiah-to-credit conversion rate and QRIS image URL


# **createTopupRequest**
> TopupRequest createTopupRequest(createTopupRequestBody)

Submit a manual top-up request for admin review

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTopupsApi();
final CreateTopupRequestBody createTopupRequestBody = ; // CreateTopupRequestBody | 

try {
    final response = api.createTopupRequest(createTopupRequestBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TopupsApi->createTopupRequest: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTopupRequestBody** | [**CreateTopupRequestBody**](CreateTopupRequestBody.md)|  | 

### Return type

[**TopupRequest**](TopupRequest.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCreditBalance**
> CreditBalance getCreditBalance()

Get the authenticated user's analysis credit balance

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTopupsApi();

try {
    final response = api.getCreditBalance();
    print(response);
} on DioException catch (e) {
    print('Exception when calling TopupsApi->getCreditBalance: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**CreditBalance**](CreditBalance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyTopupRequests**
> TopupRequestList getMyTopupRequests(page, limit)

List the authenticated user's own top-up request history

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTopupsApi();
final int page = 56; // int | 
final int limit = 56; // int | 

try {
    final response = api.getMyTopupRequests(page, limit);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TopupsApi->getMyTopupRequests: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**|  | [optional] [default to 1]
 **limit** | **int**|  | [optional] [default to 20]

### Return type

[**TopupRequestList**](TopupRequestList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTopupConfig**
> TopupConfig getTopupConfig()

Get the current Rupiah-to-credit conversion rate and QRIS image URL

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTopupsApi();

try {
    final response = api.getTopupConfig();
    print(response);
} on DioException catch (e) {
    print('Exception when calling TopupsApi->getTopupConfig: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TopupConfig**](TopupConfig.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

