// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reset_user_password_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ResetUserPasswordBody extends ResetUserPasswordBody {
  @override
  final String newPassword;

  factory _$ResetUserPasswordBody(
          [void Function(ResetUserPasswordBodyBuilder)? updates]) =>
      (ResetUserPasswordBodyBuilder()..update(updates))._build();

  _$ResetUserPasswordBody._({required this.newPassword}) : super._();
  @override
  ResetUserPasswordBody rebuild(
          void Function(ResetUserPasswordBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ResetUserPasswordBodyBuilder toBuilder() =>
      ResetUserPasswordBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ResetUserPasswordBody && newPassword == other.newPassword;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, newPassword.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ResetUserPasswordBody')
          ..add('newPassword', newPassword))
        .toString();
  }
}

class ResetUserPasswordBodyBuilder
    implements Builder<ResetUserPasswordBody, ResetUserPasswordBodyBuilder> {
  _$ResetUserPasswordBody? _$v;

  String? _newPassword;
  String? get newPassword => _$this._newPassword;
  set newPassword(String? newPassword) => _$this._newPassword = newPassword;

  ResetUserPasswordBodyBuilder() {
    ResetUserPasswordBody._defaults(this);
  }

  ResetUserPasswordBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _newPassword = $v.newPassword;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ResetUserPasswordBody other) {
    _$v = other as _$ResetUserPasswordBody;
  }

  @override
  void update(void Function(ResetUserPasswordBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ResetUserPasswordBody build() => _build();

  _$ResetUserPasswordBody _build() {
    final _$result = _$v ??
        _$ResetUserPasswordBody._(
          newPassword: BuiltValueNullFieldError.checkNotNull(
              newPassword, r'ResetUserPasswordBody', 'newPassword'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
