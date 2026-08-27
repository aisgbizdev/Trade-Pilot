# trade_pilot_api_client.model.AlertLevelRow

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**level** | **String** |  | 
**side** | **String** |  | 
**price** | **String** | AI-generated level price, stored verbatim for precision. | 
**direction** | **String** | Which way price must move from the spot at arm time to fire the alert. `above` = fire when live ≥ price; `below` = fire when live ≤ price.  | 
**triggeredAt** | [**DateTime**](DateTime.md) |  | 
**triggeredPrice** | **String** | Live price the watcher saw when it fired the alert. | 
**cancelledAt** | [**DateTime**](DateTime.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


