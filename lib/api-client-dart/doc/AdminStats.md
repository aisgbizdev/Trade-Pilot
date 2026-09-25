# trade_pilot_api_client.model.AdminStats

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalUsersToday** | **int** |  | 
**totalLoginsToday** | **int** | Login events today for role='user' accounts only (admin/ super_admin logins are excluded so staff dashboard visits don't inflate it), counted per event, not per distinct user — independent of totalAnalysesToday. | 
**totalLogoutsToday** | **int** | Logout events today (user-initiated or the 15-minute web idle auto-logout) for role='user' accounts only, counted per event. | 
**totalAnalysesToday** | **int** |  | 
**totalAnalysesThisWeek** | **int** |  | 
**totalAnalysesThisMonth** | **int** |  | 
**totalUsers** | **int** |  | 
**instrumentBreakdown** | [**BuiltList&lt;PersonalAnalyticsTopInstrumentsInner&gt;**](PersonalAnalyticsTopInstrumentsInner.md) |  | 
**modeBreakdown** | [**AdminStatsModeBreakdown**](AdminStatsModeBreakdown.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


