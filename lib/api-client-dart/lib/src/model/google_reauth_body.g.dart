// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_reauth_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GoogleReauthBody extends GoogleReauthBody {
  @override
  final String idToken;

  factory _$GoogleReauthBody(
          [void Function(GoogleReauthBodyBuilder)? updates]) =>
      (GoogleReauthBodyBuilder()..update(updates))._build();

  _$GoogleReauthBody._({required this.idToken}) : super._();
  @override
  GoogleReauthBody rebuild(void Function(GoogleReauthBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GoogleReauthBodyBuilder toBuilder() =>
      GoogleReauthBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GoogleReauthBody && idToken == other.idToken;
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
    return (newBuiltValueToStringHelper(r'GoogleReauthBody')
          ..add('idToken', idToken))
        .toString();
  }
}

class GoogleReauthBodyBuilder
    implements Builder<GoogleReauthBody, GoogleReauthBodyBuilder> {
  _$GoogleReauthBody? _$v;

  String? _idToken;
  String? get idToken => _$this._idToken;
  set idToken(String? idToken) => _$this._idToken = idToken;

  GoogleReauthBodyBuilder() {
    GoogleReauthBody._defaults(this);
  }

  GoogleReauthBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _idToken = $v.idToken;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(GoogleReauthBody other) {
    _$v = other as _$GoogleReauthBody;
  }

  @override
  void update(void Function(GoogleReauthBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GoogleReauthBody build() => _build();

  _$GoogleReauthBody _build() {
    final _$result = _$v ??
        _$GoogleReauthBody._(
          idToken: BuiltValueNullFieldError.checkNotNull(
              idToken, r'GoogleReauthBody', 'idToken'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
