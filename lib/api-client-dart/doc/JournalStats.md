# trade_pilot_api_client.model.JournalStats

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totals** | [**JournalStatsTotals**](JournalStatsTotals.md) |  | 
**winRate** | **num** | wins / (wins + losses); null when no resolved trades. | [optional] 
**avgPnlPercent** | **num** |  | [optional] 
**avgPnlAmount** | **num** |  | [optional] 
**bestInstrument** | [**JournalGroupStat**](JournalGroupStat.md) |  | [optional] 
**worstInstrument** | [**JournalGroupStat**](JournalGroupStat.md) |  | [optional] 
**bestSession** | [**JournalGroupStat**](JournalGroupStat.md) |  | [optional] 
**worstSession** | [**JournalGroupStat**](JournalGroupStat.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


