import 'package:test/test.dart';
import 'package:trade_pilot_api_client/trade_pilot_api_client.dart';


/// tests for StorageApi
void main() {
  final instance = TradePilotApiClient().getStorageApi();

  group(StorageApi, () {
    // Serve an object entity from PRIVATE_OBJECT_DIR
    //
    //Future<Uint8List> getStorageObject(String objectPath) async
    test('test getStorageObject', () async {
      // TODO
    });

    // Request a presigned URL for file upload
    //
    // Returns a presigned GCS URL for direct upload. The client sends JSON metadata here, then uploads the file directly to the returned URL. 
    //
    //Future<UploadUrlResponse> requestUploadUrl(UploadUrlRequest uploadUrlRequest) async
    test('test requestUploadUrl', () async {
      // TODO
    });

  });
}
