# trade_pilot_api_client.model.AnalyticsEventBody

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**eventType** | **String** | Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is | 
**path** | **String** | Route path at event time (mainly for page_view) | [optional] 
**metadata** | [**BuiltMap&lt;String, JsonObject&gt;**](JsonObject.md) | Small free-form context (e.g. {instrument, timeframe}). Capped server-side to a few KB. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


