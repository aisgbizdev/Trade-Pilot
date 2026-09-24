// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_credit_balance.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserCreditBalance extends UserCreditBalance {
  @override
  final int id;
  @override
  final int creditBalance;

  factory _$UserCreditBalance(
          [void Function(UserCreditBalanceBuilder)? updates]) =>
      (UserCreditBalanceBuilder()..update(updates))._build();

  _$UserCreditBalance._({required this.id, required this.creditBalance})
      : super._();
  @override
  UserCreditBalance rebuild(void Function(UserCreditBalanceBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserCreditBalanceBuilder toBuilder() =>
      UserCreditBalanceBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserCreditBalance &&
        id == other.id &&
        creditBalance == other.creditBalance;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, creditBalance.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserCreditBalance')
          ..add('id', id)
          ..add('creditBalance', creditBalance))
        .toString();
  }
}

class UserCreditBalanceBuilder
    implements Builder<UserCreditBalance, UserCreditBalanceBuilder> {
  _$UserCreditBalance? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _creditBalance;
  int? get creditBalance => _$this._creditBalance;
  set creditBalance(int? creditBalance) =>
      _$this._creditBalance = creditBalance;

  UserCreditBalanceBuilder() {
    UserCreditBalance._defaults(this);
  }

  UserCreditBalanceBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _creditBalance = $v.creditBalance;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserCreditBalance other) {
    _$v = other as _$UserCreditBalance;
  }

  @override
  void update(void Function(UserCreditBalanceBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserCreditBalance build() => _build();

  _$UserCreditBalance _build() {
    final _$result = _$v ??
        _$UserCreditBalance._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'UserCreditBalance', 'id'),
          creditBalance: BuiltValueNullFieldError.checkNotNull(
              creditBalance, r'UserCreditBalance', 'creditBalance'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
