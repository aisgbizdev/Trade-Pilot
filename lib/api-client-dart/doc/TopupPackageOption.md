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
**dokuMethods** | **BuiltList&lt;String&gt;** | Which DOKU Checkout methods this package may use with POST /topups/doku/checkout. Every package supports at least \"qris\"; only the smallest package doesn't also support \"va\". | 
**adminFeeRupiah** | **int** | The flat fee added on top of amountRupiah when paying via the \"va\" method (covers DOKU's own VA transaction fee) — irrelevant when only \"qris\" is chosen, which carries no fee. Credits granted are unaffected either way (always the package's own `credits`). | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


