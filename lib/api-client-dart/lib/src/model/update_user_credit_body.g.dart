// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_user_credit_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateUserCreditBody extends UpdateUserCreditBody {
  @override
  final int balance;

  factory _$UpdateUserCreditBody(
          [void Function(UpdateUserCreditBodyBuilder)? updates]) =>
      (UpdateUserCreditBodyBuilder()..update(updates))._build();

  _$UpdateUserCreditBody._({required this.balance}) : super._();
  @override
  UpdateUserCreditBody rebuild(
          void Function(UpdateUserCreditBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateUserCreditBodyBuilder toBuilder() =>
      UpdateUserCreditBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateUserCreditBody && balance == other.balance;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, balance.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateUserCreditBody')
          ..add('balance', balance))
        .toString();
  }
}

class UpdateUserCreditBodyBuilder
    implements Builder<UpdateUserCreditBody, UpdateUserCreditBodyBuilder> {
  _$UpdateUserCreditBody? _$v;

  int? _balance;
  int? get balance => _$this._balance;
  set balance(int? balance) => _$this._balance = balance;

  UpdateUserCreditBodyBuilder() {
    UpdateUserCreditBody._defaults(this);
  }

  UpdateUserCreditBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _balance = $v.balance;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateUserCreditBody other) {
    _$v = other as _$UpdateUserCreditBody;
  }

  @override
  void update(void Function(UpdateUserCreditBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateUserCreditBody build() => _build();

  _$UpdateUserCreditBody _build() {
    final _$result = _$v ??
        _$UpdateUserCreditBody._(
          balance: BuiltValueNullFieldError.checkNotNull(
              balance, r'UpdateUserCreditBody', 'balance'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
