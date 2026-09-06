# trade_pilot_api_client.model.JournalEntry

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**analysisId** | **int** | Optional FK to the originating analysis. Nulled out (but row preserved) if the analysis is later deleted. | [optional] 
**instrument** | **String** |  | 
**side** | **String** |  | 
**entryPrice** | **String** |  | [optional] 
**exitPrice** | **String** |  | [optional] 
**quantity** | **String** |  | [optional] 
**pnlAmount** | **String** | Auto-computed from (exit - entry) * direction * quantity unless the user overrode it. | [optional] 
**pnlPercent** | **String** | Auto-computed from (exit - entry) / entry * 100 (signed by side) unless the user overrode it. | [optional] 
**outcome** | **String** |  | 
**mood** | **String** |  | [optional] 
**note** | **String** |  | [optional] 
**tradedAt** | [**DateTime**](DateTime.md) |  | 
**createdAt** | [**DateTime**](DateTime.md) |  | 
**updatedAt** | [**DateTime**](DateTime.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


