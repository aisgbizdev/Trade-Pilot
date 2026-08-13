// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'change_password_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ChangePasswordBody extends ChangePasswordBody {
  @override
  final String currentPassword;
  @override
  final String newPassword;

  factory _$ChangePasswordBody(
          [void Function(ChangePasswordBodyBuilder)? updates]) =>
      (ChangePasswordBodyBuilder()..update(updates))._build();

  _$ChangePasswordBody._(
      {required this.currentPassword, required this.newPassword})
      : super._();
  @override
  ChangePasswordBody rebuild(
          void Function(ChangePasswordBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ChangePasswordBodyBuilder toBuilder() =>
      ChangePasswordBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ChangePasswordBody &&
        currentPassword == other.currentPassword &&
        newPassword == other.newPassword;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, currentPassword.hashCode);
    _$hash = $jc(_$hash, newPassword.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ChangePasswordBody')
          ..add('currentPassword', currentPassword)
          ..add('newPassword', newPassword))
        .toString();
  }
}

class ChangePasswordBodyBuilder
    implements Builder<ChangePasswordBody, ChangePasswordBodyBuilder> {
  _$ChangePasswordBody? _$v;

  String? _currentPassword;
  String? get currentPassword => _$this._currentPassword;
  set currentPassword(String? currentPassword) =>
      _$this._currentPassword = currentPassword;

  String? _newPassword;
  String? get newPassword => _$this._newPassword;
  set newPassword(String? newPassword) => _$this._newPassword = newPassword;

  ChangePasswordBodyBuilder() {
    ChangePasswordBody._defaults(this);
  }

  ChangePasswordBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _currentPassword = $v.currentPassword;
      _newPassword = $v.newPassword;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ChangePasswordBody other) {
    _$v = other as _$ChangePasswordBody;
  }

  @override
  void update(void Function(ChangePasswordBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ChangePasswordBody build() => _build();

  _$ChangePasswordBody _build() {
    final _$result = _$v ??
        _$ChangePasswordBody._(
          currentPassword: BuiltValueNullFieldError.checkNotNull(
              currentPassword, r'ChangePasswordBody', 'currentPassword'),
          newPassword: BuiltValueNullFieldError.checkNotNull(
              newPassword, r'ChangePasswordBody', 'newPassword'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
