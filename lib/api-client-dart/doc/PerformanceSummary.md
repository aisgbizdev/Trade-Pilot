# trade_pilot_api_client.model.PerformanceSummary

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**windowDays** | **int** |  | 
**generatedAt** | [**DateTime**](DateTime.md) |  | 
**windowStart** | [**DateTime**](DateTime.md) |  | 
**minSamples** | [**PerformanceMinSamples**](PerformanceMinSamples.md) |  | 
**overall** | [**PerformanceOverall**](PerformanceOverall.md) |  | 
**banner** | [**PerformanceBanner**](PerformanceBanner.md) |  | 
**byInstrument** | [**PerformanceSegment**](PerformanceSegment.md) |  | 
**bySession** | [**PerformanceSegment**](PerformanceSegment.md) |  | 
**byCondition** | [**PerformanceSegment**](PerformanceSegment.md) |  | 
**byVolatility** | [**PerformanceSegment**](PerformanceSegment.md) | Deterministic regime classification derived from the stored indicator tally (trending / ranging / choppy). Replaces ADX where raw OHLC isn't kept per analysis. | 
**byNewsActivity** | [**PerformanceSegment**](PerformanceSegment.md) | news_week vs quiet_week, derived from whether the AI's fundamental snapshot included any high-impact calendar event at analysis time. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


