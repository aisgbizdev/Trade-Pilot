# trade_pilot_api_client.api.AdminApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**backfillProgression**](AdminApi.md#backfillprogression) | **POST** /admin/progression/backfill | Safely backfill only unequivocal historical progression evidence
[**broadcastNotification**](AdminApi.md#broadcastnotification) | **POST** /admin/notifications | Broadcast notification to selected audience
[**getAdminAnalyticsTokens**](AdminApi.md#getadminanalyticstokens) | **GET** /admin/analytics/tokens | AI (OpenAI) token usage and estimated cost breakdown
[**getAdminAnalyticsUsage**](AdminApi.md#getadminanalyticsusage) | **GET** /admin/analytics/usage | Feature-usage, device, browser, and country breakdown from analytics events
[**getAdminFeedback**](AdminApi.md#getadminfeedback) | **GET** /admin/feedback | List user feedback rows (admin only)
[**getAdminStats**](AdminApi.md#getadminstats) | **GET** /admin/stats | Get admin statistics
[**getAllAnalyses**](AdminApi.md#getallanalyses) | **GET** /admin/analyses | Get all analyses (admin only)
[**getBroadcasts**](AdminApi.md#getbroadcasts) | **GET** /admin/broadcasts | Broadcast history
[**getOutboundClickStats**](AdminApi.md#getoutboundclickstats) | **GET** /admin/outbound-clicks/stats | Aggregated counts of sponsor / partner outbound link clicks
[**getPendingTopupRequests**](AdminApi.md#getpendingtopuprequests) | **GET** /admin/topups | List top-up requests for admin review
[**getProgressionAudit**](AdminApi.md#getprogressionaudit) | **GET** /admin/progression/audit | Read-only progression ledger audit; never a leaderboard
[**getTopupSummary**](AdminApi.md#gettopupsummary) | **GET** /admin/topups/summary | Aggregate revenue/credits summary across all approved top-up requests, grouped by user and by calendar month
[**reviewCreditTopupRequest**](AdminApi.md#reviewcredittopuprequest) | **PATCH** /admin/topups/{id}/status | Approve or reject a top-up request, crediting the user&#39;s balance on approval


# **backfillProgression**
> ProgressionBackfillResult backfillProgression()

Safely backfill only unequivocal historical progression evidence

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();

try {
    final response = api.backfillProgression();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->backfillProgression: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ProgressionBackfillResult**](ProgressionBackfillResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **broadcastNotification**
> BroadcastSendResult broadcastNotification(broadcastNotificationBody)

Broadcast notification to selected audience

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final BroadcastNotificationBody broadcastNotificationBody = ; // BroadcastNotificationBody | 

try {
    final response = api.broadcastNotification(broadcastNotificationBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->broadcastNotification: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **broadcastNotificationBody** | [**BroadcastNotificationBody**](BroadcastNotificationBody.md)|  | 

### Return type

[**BroadcastSendResult**](BroadcastSendResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAdminAnalyticsTokens**
> AnalyticsTokenStats getAdminAnalyticsTokens(days)

AI (OpenAI) token usage and estimated cost breakdown

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final int days = 56; // int | Window size in days. Defaults to 30. Clamped 1..365.

try {
    final response = api.getAdminAnalyticsTokens(days);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getAdminAnalyticsTokens: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **days** | **int**| Window size in days. Defaults to 30. Clamped 1..365. | [optional] [default to 30]

### Return type

[**AnalyticsTokenStats**](AnalyticsTokenStats.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAdminAnalyticsUsage**
> AnalyticsUsageStats getAdminAnalyticsUsage(days)

Feature-usage, device, browser, and country breakdown from analytics events

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final int days = 56; // int | Window size in days. Defaults to 30. Clamped 1..365.

try {
    final response = api.getAdminAnalyticsUsage(days);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getAdminAnalyticsUsage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **days** | **int**| Window size in days. Defaults to 30. Clamped 1..365. | [optional] [default to 30]

### Return type

[**AnalyticsUsageStats**](AnalyticsUsageStats.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAdminFeedback**
> AdminFeedbackList getAdminFeedback(page, limit, search, feedbackType, from, to, analysisId)

List user feedback rows (admin only)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final int page = 56; // int | 
final int limit = 56; // int | 
final String search = search_example; // String | Free-text ILIKE filter matched against the user's email or the analysis instrument
final String feedbackType = feedbackType_example; // String | Restrict to a single feedback reaction
final Date from = 2013-10-20; // Date | Only include feedback created on or after this date (ISO 8601 date)
final Date to = 2013-10-20; // Date | Only include feedback created on or before this date (ISO 8601 date, inclusive end-of-day)
final int analysisId = 56; // int | When set, only return feedback for the given analysis id.

try {
    final response = api.getAdminFeedback(page, limit, search, feedbackType, from, to, analysisId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getAdminFeedback: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**|  | [optional] [default to 1]
 **limit** | **int**|  | [optional] [default to 50]
 **search** | **String**| Free-text ILIKE filter matched against the user's email or the analysis instrument | [optional] 
 **feedbackType** | **String**| Restrict to a single feedback reaction | [optional] 
 **from** | **Date**| Only include feedback created on or after this date (ISO 8601 date) | [optional] 
 **to** | **Date**| Only include feedback created on or before this date (ISO 8601 date, inclusive end-of-day) | [optional] 
 **analysisId** | **int**| When set, only return feedback for the given analysis id. | [optional] 

### Return type

[**AdminFeedbackList**](AdminFeedbackList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAdminStats**
> AdminStats getAdminStats()

Get admin statistics

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();

try {
    final response = api.getAdminStats();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getAdminStats: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AdminStats**](AdminStats.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllAnalyses**
> AnalysesList getAllAnalyses(page, limit)

Get all analyses (admin only)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final int page = 56; // int | 
final int limit = 56; // int | 

try {
    final response = api.getAllAnalyses(page, limit);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getAllAnalyses: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**|  | [optional] [default to 1]
 **limit** | **int**|  | [optional] [default to 20]

### Return type

[**AnalysesList**](AnalysesList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getBroadcasts**
> BroadcastsList getBroadcasts(page, limit)

Broadcast history

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final int page = 56; // int | 
final int limit = 56; // int | 

try {
    final response = api.getBroadcasts(page, limit);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getBroadcasts: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**|  | [optional] [default to 1]
 **limit** | **int**|  | [optional] [default to 20]

### Return type

[**BroadcastsList**](BroadcastsList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOutboundClickStats**
> OutboundClickStats getOutboundClickStats(days)

Aggregated counts of sponsor / partner outbound link clicks

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final int days = 56; // int | Window size for the \"recent\" totals. Defaults to 30. Clamped 1..365.

try {
    final response = api.getOutboundClickStats(days);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getOutboundClickStats: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **days** | **int**| Window size for the \"recent\" totals. Defaults to 30. Clamped 1..365. | [optional] [default to 30]

### Return type

[**OutboundClickStats**](OutboundClickStats.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPendingTopupRequests**
> TopupRequestWithUserList getPendingTopupRequests(status, page, limit)

List top-up requests for admin review

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final String status = status_example; // String | Filter by review status; defaults to pending
final int page = 56; // int | 
final int limit = 56; // int | 

try {
    final response = api.getPendingTopupRequests(status, page, limit);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getPendingTopupRequests: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **String**| Filter by review status; defaults to pending | [optional] [default to 'pending']
 **page** | **int**|  | [optional] [default to 1]
 **limit** | **int**|  | [optional] [default to 20]

### Return type

[**TopupRequestWithUserList**](TopupRequestWithUserList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProgressionAudit**
> ProgressionAudit getProgressionAudit(userId)

Read-only progression ledger audit; never a leaderboard

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final int userId = 56; // int | 

try {
    final response = api.getProgressionAudit(userId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getProgressionAudit: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **int**|  | [optional] 

### Return type

[**ProgressionAudit**](ProgressionAudit.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTopupSummary**
> TopupSummary getTopupSummary()

Aggregate revenue/credits summary across all approved top-up requests, grouped by user and by calendar month

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();

try {
    final response = api.getTopupSummary();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->getTopupSummary: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TopupSummary**](TopupSummary.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reviewCreditTopupRequest**
> TopupRequest reviewCreditTopupRequest(id, reviewTopupRequestBody)

Approve or reject a top-up request, crediting the user's balance on approval

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAdminApi();
final int id = 56; // int | 
final ReviewTopupRequestBody reviewTopupRequestBody = ; // ReviewTopupRequestBody | 

try {
    final response = api.reviewCreditTopupRequest(id, reviewTopupRequestBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AdminApi->reviewCreditTopupRequest: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **reviewTopupRequestBody** | [**ReviewTopupRequestBody**](ReviewTopupRequestBody.md)|  | 

### Return type

[**TopupRequest**](TopupRequest.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

