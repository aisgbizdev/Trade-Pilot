// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'apple_native_login_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AppleNativeLoginBody extends AppleNativeLoginBody {
  @override
  final String identityToken;
  @override
  final String authorizationCode;
  @override
  final String nonce;
  @override
  final String? givenName;
  @override
  final String? familyName;

  factory _$AppleNativeLoginBody(
          [void Function(AppleNativeLoginBodyBuilder)? updates]) =>
      (AppleNativeLoginBodyBuilder()..update(updates))._build();

  _$AppleNativeLoginBody._(
      {required this.identityToken,
      required this.authorizationCode,
      required this.nonce,
      this.givenName,
      this.familyName})
      : super._();
  @override
  AppleNativeLoginBody rebuild(
          void Function(AppleNativeLoginBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AppleNativeLoginBodyBuilder toBuilder() =>
      AppleNativeLoginBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AppleNativeLoginBody &&
        identityToken == other.identityToken &&
        authorizationCode == other.authorizationCode &&
        nonce == other.nonce &&
        givenName == other.givenName &&
        familyName == other.familyName;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, identityToken.hashCode);
    _$hash = $jc(_$hash, authorizationCode.hashCode);
    _$hash = $jc(_$hash, nonce.hashCode);
    _$hash = $jc(_$hash, givenName.hashCode);
    _$hash = $jc(_$hash, familyName.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AppleNativeLoginBody')
          ..add('identityToken', identityToken)
          ..add('authorizationCode', authorizationCode)
          ..add('nonce', nonce)
          ..add('givenName', givenName)
          ..add('familyName', familyName))
        .toString();
  }
}

class AppleNativeLoginBodyBuilder
    implements Builder<AppleNativeLoginBody, AppleNativeLoginBodyBuilder> {
  _$AppleNativeLoginBody? _$v;

  String? _identityToken;
  String? get identityToken => _$this._identityToken;
  set identityToken(String? identityToken) =>
      _$this._identityToken = identityToken;

  String? _authorizationCode;
  String? get authorizationCode => _$this._authorizationCode;
  set authorizationCode(String? authorizationCode) =>
      _$this._authorizationCode = authorizationCode;

  String? _nonce;
  String? get nonce => _$this._nonce;
  set nonce(String? nonce) => _$this._nonce = nonce;

  String? _givenName;
  String? get givenName => _$this._givenName;
  set givenName(String? givenName) => _$this._givenName = givenName;

  String? _familyName;
  String? get familyName => _$this._familyName;
  set familyName(String? familyName) => _$this._familyName = familyName;

  AppleNativeLoginBodyBuilder() {
    AppleNativeLoginBody._defaults(this);
  }

  AppleNativeLoginBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _identityToken = $v.identityToken;
      _authorizationCode = $v.authorizationCode;
      _nonce = $v.nonce;
      _givenName = $v.givenName;
      _familyName = $v.familyName;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AppleNativeLoginBody other) {
    _$v = other as _$AppleNativeLoginBody;
  }

  @override
  void update(void Function(AppleNativeLoginBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AppleNativeLoginBody build() => _build();

  _$AppleNativeLoginBody _build() {
    final _$result = _$v ??
        _$AppleNativeLoginBody._(
          identityToken: BuiltValueNullFieldError.checkNotNull(
              identityToken, r'AppleNativeLoginBody', 'identityToken'),
          authorizationCode: BuiltValueNullFieldError.checkNotNull(
              authorizationCode, r'AppleNativeLoginBody', 'authorizationCode'),
          nonce: BuiltValueNullFieldError.checkNotNull(
              nonce, r'AppleNativeLoginBody', 'nonce'),
          givenName: givenName,
          familyName: familyName,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
