// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'standard_trading_rule_account.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$StandardTradingRuleAccount extends StandardTradingRuleAccount {
  @override
  final num minimumDepositUsd;
  @override
  final num minimumLot;
  @override
  final num maximumLot;
  @override
  final num maintenanceMarginPercent;
  @override
  final num marginCallBelowPercent;
  @override
  final num marginCallRestorePercent;
  @override
  final num autoLiquidationAtOrBelowPercent;
  @override
  final num equityReviewThresholdUsd;
  @override
  final num equityReviewThresholdIdr;

  factory _$StandardTradingRuleAccount(
          [void Function(StandardTradingRuleAccountBuilder)? updates]) =>
      (StandardTradingRuleAccountBuilder()..update(updates))._build();

  _$StandardTradingRuleAccount._(
      {required this.minimumDepositUsd,
      required this.minimumLot,
      required this.maximumLot,
      required this.maintenanceMarginPercent,
      required this.marginCallBelowPercent,
      required this.marginCallRestorePercent,
      required this.autoLiquidationAtOrBelowPercent,
      required this.equityReviewThresholdUsd,
      required this.equityReviewThresholdIdr})
      : super._();
  @override
  StandardTradingRuleAccount rebuild(
          void Function(StandardTradingRuleAccountBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  StandardTradingRuleAccountBuilder toBuilder() =>
      StandardTradingRuleAccountBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StandardTradingRuleAccount &&
        minimumDepositUsd == other.minimumDepositUsd &&
        minimumLot == other.minimumLot &&
        maximumLot == other.maximumLot &&
        maintenanceMarginPercent == other.maintenanceMarginPercent &&
        marginCallBelowPercent == other.marginCallBelowPercent &&
        marginCallRestorePercent == other.marginCallRestorePercent &&
        autoLiquidationAtOrBelowPercent ==
            other.autoLiquidationAtOrBelowPercent &&
        equityReviewThresholdUsd == other.equityReviewThresholdUsd &&
        equityReviewThresholdIdr == other.equityReviewThresholdIdr;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, minimumDepositUsd.hashCode);
    _$hash = $jc(_$hash, minimumLot.hashCode);
    _$hash = $jc(_$hash, maximumLot.hashCode);
    _$hash = $jc(_$hash, maintenanceMarginPercent.hashCode);
    _$hash = $jc(_$hash, marginCallBelowPercent.hashCode);
    _$hash = $jc(_$hash, marginCallRestorePercent.hashCode);
    _$hash = $jc(_$hash, autoLiquidationAtOrBelowPercent.hashCode);
    _$hash = $jc(_$hash, equityReviewThresholdUsd.hashCode);
    _$hash = $jc(_$hash, equityReviewThresholdIdr.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'StandardTradingRuleAccount')
          ..add('minimumDepositUsd', minimumDepositUsd)
          ..add('minimumLot', minimumLot)
          ..add('maximumLot', maximumLot)
          ..add('maintenanceMarginPercent', maintenanceMarginPercent)
          ..add('marginCallBelowPercent', marginCallBelowPercent)
          ..add('marginCallRestorePercent', marginCallRestorePercent)
          ..add('autoLiquidationAtOrBelowPercent',
              autoLiquidationAtOrBelowPercent)
          ..add('equityReviewThresholdUsd', equityReviewThresholdUsd)
          ..add('equityReviewThresholdIdr', equityReviewThresholdIdr))
        .toString();
  }
}

class StandardTradingRuleAccountBuilder
    implements
        Builder<StandardTradingRuleAccount, StandardTradingRuleAccountBuilder> {
  _$StandardTradingRuleAccount? _$v;

  num? _minimumDepositUsd;
  num? get minimumDepositUsd => _$this._minimumDepositUsd;
  set minimumDepositUsd(num? minimumDepositUsd) =>
      _$this._minimumDepositUsd = minimumDepositUsd;

  num? _minimumLot;
  num? get minimumLot => _$this._minimumLot;
  set minimumLot(num? minimumLot) => _$this._minimumLot = minimumLot;

  num? _maximumLot;
  num? get maximumLot => _$this._maximumLot;
  set maximumLot(num? maximumLot) => _$this._maximumLot = maximumLot;

  num? _maintenanceMarginPercent;
  num? get maintenanceMarginPercent => _$this._maintenanceMarginPercent;
  set maintenanceMarginPercent(num? maintenanceMarginPercent) =>
      _$this._maintenanceMarginPercent = maintenanceMarginPercent;

  num? _marginCallBelowPercent;
  num? get marginCallBelowPercent => _$this._marginCallBelowPercent;
  set marginCallBelowPercent(num? marginCallBelowPercent) =>
      _$this._marginCallBelowPercent = marginCallBelowPercent;

  num? _marginCallRestorePercent;
  num? get marginCallRestorePercent => _$this._marginCallRestorePercent;
  set marginCallRestorePercent(num? marginCallRestorePercent) =>
      _$this._marginCallRestorePercent = marginCallRestorePercent;

  num? _autoLiquidationAtOrBelowPercent;
  num? get autoLiquidationAtOrBelowPercent =>
      _$this._autoLiquidationAtOrBelowPercent;
  set autoLiquidationAtOrBelowPercent(num? autoLiquidationAtOrBelowPercent) =>
      _$this._autoLiquidationAtOrBelowPercent = autoLiquidationAtOrBelowPercent;

  num? _equityReviewThresholdUsd;
  num? get equityReviewThresholdUsd => _$this._equityReviewThresholdUsd;
  set equityReviewThresholdUsd(num? equityReviewThresholdUsd) =>
      _$this._equityReviewThresholdUsd = equityReviewThresholdUsd;

  num? _equityReviewThresholdIdr;
  num? get equityReviewThresholdIdr => _$this._equityReviewThresholdIdr;
  set equityReviewThresholdIdr(num? equityReviewThresholdIdr) =>
      _$this._equityReviewThresholdIdr = equityReviewThresholdIdr;

  StandardTradingRuleAccountBuilder() {
    StandardTradingRuleAccount._defaults(this);
  }

  StandardTradingRuleAccountBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _minimumDepositUsd = $v.minimumDepositUsd;
      _minimumLot = $v.minimumLot;
      _maximumLot = $v.maximumLot;
      _maintenanceMarginPercent = $v.maintenanceMarginPercent;
      _marginCallBelowPercent = $v.marginCallBelowPercent;
      _marginCallRestorePercent = $v.marginCallRestorePercent;
      _autoLiquidationAtOrBelowPercent = $v.autoLiquidationAtOrBelowPercent;
      _equityReviewThresholdUsd = $v.equityReviewThresholdUsd;
      _equityReviewThresholdIdr = $v.equityReviewThresholdIdr;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(StandardTradingRuleAccount other) {
    _$v = other as _$StandardTradingRuleAccount;
  }

  @override
  void update(void Function(StandardTradingRuleAccountBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  StandardTradingRuleAccount build() => _build();

  _$StandardTradingRuleAccount _build() {
    final _$result = _$v ??
        _$StandardTradingRuleAccount._(
          minimumDepositUsd: BuiltValueNullFieldError.checkNotNull(
              minimumDepositUsd,
              r'StandardTradingRuleAccount',
              'minimumDepositUsd'),
          minimumLot: BuiltValueNullFieldError.checkNotNull(
              minimumLot, r'StandardTradingRuleAccount', 'minimumLot'),
          maximumLot: BuiltValueNullFieldError.checkNotNull(
              maximumLot, r'StandardTradingRuleAccount', 'maximumLot'),
          maintenanceMarginPercent: BuiltValueNullFieldError.checkNotNull(
              maintenanceMarginPercent,
              r'StandardTradingRuleAccount',
              'maintenanceMarginPercent'),
          marginCallBelowPercent: BuiltValueNullFieldError.checkNotNull(
              marginCallBelowPercent,
              r'StandardTradingRuleAccount',
              'marginCallBelowPercent'),
          marginCallRestorePercent: BuiltValueNullFieldError.checkNotNull(
              marginCallRestorePercent,
              r'StandardTradingRuleAccount',
              'marginCallRestorePercent'),
          autoLiquidationAtOrBelowPercent:
              BuiltValueNullFieldError.checkNotNull(
                  autoLiquidationAtOrBelowPercent,
                  r'StandardTradingRuleAccount',
                  'autoLiquidationAtOrBelowPercent'),
          equityReviewThresholdUsd: BuiltValueNullFieldError.checkNotNull(
              equityReviewThresholdUsd,
              r'StandardTradingRuleAccount',
              'equityReviewThresholdUsd'),
          equityReviewThresholdIdr: BuiltValueNullFieldError.checkNotNull(
              equityReviewThresholdIdr,
              r'StandardTradingRuleAccount',
              'equityReviewThresholdIdr'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
