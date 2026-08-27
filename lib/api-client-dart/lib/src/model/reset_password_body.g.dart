// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reset_password_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ResetPasswordBody extends ResetPasswordBody {
  @override
  final String resetToken;
  @override
  final String newPassword;

  factory _$ResetPasswordBody(
          [void Function(ResetPasswordBodyBuilder)? updates]) =>
      (ResetPasswordBodyBuilder()..update(updates))._build();

  _$ResetPasswordBody._({required this.resetToken, required this.newPassword})
      : super._();
  @override
  ResetPasswordBody rebuild(void Function(ResetPasswordBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ResetPasswordBodyBuilder toBuilder() =>
      ResetPasswordBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ResetPasswordBody &&
        resetToken == other.resetToken &&
        newPassword == other.newPassword;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, resetToken.hashCode);
    _$hash = $jc(_$hash, newPassword.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ResetPasswordBody')
          ..add('resetToken', resetToken)
          ..add('newPassword', newPassword))
        .toString();
  }
}

class ResetPasswordBodyBuilder
    implements Builder<ResetPasswordBody, ResetPasswordBodyBuilder> {
  _$ResetPasswordBody? _$v;

  String? _resetToken;
  String? get resetToken => _$this._resetToken;
  set resetToken(String? resetToken) => _$this._resetToken = resetToken;

  String? _newPassword;
  String? get newPassword => _$this._newPassword;
  set newPassword(String? newPassword) => _$this._newPassword = newPassword;

  ResetPasswordBodyBuilder() {
    ResetPasswordBody._defaults(this);
  }

  ResetPasswordBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _resetToken = $v.resetToken;
      _newPassword = $v.newPassword;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ResetPasswordBody other) {
    _$v = other as _$ResetPasswordBody;
  }

  @override
  void update(void Function(ResetPasswordBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ResetPasswordBody build() => _build();

  _$ResetPasswordBody _build() {
    final _$result = _$v ??
        _$ResetPasswordBody._(
          resetToken: BuiltValueNullFieldError.checkNotNull(
              resetToken, r'ResetPasswordBody', 'resetToken'),
          newPassword: BuiltValueNullFieldError.checkNotNull(
              newPassword, r'ResetPasswordBody', 'newPassword'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
