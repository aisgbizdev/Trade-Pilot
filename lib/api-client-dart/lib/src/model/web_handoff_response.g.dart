// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'web_handoff_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$WebHandoffResponse extends WebHandoffResponse {
  @override
  final String url;
  @override
  final int expiresIn;

  factory _$WebHandoffResponse(
          [void Function(WebHandoffResponseBuilder)? updates]) =>
      (WebHandoffResponseBuilder()..update(updates))._build();

  _$WebHandoffResponse._({required this.url, required this.expiresIn})
      : super._();
  @override
  WebHandoffResponse rebuild(
          void Function(WebHandoffResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  WebHandoffResponseBuilder toBuilder() =>
      WebHandoffResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is WebHandoffResponse &&
        url == other.url &&
        expiresIn == other.expiresIn;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, url.hashCode);
    _$hash = $jc(_$hash, expiresIn.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'WebHandoffResponse')
          ..add('url', url)
          ..add('expiresIn', expiresIn))
        .toString();
  }
}

class WebHandoffResponseBuilder
    implements Builder<WebHandoffResponse, WebHandoffResponseBuilder> {
  _$WebHandoffResponse? _$v;

  String? _url;
  String? get url => _$this._url;
  set url(String? url) => _$this._url = url;

  int? _expiresIn;
  int? get expiresIn => _$this._expiresIn;
  set expiresIn(int? expiresIn) => _$this._expiresIn = expiresIn;

  WebHandoffResponseBuilder() {
    WebHandoffResponse._defaults(this);
  }

  WebHandoffResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _url = $v.url;
      _expiresIn = $v.expiresIn;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(WebHandoffResponse other) {
    _$v = other as _$WebHandoffResponse;
  }

  @override
  void update(void Function(WebHandoffResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  WebHandoffResponse build() => _build();

  _$WebHandoffResponse _build() {
    final _$result = _$v ??
        _$WebHandoffResponse._(
          url: BuiltValueNullFieldError.checkNotNull(
              url, r'WebHandoffResponse', 'url'),
          expiresIn: BuiltValueNullFieldError.checkNotNull(
              expiresIn, r'WebHandoffResponse', 'expiresIn'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
