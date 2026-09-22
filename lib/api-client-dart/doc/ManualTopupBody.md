# trade_pilot_api_client.model.ManualTopupBody

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **int** |  | 
**amountRupiah** | **int** | Not constrained to the fixed packages — admins can grant any amount/credits pair to resolve a top-up support case (e.g. a payment confirmed outside the app after proof upload failed). | 
**credits** | **int** |  | 
**note** | **String** | Required audit trail — this bypasses the normal proof-upload verification entirely, so the reason must be recorded. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


