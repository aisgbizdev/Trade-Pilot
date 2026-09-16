// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'apple_reauth_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AppleReauthBody extends AppleReauthBody {
  @override
  final String identityToken;
  @override
  final String authorizationCode;
  @override
  final String nonce;

  factory _$AppleReauthBody([void Function(AppleReauthBodyBuilder)? updates]) =>
      (AppleReauthBodyBuilder()..update(updates))._build();

  _$AppleReauthBody._(
      {required this.identityToken,
      required this.authorizationCode,
      required this.nonce})
      : super._();
  @override
  AppleReauthBody rebuild(void Function(AppleReauthBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AppleReauthBodyBuilder toBuilder() => AppleReauthBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AppleReauthBody &&
        identityToken == other.identityToken &&
        authorizationCode == other.authorizationCode &&
        nonce == other.nonce;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, identityToken.hashCode);
    _$hash = $jc(_$hash, authorizationCode.hashCode);
    _$hash = $jc(_$hash, nonce.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AppleReauthBody')
          ..add('identityToken', identityToken)
          ..add('authorizationCode', authorizationCode)
          ..add('nonce', nonce))
        .toString();
  }
}

class AppleReauthBodyBuilder
    implements Builder<AppleReauthBody, AppleReauthBodyBuilder> {
  _$AppleReauthBody? _$v;

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

  AppleReauthBodyBuilder() {
    AppleReauthBody._defaults(this);
  }

  AppleReauthBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _identityToken = $v.identityToken;
      _authorizationCode = $v.authorizationCode;
      _nonce = $v.nonce;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AppleReauthBody other) {
    _$v = other as _$AppleReauthBody;
  }

  @override
  void update(void Function(AppleReauthBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AppleReauthBody build() => _build();

  _$AppleReauthBody _build() {
    final _$result = _$v ??
        _$AppleReauthBody._(
          identityToken: BuiltValueNullFieldError.checkNotNull(
              identityToken, r'AppleReauthBody', 'identityToken'),
          authorizationCode: BuiltValueNullFieldError.checkNotNull(
              authorizationCode, r'AppleReauthBody', 'authorizationCode'),
          nonce: BuiltValueNullFieldError.checkNotNull(
              nonce, r'AppleReauthBody', 'nonce'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
