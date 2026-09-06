# trade_pilot_api_client.api.StorageApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getStorageObject**](StorageApi.md#getstorageobject) | **GET** /storage/objects/{objectPath} | Serve an object entity from PRIVATE_OBJECT_DIR
[**requestUploadUrl**](StorageApi.md#requestuploadurl) | **POST** /storage/uploads/request-url | Request a presigned URL for file upload


# **getStorageObject**
> Uint8List getStorageObject(objectPath)

Serve an object entity from PRIVATE_OBJECT_DIR

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getStorageApi();
final String objectPath = objectPath_example; // String | 

try {
    final response = api.getStorageObject(objectPath);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StorageApi->getStorageObject: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **objectPath** | **String**|  | 

### Return type

[**Uint8List**](Uint8List.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestUploadUrl**
> UploadUrlResponse requestUploadUrl(uploadUrlRequest)

Request a presigned URL for file upload

Returns a presigned GCS URL for direct upload. The client sends JSON metadata here, then uploads the file directly to the returned URL. 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getStorageApi();
final UploadUrlRequest uploadUrlRequest = ; // UploadUrlRequest | 

try {
    final response = api.requestUploadUrl(uploadUrlRequest);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StorageApi->requestUploadUrl: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uploadUrlRequest** | [**UploadUrlRequest**](UploadUrlRequest.md)|  | 

### Return type

[**UploadUrlResponse**](UploadUrlResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

