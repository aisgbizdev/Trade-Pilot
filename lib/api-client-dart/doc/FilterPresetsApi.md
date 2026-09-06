# trade_pilot_api_client.api.FilterPresetsApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createFilterPreset**](FilterPresetsApi.md#createfilterpreset) | **POST** /filter-presets | Save the current filter combination as a named preset
[**deleteFilterPreset**](FilterPresetsApi.md#deletefilterpreset) | **DELETE** /filter-presets/{id} | Delete a preset
[**listFilterPresets**](FilterPresetsApi.md#listfilterpresets) | **GET** /filter-presets | List the signed-in user&#39;s saved filter presets
[**renameFilterPreset**](FilterPresetsApi.md#renamefilterpreset) | **PATCH** /filter-presets/{id} | Rename an existing preset


# **createFilterPreset**
> FilterPreset createFilterPreset(createFilterPresetBody)

Save the current filter combination as a named preset

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getFilterPresetsApi();
final CreateFilterPresetBody createFilterPresetBody = ; // CreateFilterPresetBody | 

try {
    final response = api.createFilterPreset(createFilterPresetBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling FilterPresetsApi->createFilterPreset: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createFilterPresetBody** | [**CreateFilterPresetBody**](CreateFilterPresetBody.md)|  | 

### Return type

[**FilterPreset**](FilterPreset.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteFilterPreset**
> deleteFilterPreset(id)

Delete a preset

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getFilterPresetsApi();
final int id = 56; // int | 

try {
    api.deleteFilterPreset(id);
} on DioException catch (e) {
    print('Exception when calling FilterPresetsApi->deleteFilterPreset: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listFilterPresets**
> FilterPresetList listFilterPresets()

List the signed-in user's saved filter presets

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getFilterPresetsApi();

try {
    final response = api.listFilterPresets();
    print(response);
} on DioException catch (e) {
    print('Exception when calling FilterPresetsApi->listFilterPresets: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FilterPresetList**](FilterPresetList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **renameFilterPreset**
> FilterPreset renameFilterPreset(id, renameFilterPresetBody)

Rename an existing preset

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getFilterPresetsApi();
final int id = 56; // int | 
final RenameFilterPresetBody renameFilterPresetBody = ; // RenameFilterPresetBody | 

try {
    final response = api.renameFilterPreset(id, renameFilterPresetBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling FilterPresetsApi->renameFilterPreset: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **renameFilterPresetBody** | [**RenameFilterPresetBody**](RenameFilterPresetBody.md)|  | 

### Return type

[**FilterPreset**](FilterPreset.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

