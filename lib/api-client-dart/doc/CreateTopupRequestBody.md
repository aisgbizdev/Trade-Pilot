# trade_pilot_api_client.model.CreateTopupRequestBody

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amountRupiah** | **int** | Must match the amountRupiah of one of the packages from GET /topups/config exactly. | 
**paymentReferenceNote** | **String** |  | [optional] 
**proofObjectPath** | **String** | Object path of the uploaded transfer-proof image. Required — admin review has no other way to verify a manual transfer. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


