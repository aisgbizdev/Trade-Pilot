// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_quota_credits.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysisQuotaCredits extends AnalysisQuotaCredits {
  @override
  final int balance;

  factory _$AnalysisQuotaCredits(
          [void Function(AnalysisQuotaCreditsBuilder)? updates]) =>
      (AnalysisQuotaCreditsBuilder()..update(updates))._build();

  _$AnalysisQuotaCredits._({required this.balance}) : super._();
  @override
  AnalysisQuotaCredits rebuild(
          void Function(AnalysisQuotaCreditsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisQuotaCreditsBuilder toBuilder() =>
      AnalysisQuotaCreditsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysisQuotaCredits && balance == other.balance;
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
    return (newBuiltValueToStringHelper(r'AnalysisQuotaCredits')
          ..add('balance', balance))
        .toString();
  }
}

class AnalysisQuotaCreditsBuilder
    implements Builder<AnalysisQuotaCredits, AnalysisQuotaCreditsBuilder> {
  _$AnalysisQuotaCredits? _$v;

  int? _balance;
  int? get balance => _$this._balance;
  set balance(int? balance) => _$this._balance = balance;

  AnalysisQuotaCreditsBuilder() {
    AnalysisQuotaCredits._defaults(this);
  }

  AnalysisQuotaCreditsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _balance = $v.balance;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalysisQuotaCredits other) {
    _$v = other as _$AnalysisQuotaCredits;
  }

  @override
  void update(void Function(AnalysisQuotaCreditsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysisQuotaCredits build() => _build();

  _$AnalysisQuotaCredits _build() {
    final _$result = _$v ??
        _$AnalysisQuotaCredits._(
          balance: BuiltValueNullFieldError.checkNotNull(
              balance, r'AnalysisQuotaCredits', 'balance'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
