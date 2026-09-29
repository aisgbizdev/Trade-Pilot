# trade_pilot_api_client.model.CreateDokuCheckoutBody

## Load the model package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amountRupiah** | **int** | Must match one of the fixed packages at/above the DOKU-only threshold. | 
**method** | **String** | Which DOKU-hosted channel to restrict the checkout page to. \"va\" carries the flat admin fee on top of the package price; \"qris\" does not (DOKU's own QRIS cost isn't passed on to the customer). | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


