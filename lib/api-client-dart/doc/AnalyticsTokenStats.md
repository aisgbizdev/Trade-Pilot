# trade_pilot_api_client.model.AnalyticsTokenStats

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**windowDays** | **int** |  | 
**dailyTokens** | [**BuiltList&lt;AnalyticsTokenStatsDailyTokensInner&gt;**](AnalyticsTokenStatsDailyTokensInner.md) |  | 
**byModel** | [**BuiltList&lt;AnalyticsTokenStatsByModelInner&gt;**](AnalyticsTokenStatsByModelInner.md) |  | 
**byInstrument** | [**BuiltList&lt;AnalyticsTokenStatsByInstrumentInner&gt;**](AnalyticsTokenStatsByInstrumentInner.md) |  | 
**topUsers** | [**BuiltList&lt;AnalyticsTokenStatsTopUsersInner&gt;**](AnalyticsTokenStatsTopUsersInner.md) |  | 
**totals** | [**AnalyticsTokenStatsTotals**](AnalyticsTokenStatsTotals.md) |  | 
**bySegment** | [**BuiltList&lt;AnalyticsTokenStatsBySegmentInner&gt;**](AnalyticsTokenStatsBySegmentInner.md) | Token cost + analysis volume for each cost/revenue segment (see UserWithStats.segment) — always exactly 3 entries (free, paid, dev), zero-filled for a segment with no activity in this window. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


