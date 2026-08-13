# trade_pilot_api_client.model.PushPrefs

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pushExpiry** | **bool** |  | 
**pushBroadcast** | **bool** |  | 
**pushDailySummary** | **bool** |  | 
**pushMarketNews** | **bool** |  | 
**pushCalendarEvents** | **bool** |  | 
**pushPriceAnomaly** | **bool** |  | 
**pushWeeklyRecap** | **bool** |  | 
**pushSignalFlip** | **bool** |  | 
**marketOpenSessions** | **BuiltList&lt;String&gt;** | FX sessions the user wants a 5-min pre-open ping for. Empty = off. | 
**pushDormancyNudge** | **bool** | Opt-in toggle for the weekly \"we miss you\" nudge after 7+ days idle. | 
**pushOnboarding** | **bool** | One-shot 24h-after-signup empty-watchlist nudge. | 
**disengageNoticeCategory** | **String** | When non-null, the UI should render a one-time banner explaining auto-pause. | [optional] 
**guardrailRevenge** | **bool** | Show soft warning when a loss on this instrument fired within the revenge window. | 
**guardrailOvertrading** | **bool** | Show soft warning when the user crosses the per-hour or per-day analysis count. | 
**guardrailHighRisk** | **bool** | Show soft warning when a high-impact event for the instrument prints within 30 min. | 
**coolingOffEnabled** | **bool** | Opt-in 30-minute countdown after a significant loss before showing the analyse button warning. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


