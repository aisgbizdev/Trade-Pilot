// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_reauth_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GoogleReauthResponse extends GoogleReauthResponse {
  @override
  final String reauthToken;
  @override
  final DateTime expiresAt;

  factory _$GoogleReauthResponse(
          [void Function(GoogleReauthResponseBuilder)? updates]) =>
      (GoogleReauthResponseBuilder()..update(updates))._build();

  _$GoogleReauthResponse._({required this.reauthToken, required this.expiresAt})
      : super._();
  @override
  GoogleReauthResponse rebuild(
          void Function(GoogleReauthResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GoogleReauthResponseBuilder toBuilder() =>
      GoogleReauthResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GoogleReauthResponse &&
        reauthToken == other.reauthToken &&
        expiresAt == other.expiresAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, reauthToken.hashCode);
    _$hash = $jc(_$hash, expiresAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'GoogleReauthResponse')
          ..add('reauthToken', reauthToken)
          ..add('expiresAt', expiresAt))
        .toString();
  }
}

class GoogleReauthResponseBuilder
    implements Builder<GoogleReauthResponse, GoogleReauthResponseBuilder> {
  _$GoogleReauthResponse? _$v;

  String? _reauthToken;
  String? get reauthToken => _$this._reauthToken;
  set reauthToken(String? reauthToken) => _$this._reauthToken = reauthToken;

  DateTime? _expiresAt;
  DateTime? get expiresAt => _$this._expiresAt;
  set expiresAt(DateTime? expiresAt) => _$this._expiresAt = expiresAt;

  GoogleReauthResponseBuilder() {
    GoogleReauthResponse._defaults(this);
  }

  GoogleReauthResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _reauthToken = $v.reauthToken;
      _expiresAt = $v.expiresAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(GoogleReauthResponse other) {
    _$v = other as _$GoogleReauthResponse;
  }

  @override
  void update(void Function(GoogleReauthResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GoogleReauthResponse build() => _build();

  _$GoogleReauthResponse _build() {
    final _$result = _$v ??
        _$GoogleReauthResponse._(
          reauthToken: BuiltValueNullFieldError.checkNotNull(
              reauthToken, r'GoogleReauthResponse', 'reauthToken'),
          expiresAt: BuiltValueNullFieldError.checkNotNull(
              expiresAt, r'GoogleReauthResponse', 'expiresAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
