# trade_pilot_api_client.model.CreateAnalysisBody

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instrument** | **String** |  | 
**timeframe** | **String** |  | 
**userInputContext** | **String** |  | [optional] 
**mode** | **String** |  | 
**isTimeframeSwitch** | **bool** | Internal hint set only by the \"Ganti Timeframe\" quick-switch — marks this request as eligible for the free-timeframe-switch credit bonus once the free hourly/daily quota is exhausted. Never affects quota itself; omit for a fresh/manual analysis. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


