# trade_pilot_api_client.model.TopupPackageOption

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amountRupiah** | **int** |  | 
**credits** | **int** |  | 
**provider** | **String** | Which payment path this package must use — \"manual\" packages go through POST /topups (QRIS + proof upload), \"doku\" packages go through POST /topups/doku/checkout. Never both. | 
**adminFeeRupiah** | **int** | 0 for \"manual\" packages. For \"doku\" packages, a flat fee added on top of amountRupiah to cover DOKU's own transaction fee — the customer is charged amountRupiah + adminFeeRupiah, but credits granted are unaffected (always the package's own `credits`). | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


