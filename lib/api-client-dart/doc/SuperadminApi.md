# trade_pilot_api_client.api.SuperadminApi

## Load the API package
```dart
import 'package:trade_pilot_api_client/api.dart';
```

All URIs are relative to */api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addUserTag**](SuperadminApi.md#addusertag) | **POST** /superadmin/users/{id}/tags | Add a tag to a user
[**createUser**](SuperadminApi.md#createuser) | **POST** /superadmin/users | Create new user (superadmin only)
[**deleteUser**](SuperadminApi.md#deleteuser) | **DELETE** /superadmin/users/{id} | Delete user (superadmin only)
[**getAllTags**](SuperadminApi.md#getalltags) | **GET** /superadmin/tags | List all distinct tags assigned to users
[**getAllUsers**](SuperadminApi.md#getallusers) | **GET** /superadmin/users | Get all users (superadmin only)
[**getUserTags**](SuperadminApi.md#getusertags) | **GET** /superadmin/users/{id}/tags | Get all tags for a specific user
[**removeUserTag**](SuperadminApi.md#removeusertag) | **DELETE** /superadmin/users/{id}/tags/{tag} | Remove a tag from a user
[**resetUserPassword**](SuperadminApi.md#resetuserpassword) | **PATCH** /superadmin/users/{id}/password | Reset user password (superadmin only)
[**updateUserQuota**](SuperadminApi.md#updateuserquota) | **PATCH** /superadmin/users/{id}/quota | Set or clear a per-user analysis-quota override
[**updateUserRole**](SuperadminApi.md#updateuserrole) | **PATCH** /superadmin/users/{id}/role | Update user role (superadmin only)


# **addUserTag**
> TagsList addUserTag(id, addUserTagBody)

Add a tag to a user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final int id = 56; // int | 
final AddUserTagBody addUserTagBody = ; // AddUserTagBody | 

try {
    final response = api.addUserTag(id, addUserTagBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->addUserTag: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **addUserTagBody** | [**AddUserTagBody**](AddUserTagBody.md)|  | 

### Return type

[**TagsList**](TagsList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createUser**
> User createUser(createUserBody)

Create new user (superadmin only)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final CreateUserBody createUserBody = ; // CreateUserBody | 

try {
    final response = api.createUser(createUserBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->createUser: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createUserBody** | [**CreateUserBody**](CreateUserBody.md)|  | 

### Return type

[**User**](User.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteUser**
> MessageResponse deleteUser(id)

Delete user (superadmin only)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final int id = 56; // int | 

try {
    final response = api.deleteUser(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->deleteUser: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllTags**
> TagsList getAllTags()

List all distinct tags assigned to users

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();

try {
    final response = api.getAllTags();
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->getAllTags: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**TagsList**](TagsList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllUsers**
> UsersList getAllUsers(search, page, limit)

Get all users (superadmin only)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final String search = search_example; // String | ILIKE filter on email or display name
final int page = 56; // int | 
final int limit = 56; // int | 

try {
    final response = api.getAllUsers(search, page, limit);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->getAllUsers: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search** | **String**| ILIKE filter on email or display name | [optional] 
 **page** | **int**|  | [optional] [default to 1]
 **limit** | **int**|  | [optional] [default to 50]

### Return type

[**UsersList**](UsersList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserTags**
> TagsList getUserTags(id)

Get all tags for a specific user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final int id = 56; // int | 

try {
    final response = api.getUserTags(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->getUserTags: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 

### Return type

[**TagsList**](TagsList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeUserTag**
> TagsList removeUserTag(id, tag)

Remove a tag from a user

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final int id = 56; // int | 
final String tag = tag_example; // String | 

try {
    final response = api.removeUserTag(id, tag);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->removeUserTag: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **tag** | **String**|  | 

### Return type

[**TagsList**](TagsList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resetUserPassword**
> MessageResponse resetUserPassword(id, resetUserPasswordBody)

Reset user password (superadmin only)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final int id = 56; // int | 
final ResetUserPasswordBody resetUserPasswordBody = ; // ResetUserPasswordBody | 

try {
    final response = api.resetUserPassword(id, resetUserPasswordBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->resetUserPassword: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **resetUserPasswordBody** | [**ResetUserPasswordBody**](ResetUserPasswordBody.md)|  | 

### Return type

[**MessageResponse**](MessageResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserQuota**
> UserQuota updateUserQuota(id, updateUserQuotaBody)

Set or clear a per-user analysis-quota override

Each field is either a positive integer (override for just this user) or null (clear the override, revert to the global default from PATCH /superadmin/quota-settings). 

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final int id = 56; // int | 
final UpdateUserQuotaBody updateUserQuotaBody = ; // UpdateUserQuotaBody | 

try {
    final response = api.updateUserQuota(id, updateUserQuotaBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->updateUserQuota: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **updateUserQuotaBody** | [**UpdateUserQuotaBody**](UpdateUserQuotaBody.md)|  | 

### Return type

[**UserQuota**](UserQuota.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserRole**
> User updateUserRole(id, updateUserRoleBody)

Update user role (superadmin only)

### Example
```dart
import 'package:trade_pilot_api_client/api.dart';

final api = TradePilotApiClient().getSuperadminApi();
final int id = 56; // int | 
final UpdateUserRoleBody updateUserRoleBody = ; // UpdateUserRoleBody | 

try {
    final response = api.updateUserRole(id, updateUserRoleBody);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SuperadminApi->updateUserRole: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**|  | 
 **updateUserRoleBody** | [**UpdateUserRoleBody**](UpdateUserRoleBody.md)|  | 

### Return type

[**User**](User.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

