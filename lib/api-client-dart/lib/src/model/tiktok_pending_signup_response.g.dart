// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tiktok_pending_signup_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TiktokPendingSignupResponse extends TiktokPendingSignupResponse {
  @override
  final String? displayName;
  @override
  final String? avatarUrl;

  factory _$TiktokPendingSignupResponse(
          [void Function(TiktokPendingSignupResponseBuilder)? updates]) =>
      (TiktokPendingSignupResponseBuilder()..update(updates))._build();

  _$TiktokPendingSignupResponse._({this.displayName, this.avatarUrl})
      : super._();
  @override
  TiktokPendingSignupResponse rebuild(
          void Function(TiktokPendingSignupResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TiktokPendingSignupResponseBuilder toBuilder() =>
      TiktokPendingSignupResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TiktokPendingSignupResponse &&
        displayName == other.displayName &&
        avatarUrl == other.avatarUrl;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, displayName.hashCode);
    _$hash = $jc(_$hash, avatarUrl.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TiktokPendingSignupResponse')
          ..add('displayName', displayName)
          ..add('avatarUrl', avatarUrl))
        .toString();
  }
}

class TiktokPendingSignupResponseBuilder
    implements
        Builder<TiktokPendingSignupResponse,
            TiktokPendingSignupResponseBuilder> {
  _$TiktokPendingSignupResponse? _$v;

  String? _displayName;
  String? get displayName => _$this._displayName;
  set displayName(String? displayName) => _$this._displayName = displayName;

  String? _avatarUrl;
  String? get avatarUrl => _$this._avatarUrl;
  set avatarUrl(String? avatarUrl) => _$this._avatarUrl = avatarUrl;

  TiktokPendingSignupResponseBuilder() {
    TiktokPendingSignupResponse._defaults(this);
  }

  TiktokPendingSignupResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _displayName = $v.displayName;
      _avatarUrl = $v.avatarUrl;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TiktokPendingSignupResponse other) {
    _$v = other as _$TiktokPendingSignupResponse;
  }

  @override
  void update(void Function(TiktokPendingSignupResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TiktokPendingSignupResponse build() => _build();

  _$TiktokPendingSignupResponse _build() {
    final _$result = _$v ??
        _$TiktokPendingSignupResponse._(
          displayName: displayName,
          avatarUrl: avatarUrl,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
