// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upload_url_request.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UploadUrlRequest extends UploadUrlRequest {
  @override
  final String name;
  @override
  final int size;
  @override
  final String contentType;

  factory _$UploadUrlRequest(
          [void Function(UploadUrlRequestBuilder)? updates]) =>
      (UploadUrlRequestBuilder()..update(updates))._build();

  _$UploadUrlRequest._(
      {required this.name, required this.size, required this.contentType})
      : super._();
  @override
  UploadUrlRequest rebuild(void Function(UploadUrlRequestBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UploadUrlRequestBuilder toBuilder() =>
      UploadUrlRequestBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UploadUrlRequest &&
        name == other.name &&
        size == other.size &&
        contentType == other.contentType;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, size.hashCode);
    _$hash = $jc(_$hash, contentType.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UploadUrlRequest')
          ..add('name', name)
          ..add('size', size)
          ..add('contentType', contentType))
        .toString();
  }
}

class UploadUrlRequestBuilder
    implements Builder<UploadUrlRequest, UploadUrlRequestBuilder> {
  _$UploadUrlRequest? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  int? _size;
  int? get size => _$this._size;
  set size(int? size) => _$this._size = size;

  String? _contentType;
  String? get contentType => _$this._contentType;
  set contentType(String? contentType) => _$this._contentType = contentType;

  UploadUrlRequestBuilder() {
    UploadUrlRequest._defaults(this);
  }

  UploadUrlRequestBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _size = $v.size;
      _contentType = $v.contentType;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UploadUrlRequest other) {
    _$v = other as _$UploadUrlRequest;
  }

  @override
  void update(void Function(UploadUrlRequestBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UploadUrlRequest build() => _build();

  _$UploadUrlRequest _build() {
    final _$result = _$v ??
        _$UploadUrlRequest._(
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'UploadUrlRequest', 'name'),
          size: BuiltValueNullFieldError.checkNotNull(
              size, r'UploadUrlRequest', 'size'),
          contentType: BuiltValueNullFieldError.checkNotNull(
              contentType, r'UploadUrlRequest', 'contentType'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
