# trade_pilot_api_client.model.AppleNativeLoginBody

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identityToken** | **String** | Apple identity token (JWT) from the device's native Sign in with Apple SDK. Never logged. | 
**authorizationCode** | **String** | Apple authorization code from the same native sign-in. Never logged. | 
**nonce** | **String** | The RAW nonce the client generated before sending its SHA-256 hash to Apple. Never logged. | 
**givenName** | **String** | Optional, only present on the first authorization. Used only as a display-name candidate when creating a brand-new account. | [optional] 
**familyName** | **String** | Optional, only present on the first authorization. Used only as a display-name candidate when creating a brand-new account. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


