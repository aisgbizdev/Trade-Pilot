# trade_pilot_api_client.model.BroadcastNotificationBody

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **String** |  | 
**message** | **String** |  | 
**type** | **String** |  | [optional] [default to 'info']
**audienceType** | **String** |  | [optional] [default to 'all']
**audienceValue** | **String** | Role name when audienceType=role; tag name when audienceType=tag | [optional] 
**targetRole** | **String** | Deprecated: use audienceType=role + audienceValue instead | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


