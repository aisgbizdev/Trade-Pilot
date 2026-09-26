# trade_pilot_api_client.api.TopupsApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createDokuCheckout**](TopupsApi.md#createdokucheckout) | **POST** /topups/doku/checkout | Create a DOKU Checkout session for a package at/above the DOKU-only threshold
[**createTopupRequest**](TopupsApi.md#createtopuprequest) | **POST** /topups | Submit a manual top-up request for admin review
[**getCreditBalance**](TopupsApi.md#getcreditbalance) | **GET** /topups/balance | Get the authenticated user&#39;s analysis credit balance
[**getDokuTopupStatus**](TopupsApi.md#getdokutopupstatus) | **GET** /topups/doku/{id}/status | Poll a DOKU checkout request&#39;s status (owner-only)
[**getMyTopupRequests**](TopupsApi.md#getmytopuprequests) | **GET** /topups/mine | List the authenticated user&#39;s own top-up request history
[**getTopupConfig**](TopupsApi.md#gettopupconfig) | **GET** /topups/config | Get the fixed top-up packages and QRIS image URL


# **createDokuCheckout**
> DokuCheckoutSession createDokuCheckout(createDokuCheckoutBody)

Create a DOKU Checkout session for a package at/above the DOKU-only threshold

Only accepts packages that are NOT eligible for the manual/QRIS path (POST /topups accepts only the one below the threshold). Returns a hosted DOKU payment page URL to redirect the browser to; credits are granted only once POST /topups/doku/notify confirms the payment.

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTopupsApi();
final CreateDokuCheckoutBody createDokuCheckoutBody = ; // CreateDokuCheckoutBody | 

try {
    final response = api.createDokuCheckout(createDokuCheckoutBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TopupsApi->createDokuCheckout: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createDokuCheckoutBody** | [**CreateDokuCheckoutBody**](CreateDokuCheckoutBody.md)|  | 

### Return type

[**DokuCheckoutSession**](DokuCheckoutSession.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

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

# **getDokuTopupStatus**
> DokuTopupStatus getDokuTopupStatus(id)

Poll a DOKU checkout request's status (owner-only)

For the frontend to poll right after the browser returns from DOKU's checkout page, in case the payment notification webhook hasn't landed yet.

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTopupsApi();
final int id = 56; // int | 

try {
    final response = api.getDokuTopupStatus(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TopupsApi->getDokuTopupStatus: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**DokuTopupStatus**](DokuTopupStatus.md)

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

Get the fixed top-up packages and QRIS image URL

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

