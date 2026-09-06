# trade_pilot_api_client.model.Notification

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**userId** | **int** |  | [optional] 
**targetRole** | **String** |  | [optional] 
**title** | **String** |  | 
**message** | **String** |  | 
**type** | **String** |  | 
**readAt** | [**DateTime**](DateTime.md) |  | [optional] 
**category** | **String** | Category slug used by the anti-annoyance/frequency-cap engine (e.g. \"market_news\", \"security_alert\"). Informational for clients — not itself a tap-target. | [optional] 
**actionType** | **String** | Allowlisted tap-target. Clients should treat any value they don't recognise the same as null (no special action, just mark read) so new action types can be added without breaking older clients. | [optional] 
**actionId** | **String** | The id `actionType` refers to (e.g. an analysis id for \"open_analysis\"). | [optional] 
**createdAt** | [**DateTime**](DateTime.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


