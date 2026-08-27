# trade_pilot_api_client.model.JournalSentiment

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instrument** | **String** |  | 
**windowDays** | **int** |  | 
**minSampleSize** | **int** |  | 
**minDistinctTraders** | **int** |  | 
**sampleSize** | **int** | Number of directional (buy/sell) entries in the window. Null when `gated` is true (suppressed to prevent membership inference on thin instruments). | 
**distinctTraders** | **int** | Number of distinct user IDs contributing entries. Null when `gated` is true. | 
**gated** | **bool** | True when sample is below thresholds; percentages, sampleSize, and distinctTraders are all null. | 
**buyPct** | **int** |  | 
**sellPct** | **int** |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


