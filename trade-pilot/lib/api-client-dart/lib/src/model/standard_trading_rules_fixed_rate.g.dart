// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'standard_trading_rules_fixed_rate.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$StandardTradingRulesFixedRate extends StandardTradingRulesFixedRate {
  @override
  final num usd;
  @override
  final num idr;
  @override
  final String label;

  factory _$StandardTradingRulesFixedRate(
          [void Function(StandardTradingRulesFixedRateBuilder)? updates]) =>
      (StandardTradingRulesFixedRateBuilder()..update(updates))._build();

  _$StandardTradingRulesFixedRate._(
      {required this.usd, required this.idr, required this.label})
      : super._();
  @override
  StandardTradingRulesFixedRate rebuild(
          void Function(StandardTradingRulesFixedRateBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  StandardTradingRulesFixedRateBuilder toBuilder() =>
      StandardTradingRulesFixedRateBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StandardTradingRulesFixedRate &&
        usd == other.usd &&
        idr == other.idr &&
        label == other.label;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, usd.hashCode);
    _$hash = $jc(_$hash, idr.hashCode);
    _$hash = $jc(_$hash, label.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'StandardTradingRulesFixedRate')
          ..add('usd', usd)
          ..add('idr', idr)
          ..add('label', label))
        .toString();
  }
}

class StandardTradingRulesFixedRateBuilder
    implements
        Builder<StandardTradingRulesFixedRate,
            StandardTradingRulesFixedRateBuilder> {
  _$StandardTradingRulesFixedRate? _$v;

  num? _usd;
  num? get usd => _$this._usd;
  set usd(num? usd) => _$this._usd = usd;

  num? _idr;
  num? get idr => _$this._idr;
  set idr(num? idr) => _$this._idr = idr;

  String? _label;
  String? get label => _$this._label;
  set label(String? label) => _$this._label = label;

  StandardTradingRulesFixedRateBuilder() {
    StandardTradingRulesFixedRate._defaults(this);
  }

  StandardTradingRulesFixedRateBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _usd = $v.usd;
      _idr = $v.idr;
      _label = $v.label;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(StandardTradingRulesFixedRate other) {
    _$v = other as _$StandardTradingRulesFixedRate;
  }

  @override
  void update(void Function(StandardTradingRulesFixedRateBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  StandardTradingRulesFixedRate build() => _build();

  _$StandardTradingRulesFixedRate _build() {
    final _$result = _$v ??
        _$StandardTradingRulesFixedRate._(
          usd: BuiltValueNullFieldError.checkNotNull(
              usd, r'StandardTradingRulesFixedRate', 'usd'),
          idr: BuiltValueNullFieldError.checkNotNull(
              idr, r'StandardTradingRulesFixedRate', 'idr'),
          label: BuiltValueNullFieldError.checkNotNull(
              label, r'StandardTradingRulesFixedRate', 'label'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
