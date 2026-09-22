# trade_pilot_api_client.model.AdminStats

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalUsersToday** | **int** |  | 
**totalUsersActiveToday** | **int** | Distinct users who created at least one analysis today — a real usage signal, not just \"has a valid session cookie\". | 
**totalAnalysesToday** | **int** |  | 
**totalAnalysesThisWeek** | **int** |  | 
**totalAnalysesThisMonth** | **int** |  | 
**totalUsers** | **int** |  | 
**instrumentBreakdown** | [**BuiltList&lt;PersonalAnalyticsTopInstrumentsInner&gt;**](PersonalAnalyticsTopInstrumentsInner.md) |  | 
**modeBreakdown** | [**AdminStatsModeBreakdown**](AdminStatsModeBreakdown.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


