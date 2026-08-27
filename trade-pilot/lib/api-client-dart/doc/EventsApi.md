# trade_pilot_api_client.api.EventsApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**recordOutboundClick**](EventsApi.md#recordoutboundclick) | **POST** /events/outbound-click | Record a sponsor / partner outbound link click
[**trackAnalyticsEvent**](EventsApi.md#trackanalyticsevent) | **POST** /events/track | Record a page-view or key-action analytics event


# **recordOutboundClick**
> recordOutboundClick(outboundClickBody)

Record a sponsor / partner outbound link click

Fire-and-forget telemetry. Auth is optional — most surfaces are reachable while signed out (splash, landing). Always returns 204 even when validation rejects the body so a malformed beacon never blocks the user's outbound navigation. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getEventsApi();
final OutboundClickBody outboundClickBody = ; // OutboundClickBody | 

try {
    api.recordOutboundClick(outboundClickBody);
} on DioException catch (e) {
    print('Exception when calling EventsApi->recordOutboundClick: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **outboundClickBody** | [**OutboundClickBody**](OutboundClickBody.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **trackAnalyticsEvent**
> trackAnalyticsEvent(analyticsEventBody)

Record a page-view or key-action analytics event

Fire-and-forget app-usage telemetry (admin analytics dashboard). Auth is optional — page views happen pre-login too (landing, login). Always returns 204 even when validation rejects the body so a malformed beacon never blocks navigation. Device/browser/OS and country are resolved server-side from the request itself (User-Agent + IP) — never trust client-supplied values for these. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getEventsApi();
final AnalyticsEventBody analyticsEventBody = ; // AnalyticsEventBody | 

try {
    api.trackAnalyticsEvent(analyticsEventBody);
} on DioException catch (e) {
    print('Exception when calling EventsApi->trackAnalyticsEvent: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **analyticsEventBody** | [**AnalyticsEventBody**](AnalyticsEventBody.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

