// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upload_url_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UploadUrlResponse extends UploadUrlResponse {
  @override
  final String uploadURL;
  @override
  final String objectPath;
  @override
  final UploadUrlRequest? metadata;

  factory _$UploadUrlResponse(
          [void Function(UploadUrlResponseBuilder)? updates]) =>
      (UploadUrlResponseBuilder()..update(updates))._build();

  _$UploadUrlResponse._(
      {required this.uploadURL, required this.objectPath, this.metadata})
      : super._();
  @override
  UploadUrlResponse rebuild(void Function(UploadUrlResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UploadUrlResponseBuilder toBuilder() =>
      UploadUrlResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UploadUrlResponse &&
        uploadURL == other.uploadURL &&
        objectPath == other.objectPath &&
        metadata == other.metadata;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, uploadURL.hashCode);
    _$hash = $jc(_$hash, objectPath.hashCode);
    _$hash = $jc(_$hash, metadata.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UploadUrlResponse')
          ..add('uploadURL', uploadURL)
          ..add('objectPath', objectPath)
          ..add('metadata', metadata))
        .toString();
  }
}

class UploadUrlResponseBuilder
    implements Builder<UploadUrlResponse, UploadUrlResponseBuilder> {
  _$UploadUrlResponse? _$v;

  String? _uploadURL;
  String? get uploadURL => _$this._uploadURL;
  set uploadURL(String? uploadURL) => _$this._uploadURL = uploadURL;

  String? _objectPath;
  String? get objectPath => _$this._objectPath;
  set objectPath(String? objectPath) => _$this._objectPath = objectPath;

  UploadUrlRequestBuilder? _metadata;
  UploadUrlRequestBuilder get metadata =>
      _$this._metadata ??= UploadUrlRequestBuilder();
  set metadata(UploadUrlRequestBuilder? metadata) =>
      _$this._metadata = metadata;

  UploadUrlResponseBuilder() {
    UploadUrlResponse._defaults(this);
  }

  UploadUrlResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _uploadURL = $v.uploadURL;
      _objectPath = $v.objectPath;
      _metadata = $v.metadata?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UploadUrlResponse other) {
    _$v = other as _$UploadUrlResponse;
  }

  @override
  void update(void Function(UploadUrlResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UploadUrlResponse build() => _build();

  _$UploadUrlResponse _build() {
    _$UploadUrlResponse _$result;
    try {
      _$result = _$v ??
          _$UploadUrlResponse._(
            uploadURL: BuiltValueNullFieldError.checkNotNull(
                uploadURL, r'UploadUrlResponse', 'uploadURL'),
            objectPath: BuiltValueNullFieldError.checkNotNull(
                objectPath, r'UploadUrlResponse', 'objectPath'),
            metadata: _metadata?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'metadata';
        _metadata?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UploadUrlResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
