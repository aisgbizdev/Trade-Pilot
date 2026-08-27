# trade_pilot_api_client.api.TradeJournalApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createJournalEntry**](TradeJournalApi.md#createjournalentry) | **POST** /journal | Log a new manual trade-journal entry (optionally linked to an analysis)
[**deleteJournalEntry**](TradeJournalApi.md#deletejournalentry) | **DELETE** /journal/{id} | Delete a journal entry
[**getJournalEntryForAnalysis**](TradeJournalApi.md#getjournalentryforanalysis) | **GET** /journal/for-analysis/{analysisId} | Get the journal entry linked to a specific analysis
[**getJournalSentiment**](TradeJournalApi.md#getjournalsentiment) | **GET** /journal/sentiment | Anonymised long-vs-short aggregate for an instrument across all users (last 7 days)
[**getJournalStats**](TradeJournalApi.md#getjournalstats) | **GET** /journal/stats | Summary stats for the user&#39;s trade journal (win rate, avg P/L, best/worst)
[**listJournalEntries**](TradeJournalApi.md#listjournalentries) | **GET** /journal | List the current user&#39;s trade journal entries with optional filters
[**updateJournalEntry**](TradeJournalApi.md#updatejournalentry) | **PATCH** /journal/{id} | Update an existing journal entry (e.g. close out an open trade)


# **createJournalEntry**
> JournalEntry createJournalEntry(createJournalEntryBody)

Log a new manual trade-journal entry (optionally linked to an analysis)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTradeJournalApi();
final CreateJournalEntryBody createJournalEntryBody = ; // CreateJournalEntryBody | 

try {
    final response = api.createJournalEntry(createJournalEntryBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TradeJournalApi->createJournalEntry: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createJournalEntryBody** | [**CreateJournalEntryBody**](CreateJournalEntryBody.md)|  | 

### Return type

[**JournalEntry**](JournalEntry.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteJournalEntry**
> MessageResponse deleteJournalEntry(id)

Delete a journal entry

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTradeJournalApi();
final int id = 56; // int | 

try {
    final response = api.deleteJournalEntry(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TradeJournalApi->deleteJournalEntry: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getJournalEntryForAnalysis**
> JournalEntry getJournalEntryForAnalysis(analysisId)

Get the journal entry linked to a specific analysis

Returns the first journal entry the authenticated user linked to a specific analysis. Returns 404 when no entry is found.

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTradeJournalApi();
final int analysisId = 56; // int | 

try {
    final response = api.getJournalEntryForAnalysis(analysisId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TradeJournalApi->getJournalEntryForAnalysis: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **analysisId** | **int**|  | 

### Return type

[**JournalEntry**](JournalEntry.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getJournalSentiment**
> JournalSentiment getJournalSentiment(instrument)

Anonymised long-vs-short aggregate for an instrument across all users (last 7 days)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTradeJournalApi();
final String instrument = instrument_example; // String | 

try {
    final response = api.getJournalSentiment(instrument);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TradeJournalApi->getJournalSentiment: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **instrument** | **String**|  | 

### Return type

[**JournalSentiment**](JournalSentiment.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getJournalStats**
> JournalStats getJournalStats(from, to)

Summary stats for the user's trade journal (win rate, avg P/L, best/worst)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTradeJournalApi();
final DateTime from = 2013-10-20T19:20:30+01:00; // DateTime | 
final DateTime to = 2013-10-20T19:20:30+01:00; // DateTime | 

try {
    final response = api.getJournalStats(from, to);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TradeJournalApi->getJournalStats: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **from** | **DateTime**|  | [optional] 
 **to** | **DateTime**|  | [optional] 

### Return type

[**JournalStats**](JournalStats.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listJournalEntries**
> JournalEntryList listJournalEntries(instrument, outcome, from, to, limit)

List the current user's trade journal entries with optional filters

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTradeJournalApi();
final String instrument = instrument_example; // String | 
final String outcome = outcome_example; // String | 
final DateTime from = 2013-10-20T19:20:30+01:00; // DateTime | 
final DateTime to = 2013-10-20T19:20:30+01:00; // DateTime | 
final int limit = 56; // int | 

try {
    final response = api.listJournalEntries(instrument, outcome, from, to, limit);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TradeJournalApi->listJournalEntries: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **instrument** | **String**|  | [optional] 
 **outcome** | **String**|  | [optional] 
 **from** | **DateTime**|  | [optional] 
 **to** | **DateTime**|  | [optional] 
 **limit** | **int**|  | [optional] 

### Return type

[**JournalEntryList**](JournalEntryList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateJournalEntry**
> JournalEntry updateJournalEntry(id, updateJournalEntryBody)

Update an existing journal entry (e.g. close out an open trade)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getTradeJournalApi();
final int id = 56; // int | 
final UpdateJournalEntryBody updateJournalEntryBody = ; // UpdateJournalEntryBody | 

try {
    final response = api.updateJournalEntry(id, updateJournalEntryBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling TradeJournalApi->updateJournalEntry: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **updateJournalEntryBody** | [**UpdateJournalEntryBody**](UpdateJournalEntryBody.md)|  | 

### Return type

[**JournalEntry**](JournalEntry.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

