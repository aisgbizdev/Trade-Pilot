// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reset_token_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ResetTokenResponse extends ResetTokenResponse {
  @override
  final String resetToken;
  @override
  final String message;

  factory _$ResetTokenResponse(
          [void Function(ResetTokenResponseBuilder)? updates]) =>
      (ResetTokenResponseBuilder()..update(updates))._build();

  _$ResetTokenResponse._({required this.resetToken, required this.message})
      : super._();
  @override
  ResetTokenResponse rebuild(
          void Function(ResetTokenResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ResetTokenResponseBuilder toBuilder() =>
      ResetTokenResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ResetTokenResponse &&
        resetToken == other.resetToken &&
        message == other.message;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, resetToken.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ResetTokenResponse')
          ..add('resetToken', resetToken)
          ..add('message', message))
        .toString();
  }
}

class ResetTokenResponseBuilder
    implements Builder<ResetTokenResponse, ResetTokenResponseBuilder> {
  _$ResetTokenResponse? _$v;

  String? _resetToken;
  String? get resetToken => _$this._resetToken;
  set resetToken(String? resetToken) => _$this._resetToken = resetToken;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ResetTokenResponseBuilder() {
    ResetTokenResponse._defaults(this);
  }

  ResetTokenResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _resetToken = $v.resetToken;
      _message = $v.message;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ResetTokenResponse other) {
    _$v = other as _$ResetTokenResponse;
  }

  @override
  void update(void Function(ResetTokenResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ResetTokenResponse build() => _build();

  _$ResetTokenResponse _build() {
    final _$result = _$v ??
        _$ResetTokenResponse._(
          resetToken: BuiltValueNullFieldError.checkNotNull(
              resetToken, r'ResetTokenResponse', 'resetToken'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'ResetTokenResponse', 'message'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
