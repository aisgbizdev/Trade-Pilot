# trade_pilot_api_client.api.ProgressionApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getProgressionCatalog**](ProgressionApi.md#getprogressioncatalog) | **GET** /progression/catalog | Get private achievement catalog and unlock state
[**getProgressionHistory**](ProgressionApi.md#getprogressionhistory) | **GET** /progression/history | Get private append-only XP history
[**getProgressionSummary**](ProgressionApi.md#getprogressionsummary) | **GET** /progression/summary | Get the authenticated user&#39;s private progression summary
[**recordProgressionActivity**](ProgressionApi.md#recordprogressionactivity) | **POST** /progression/activity | Record a server-verifiable checklist or guide completion
[**startProgressionEvidence**](ProgressionApi.md#startprogressionevidence) | **POST** /progression/evidence | Issue a one-time server evidence token for a known guide or checklist


# **getProgressionCatalog**
> ProgressionCatalog getProgressionCatalog()

Get private achievement catalog and unlock state

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getProgressionApi();

try {
    final response = api.getProgressionCatalog();
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProgressionApi->getProgressionCatalog: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ProgressionCatalog**](ProgressionCatalog.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProgressionHistory**
> ProgressionHistory getProgressionHistory(limit)

Get private append-only XP history

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getProgressionApi();
final int limit = 56; // int | 

try {
    final response = api.getProgressionHistory(limit);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProgressionApi->getProgressionHistory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int**|  | [optional] 

### Return type

[**ProgressionHistory**](ProgressionHistory.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProgressionSummary**
> ProgressionSummary getProgressionSummary()

Get the authenticated user's private progression summary

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getProgressionApi();

try {
    final response = api.getProgressionSummary();
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProgressionApi->getProgressionSummary: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ProgressionSummary**](ProgressionSummary.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recordProgressionActivity**
> ProgressionAward recordProgressionActivity(progressionActivityInput)

Record a server-verifiable checklist or guide completion

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getProgressionApi();
final ProgressionActivityInput progressionActivityInput = ; // ProgressionActivityInput | 

try {
    final response = api.recordProgressionActivity(progressionActivityInput);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProgressionApi->recordProgressionActivity: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **progressionActivityInput** | [**ProgressionActivityInput**](ProgressionActivityInput.md)|  | 

### Return type

[**ProgressionAward**](ProgressionAward.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **startProgressionEvidence**
> ProgressionEvidenceSession startProgressionEvidence(progressionEvidenceStartInput)

Issue a one-time server evidence token for a known guide or checklist

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getProgressionApi();
final ProgressionEvidenceStartInput progressionEvidenceStartInput = ; // ProgressionEvidenceStartInput | 

try {
    final response = api.startProgressionEvidence(progressionEvidenceStartInput);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProgressionApi->startProgressionEvidence: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **progressionEvidenceStartInput** | [**ProgressionEvidenceStartInput**](ProgressionEvidenceStartInput.md)|  | 

### Return type

[**ProgressionEvidenceSession**](ProgressionEvidenceSession.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

