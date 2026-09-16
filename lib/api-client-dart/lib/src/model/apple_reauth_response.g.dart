// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'apple_reauth_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AppleReauthResponse extends AppleReauthResponse {
  @override
  final String reauthToken;
  @override
  final DateTime expiresAt;

  factory _$AppleReauthResponse(
          [void Function(AppleReauthResponseBuilder)? updates]) =>
      (AppleReauthResponseBuilder()..update(updates))._build();

  _$AppleReauthResponse._({required this.reauthToken, required this.expiresAt})
      : super._();
  @override
  AppleReauthResponse rebuild(
          void Function(AppleReauthResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AppleReauthResponseBuilder toBuilder() =>
      AppleReauthResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AppleReauthResponse &&
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
    return (newBuiltValueToStringHelper(r'AppleReauthResponse')
          ..add('reauthToken', reauthToken)
          ..add('expiresAt', expiresAt))
        .toString();
  }
}

class AppleReauthResponseBuilder
    implements Builder<AppleReauthResponse, AppleReauthResponseBuilder> {
  _$AppleReauthResponse? _$v;

  String? _reauthToken;
  String? get reauthToken => _$this._reauthToken;
  set reauthToken(String? reauthToken) => _$this._reauthToken = reauthToken;

  DateTime? _expiresAt;
  DateTime? get expiresAt => _$this._expiresAt;
  set expiresAt(DateTime? expiresAt) => _$this._expiresAt = expiresAt;

  AppleReauthResponseBuilder() {
    AppleReauthResponse._defaults(this);
  }

  AppleReauthResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _reauthToken = $v.reauthToken;
      _expiresAt = $v.expiresAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AppleReauthResponse other) {
    _$v = other as _$AppleReauthResponse;
  }

  @override
  void update(void Function(AppleReauthResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AppleReauthResponse build() => _build();

  _$AppleReauthResponse _build() {
    final _$result = _$v ??
        _$AppleReauthResponse._(
          reauthToken: BuiltValueNullFieldError.checkNotNull(
              reauthToken, r'AppleReauthResponse', 'reauthToken'),
          expiresAt: BuiltValueNullFieldError.checkNotNull(
              expiresAt, r'AppleReauthResponse', 'expiresAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
