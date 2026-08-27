// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'standard_trading_rule_instrument_trading_hours.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$StandardTradingRuleInstrumentTradingHours
    extends StandardTradingRuleInstrumentTradingHours {
  @override
  final String summer;
  @override
  final String winter;

  factory _$StandardTradingRuleInstrumentTradingHours(
          [void Function(StandardTradingRuleInstrumentTradingHoursBuilder)?
              updates]) =>
      (StandardTradingRuleInstrumentTradingHoursBuilder()..update(updates))
          ._build();

  _$StandardTradingRuleInstrumentTradingHours._(
      {required this.summer, required this.winter})
      : super._();
  @override
  StandardTradingRuleInstrumentTradingHours rebuild(
          void Function(StandardTradingRuleInstrumentTradingHoursBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  StandardTradingRuleInstrumentTradingHoursBuilder toBuilder() =>
      StandardTradingRuleInstrumentTradingHoursBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StandardTradingRuleInstrumentTradingHours &&
        summer == other.summer &&
        winter == other.winter;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, summer.hashCode);
    _$hash = $jc(_$hash, winter.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'StandardTradingRuleInstrumentTradingHours')
          ..add('summer', summer)
          ..add('winter', winter))
        .toString();
  }
}

class StandardTradingRuleInstrumentTradingHoursBuilder
    implements
        Builder<StandardTradingRuleInstrumentTradingHours,
            StandardTradingRuleInstrumentTradingHoursBuilder> {
  _$StandardTradingRuleInstrumentTradingHours? _$v;

  String? _summer;
  String? get summer => _$this._summer;
  set summer(String? summer) => _$this._summer = summer;

  String? _winter;
  String? get winter => _$this._winter;
  set winter(String? winter) => _$this._winter = winter;

  StandardTradingRuleInstrumentTradingHoursBuilder() {
    StandardTradingRuleInstrumentTradingHours._defaults(this);
  }

  StandardTradingRuleInstrumentTradingHoursBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _summer = $v.summer;
      _winter = $v.winter;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(StandardTradingRuleInstrumentTradingHours other) {
    _$v = other as _$StandardTradingRuleInstrumentTradingHours;
  }

  @override
  void update(
      void Function(StandardTradingRuleInstrumentTradingHoursBuilder)?
          updates) {
    if (updates != null) updates(this);
  }

  @override
  StandardTradingRuleInstrumentTradingHours build() => _build();

  _$StandardTradingRuleInstrumentTradingHours _build() {
    final _$result = _$v ??
        _$StandardTradingRuleInstrumentTradingHours._(
          summer: BuiltValueNullFieldError.checkNotNull(
              summer, r'StandardTradingRuleInstrumentTradingHours', 'summer'),
          winter: BuiltValueNullFieldError.checkNotNull(
              winter, r'StandardTradingRuleInstrumentTradingHours', 'winter'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
