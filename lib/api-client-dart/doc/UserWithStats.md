# trade_pilot_api_client.model.UserWithStats

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**email** | **String** |  | 
**displayName** | **String** |  | 
**role** | **String** |  | 
**selectedMode** | **String** |  | 
**analysisCount** | **int** |  | 
**tags** | **BuiltList&lt;String&gt;** |  | 
**customQuotaPerHour** | **int** | Per-user analysis-quota override. Null = uses the global default. | [optional] 
**customQuotaPerDay** | **int** | Per-user analysis-quota override. Null = uses the global default. | [optional] 
**createdAt** | [**DateTime**](DateTime.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


