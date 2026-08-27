# trade_pilot_api_client.model.AnalysisOutcomesSummary

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**rangeDays** | **int** |  | 
**total** | **int** |  | 
**pending** | **int** |  | 
**tp1Hit** | **int** |  | 
**tp2Hit** | **int** |  | 
**slHit** | **int** |  | 
**expired** | **int** |  | 
**invalidated** | **int** |  | 
**scored** | **int** | Denominator used for tpHitRate / slHitRate. Equals tp1Hit + tp2Hit + slHit + expired (excludes pending and invalidated). | 
**tpHitRate** | **num** | (tp1Hit + tp2Hit) / scored. Null when scored == 0. | [optional] 
**slHitRate** | **num** | slHit / scored. Null when scored == 0. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


