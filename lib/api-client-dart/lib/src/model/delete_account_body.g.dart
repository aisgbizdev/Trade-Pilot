// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_account_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DeleteAccountBody extends DeleteAccountBody {
  @override
  final String currentPassword;

  factory _$DeleteAccountBody(
          [void Function(DeleteAccountBodyBuilder)? updates]) =>
      (DeleteAccountBodyBuilder()..update(updates))._build();

  _$DeleteAccountBody._({required this.currentPassword}) : super._();
  @override
  DeleteAccountBody rebuild(void Function(DeleteAccountBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DeleteAccountBodyBuilder toBuilder() =>
      DeleteAccountBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DeleteAccountBody &&
        currentPassword == other.currentPassword;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, currentPassword.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DeleteAccountBody')
          ..add('currentPassword', currentPassword))
        .toString();
  }
}

class DeleteAccountBodyBuilder
    implements Builder<DeleteAccountBody, DeleteAccountBodyBuilder> {
  _$DeleteAccountBody? _$v;

  String? _currentPassword;
  String? get currentPassword => _$this._currentPassword;
  set currentPassword(String? currentPassword) =>
      _$this._currentPassword = currentPassword;

  DeleteAccountBodyBuilder() {
    DeleteAccountBody._defaults(this);
  }

  DeleteAccountBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _currentPassword = $v.currentPassword;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DeleteAccountBody other) {
    _$v = other as _$DeleteAccountBody;
  }

  @override
  void update(void Function(DeleteAccountBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DeleteAccountBody build() => _build();

  _$DeleteAccountBody _build() {
    final _$result = _$v ??
        _$DeleteAccountBody._(
          currentPassword: BuiltValueNullFieldError.checkNotNull(
              currentPassword, r'DeleteAccountBody', 'currentPassword'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
