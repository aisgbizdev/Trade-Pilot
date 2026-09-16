# trade_pilot_api_client.model.User

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
**avatarUrl** | **String** | Object-storage path (e.g. `/objects/uploads/uuid`) for the user's profile photo. Null if not set. | [optional] 
**role** | **String** |  | 
**selectedMode** | **String** |  | 
**themePreference** | **String** |  | 
**onboardingCompleted** | **bool** |  | 
**hasPassword** | **bool** | True when the account has a local password usable for login and for re-authentication. False for Google-only or Apple-only accounts (use POST /auth/reauth/google or POST /auth/reauth/apple for sensitive operations). | 
**createdAt** | [**DateTime**](DateTime.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


