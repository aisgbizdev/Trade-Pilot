# trade_pilot_api_client.api.AnalysesApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**armAnalysisAlerts**](AnalysesApi.md#armanalysisalerts) | **POST** /analyses/{id}/alerts | Arm price alerts for an analysis
[**cancelAnalysisAlerts**](AnalysesApi.md#cancelanalysisalerts) | **DELETE** /analyses/{id}/alerts | Cancel any un-fired price alerts for an analysis
[**createAnalysis**](AnalysesApi.md#createanalysis) | **POST** /analyses | Create new analysis (triggers AI)
[**getAnalysesSummary**](AnalysesApi.md#getanalysessummary) | **GET** /analyses/summary | Get dashboard summary stats
[**getAnalysis**](AnalysesApi.md#getanalysis) | **GET** /analyses/{id} | Get single analysis
[**getAnalysisAlerts**](AnalysesApi.md#getanalysisalerts) | **GET** /analyses/{id}/alerts | Get price-alert status for an analysis
[**getAnalysisOutcomesSummary**](AnalysesApi.md#getanalysisoutcomessummary) | **GET** /analyses/outcomes-summary | AI trade-plan outcome roll-up over the last 30 days
[**getAnalysisQuota**](AnalysesApi.md#getanalysisquota) | **GET** /analyses/quota | Get current user&#39;s analysis quota usage
[**getMarketIntelligence**](AnalysesApi.md#getmarketintelligence) | **GET** /analyses/{id}/market-intelligence | Recheck live market conditions for a saved analysis
[**getPersonalAnalytics**](AnalysesApi.md#getpersonalanalytics) | **GET** /analyses/personal-analytics | Get personal analytics data
[**getRecentInstruments**](AnalysesApi.md#getrecentinstruments) | **GET** /analyses/recent-instruments | Get 3 most recently analyzed instruments
[**listAnalyses**](AnalysesApi.md#listanalyses) | **GET** /analyses | List user&#39;s analyses with filters
[**refreshFundamentals**](AnalysesApi.md#refreshfundamentals) | **POST** /analyses/{id}/refresh-fundamentals | Re-fetch news + economic calendar for an existing analysis (no AI re-run)
[**setAnalysisNote**](AnalysesApi.md#setanalysisnote) | **PUT** /analyses/{id}/note | Save the user&#39;s private trading-journal note for an analysis
[**submitFeedback**](AnalysesApi.md#submitfeedback) | **POST** /analyses/{id}/feedback | Submit feedback for analysis


# **armAnalysisAlerts**
> AlertStatus armAnalysisAlerts(id)

Arm price alerts for an analysis

Arms one push alert per AI level on the preferred trade side. The background watcher polls live prices every ~30s and fires the first time each level is touched, deep-linking back to this analysis. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final int id = 56; // int | 

try {
    final response = api.armAnalysisAlerts(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->armAnalysisAlerts: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**AlertStatus**](AlertStatus.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cancelAnalysisAlerts**
> AlertStatus cancelAnalysisAlerts(id)

Cancel any un-fired price alerts for an analysis

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final int id = 56; // int | 

try {
    final response = api.cancelAnalysisAlerts(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->cancelAnalysisAlerts: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**AlertStatus**](AlertStatus.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createAnalysis**
> Analysis createAnalysis(createAnalysisBody)

Create new analysis (triggers AI)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final CreateAnalysisBody createAnalysisBody = ; // CreateAnalysisBody | 

try {
    final response = api.createAnalysis(createAnalysisBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->createAnalysis: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createAnalysisBody** | [**CreateAnalysisBody**](CreateAnalysisBody.md)|  | 

### Return type

[**Analysis**](Analysis.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAnalysesSummary**
> AnalysesSummary getAnalysesSummary()

Get dashboard summary stats

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();

try {
    final response = api.getAnalysesSummary();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->getAnalysesSummary: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AnalysesSummary**](AnalysesSummary.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAnalysis**
> Analysis getAnalysis(id)

Get single analysis

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final int id = 56; // int | 

try {
    final response = api.getAnalysis(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->getAnalysis: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**Analysis**](Analysis.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAnalysisAlerts**
> AlertStatus getAnalysisAlerts(id)

Get price-alert status for an analysis

Returns whether push alerts are armed on this analysis's AI-generated entry / SL / TP levels, and the per-level fire history. Drives the \"Alerts: ON · N levels armed\" indicator on the analysis-detail page. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final int id = 56; // int | 

try {
    final response = api.getAnalysisAlerts(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->getAnalysisAlerts: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**AlertStatus**](AlertStatus.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAnalysisOutcomesSummary**
> AnalysisOutcomesSummary getAnalysisOutcomesSummary()

AI trade-plan outcome roll-up over the last 30 days

Aggregates the after-the-fact outcomes the background resolver has written to each analysis (TP1/TP2 hit, SL hit, expired, invalidated, or still pending) for the current user over the past 30 days. Drives the \"AI accuracy\" card on the dashboard. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();

try {
    final response = api.getAnalysisOutcomesSummary();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->getAnalysisOutcomesSummary: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AnalysisOutcomesSummary**](AnalysisOutcomesSummary.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAnalysisQuota**
> AnalysisQuota getAnalysisQuota()

Get current user's analysis quota usage

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();

try {
    final response = api.getAnalysisQuota();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->getAnalysisQuota: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**AnalysisQuota**](AnalysisQuota.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMarketIntelligence**
> MarketIntelligenceResponse getMarketIntelligence(id)

Recheck live market conditions for a saved analysis

Read-only evaluation of live price, technical state, calendar and multi-source news. It never changes a Standard Plan or executes trades. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final int id = 56; // int | 

try {
    final response = api.getMarketIntelligence(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->getMarketIntelligence: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**MarketIntelligenceResponse**](MarketIntelligenceResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPersonalAnalytics**
> PersonalAnalytics getPersonalAnalytics(range)

Get personal analytics data

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final String range = range_example; // String | Time-bucket range for the chart series. `daily` returns the last 7 days, `weekly` the last 7 weeks, `monthly` the last 6 months.

try {
    final response = api.getPersonalAnalytics(range);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->getPersonalAnalytics: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **range** | **String**| Time-bucket range for the chart series. `daily` returns the last 7 days, `weekly` the last 7 weeks, `monthly` the last 6 months. | [optional] [default to 'weekly']

### Return type

[**PersonalAnalytics**](PersonalAnalytics.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRecentInstruments**
> RecentInstruments getRecentInstruments()

Get 3 most recently analyzed instruments

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();

try {
    final response = api.getRecentInstruments();
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->getRecentInstruments: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**RecentInstruments**](RecentInstruments.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAnalyses**
> AnalysesList listAnalyses(mode, instrument, instruments, timeframes, page, limit, q, from, to)

List user's analyses with filters

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final String mode = mode_example; // String | 
final String instrument = instrument_example; // String | 
final BuiltList<String> instruments = ; // BuiltList<String> | Multi-select instrument filter (repeatable). Wins over `instrument` when both provided.
final BuiltList<String> timeframes = ; // BuiltList<String> | Multi-select timeframe filter (repeatable).
final int page = 56; // int | 
final int limit = 56; // int | 
final String q = q_example; // String | Free-text search across instrument, user note, and the AI's narrative blocks (parameterised ILIKE, case-insensitive).
final Date from = 2013-10-20; // Date | Filter analyses created on or after this date (ISO 8601)
final Date to = 2013-10-20; // Date | Filter analyses created on or before this date (ISO 8601)

try {
    final response = api.listAnalyses(mode, instrument, instruments, timeframes, page, limit, q, from, to);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->listAnalyses: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mode** | **String**|  | [optional] 
 **instrument** | **String**|  | [optional] 
 **instruments** | [**BuiltList&lt;String&gt;**](String.md)| Multi-select instrument filter (repeatable). Wins over `instrument` when both provided. | [optional] 
 **timeframes** | [**BuiltList&lt;String&gt;**](String.md)| Multi-select timeframe filter (repeatable). | [optional] 
 **page** | **int**|  | [optional] [default to 1]
 **limit** | **int**|  | [optional] [default to 20]
 **q** | **String**| Free-text search across instrument, user note, and the AI's narrative blocks (parameterised ILIKE, case-insensitive). | [optional] 
 **from** | **Date**| Filter analyses created on or after this date (ISO 8601) | [optional] 
 **to** | **Date**| Filter analyses created on or before this date (ISO 8601) | [optional] 

### Return type

[**AnalysesList**](AnalysesList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshFundamentals**
> RefreshFundamentalsResponse refreshFundamentals(id)

Re-fetch news + economic calendar for an existing analysis (no AI re-run)

Re-fetches the news headlines and economic-calendar events for the analysis's instrument WITHOUT re-running the AI. Persists the fresh snapshot on the analyses row (the audit \"Fundamental Context\" card renders from this) and returns a drift report listing which of the AI's original `fundamentalCitations` no longer match anything in the fresh window. Lets the user sanity-check whether the saved AI thesis still rests on a valid fundamental base. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final int id = 56; // int | 

try {
    final response = api.refreshFundamentals(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->refreshFundamentals: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**RefreshFundamentalsResponse**](RefreshFundamentalsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setAnalysisNote**
> AnalysisNoteResponse setAnalysisNote(id, setAnalysisNoteRequest)

Save the user's private trading-journal note for an analysis

Persists a plain-text journal note scoped to this analysis and the authenticated user. Sending an empty / whitespace-only string clears the note. The note is never included in any AI prompt — it is purely a private user field for the trading-journal UI on the detail page. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final int id = 56; // int | 
final SetAnalysisNoteRequest setAnalysisNoteRequest = ; // SetAnalysisNoteRequest | 

try {
    final response = api.setAnalysisNote(id, setAnalysisNoteRequest);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->setAnalysisNote: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **setAnalysisNoteRequest** | [**SetAnalysisNoteRequest**](SetAnalysisNoteRequest.md)|  | 

### Return type

[**AnalysisNoteResponse**](AnalysisNoteResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **submitFeedback**
> Feedback submitFeedback(id, feedbackBody)

Submit feedback for analysis

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getAnalysesApi();
final int id = 56; // int | 
final FeedbackBody feedbackBody = ; // FeedbackBody | 

try {
    final response = api.submitFeedback(id, feedbackBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AnalysesApi->submitFeedback: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **feedbackBody** | [**FeedbackBody**](FeedbackBody.md)|  | 

### Return type

[**Feedback**](Feedback.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

