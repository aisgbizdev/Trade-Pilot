# trade_pilot_api_client.model.UpdateProfileBody

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**displayName** | **String** |  | [optional] 
**selectedMode** | **String** |  | [optional] 
**themePreference** | **String** |  | [optional] 
**onboardingCompleted** | **bool** |  | [optional] 
**lang** | **String** | UI language preference — synced from the client so background dispatchers (e.g. weekly trader-mirror report) render notifications in the user's chosen language. | [optional] 
**avatarUrl** | **String** | Object-storage path returned by the storage upload flow. Pass `null` to remove the current avatar. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


