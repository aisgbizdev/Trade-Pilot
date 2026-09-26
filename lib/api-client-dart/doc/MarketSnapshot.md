# trade_pilot_api_client.model.MarketSnapshot

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instrument** | **String** |  | 
**timeframe** | **String** |  | 
**capturedAt** | [**DateTime**](DateTime.md) |  | 
**sourceFetchedAt** | [**DateTime**](DateTime.md) |  | 
**candles** | [**BuiltList&lt;MarketSnapshotCandle&gt;**](MarketSnapshotCandle.md) |  | 
**priceAtAnalysis** | **num** | Exact price anchor passed to AI generation, when available. | 
**sourceStatus** | **String** |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


