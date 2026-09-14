// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'credit_balance.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreditBalance extends CreditBalance {
  @override
  final int balance;

  factory _$CreditBalance([void Function(CreditBalanceBuilder)? updates]) =>
      (CreditBalanceBuilder()..update(updates))._build();

  _$CreditBalance._({required this.balance}) : super._();
  @override
  CreditBalance rebuild(void Function(CreditBalanceBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreditBalanceBuilder toBuilder() => CreditBalanceBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreditBalance && balance == other.balance;
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
    return (newBuiltValueToStringHelper(r'CreditBalance')
          ..add('balance', balance))
        .toString();
  }
}

class CreditBalanceBuilder
    implements Builder<CreditBalance, CreditBalanceBuilder> {
  _$CreditBalance? _$v;

  int? _balance;
  int? get balance => _$this._balance;
  set balance(int? balance) => _$this._balance = balance;

  CreditBalanceBuilder() {
    CreditBalance._defaults(this);
  }

  CreditBalanceBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _balance = $v.balance;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreditBalance other) {
    _$v = other as _$CreditBalance;
  }

  @override
  void update(void Function(CreditBalanceBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreditBalance build() => _build();

  _$CreditBalance _build() {
    final _$result = _$v ??
        _$CreditBalance._(
          balance: BuiltValueNullFieldError.checkNotNull(
              balance, r'CreditBalance', 'balance'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
