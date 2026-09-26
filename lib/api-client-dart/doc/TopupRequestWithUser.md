# trade_pilot_api_client.model.TopupRequestWithUser

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**userId** | **int** |  | 
**amountRupiah** | **int** |  | 
**creditsRequested** | **int** |  | 
**conversionRateSnapshot** | **int** |  | 
**paymentReferenceNote** | **String** |  | 
**proofObjectPath** | **String** |  | 
**status** | [**TopupRequestStatus**](TopupRequestStatus.md) |  | 
**reviewedByUserId** | **int** |  | 
**reviewedAt** | [**DateTime**](DateTime.md) |  | 
**reviewNote** | **String** |  | 
**creditsGranted** | **int** |  | 
**createdAt** | [**DateTime**](DateTime.md) |  | 
**paymentProvider** | **String** |  | 
**dokuPaymentUrl** | **String** | The DOKU hosted checkout page URL — present only while a \"doku\" request is still \"pending\" (lets the frontend offer a \"resume payment\" link); null otherwise. | 
**userEmail** | **String** |  | 
**userDisplayName** | **String** |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


