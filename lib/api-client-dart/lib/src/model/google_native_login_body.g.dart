// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_native_login_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GoogleNativeLoginBody extends GoogleNativeLoginBody {
  @override
  final String idToken;

  factory _$GoogleNativeLoginBody(
          [void Function(GoogleNativeLoginBodyBuilder)? updates]) =>
      (GoogleNativeLoginBodyBuilder()..update(updates))._build();

  _$GoogleNativeLoginBody._({required this.idToken}) : super._();
  @override
  GoogleNativeLoginBody rebuild(
          void Function(GoogleNativeLoginBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GoogleNativeLoginBodyBuilder toBuilder() =>
      GoogleNativeLoginBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GoogleNativeLoginBody && idToken == other.idToken;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, idToken.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'GoogleNativeLoginBody')
          ..add('idToken', idToken))
        .toString();
  }
}

class GoogleNativeLoginBodyBuilder
    implements Builder<GoogleNativeLoginBody, GoogleNativeLoginBodyBuilder> {
  _$GoogleNativeLoginBody? _$v;

  String? _idToken;
  String? get idToken => _$this._idToken;
  set idToken(String? idToken) => _$this._idToken = idToken;

  GoogleNativeLoginBodyBuilder() {
    GoogleNativeLoginBody._defaults(this);
  }

  GoogleNativeLoginBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _idToken = $v.idToken;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(GoogleNativeLoginBody other) {
    _$v = other as _$GoogleNativeLoginBody;
  }

  @override
  void update(void Function(GoogleNativeLoginBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GoogleNativeLoginBody build() => _build();

  _$GoogleNativeLoginBody _build() {
    final _$result = _$v ??
        _$GoogleNativeLoginBody._(
          idToken: BuiltValueNullFieldError.checkNotNull(
              idToken, r'GoogleNativeLoginBody', 'idToken'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
