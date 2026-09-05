// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'timeframe_risk_metrics.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TimeframeRiskMetrics extends TimeframeRiskMetrics {
  @override
  final int buySignals;
  @override
  final int sellSignals;
  @override
  final int neutralSignals;
  @override
  final num rsi14;
  @override
  final num change20Pct;
  @override
  final num bollingerWidthPct;

  factory _$TimeframeRiskMetrics(
          [void Function(TimeframeRiskMetricsBuilder)? updates]) =>
      (TimeframeRiskMetricsBuilder()..update(updates))._build();

  _$TimeframeRiskMetrics._(
      {required this.buySignals,
      required this.sellSignals,
      required this.neutralSignals,
      required this.rsi14,
      required this.change20Pct,
      required this.bollingerWidthPct})
      : super._();
  @override
  TimeframeRiskMetrics rebuild(
          void Function(TimeframeRiskMetricsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TimeframeRiskMetricsBuilder toBuilder() =>
      TimeframeRiskMetricsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TimeframeRiskMetrics &&
        buySignals == other.buySignals &&
        sellSignals == other.sellSignals &&
        neutralSignals == other.neutralSignals &&
        rsi14 == other.rsi14 &&
        change20Pct == other.change20Pct &&
        bollingerWidthPct == other.bollingerWidthPct;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, buySignals.hashCode);
    _$hash = $jc(_$hash, sellSignals.hashCode);
    _$hash = $jc(_$hash, neutralSignals.hashCode);
    _$hash = $jc(_$hash, rsi14.hashCode);
    _$hash = $jc(_$hash, change20Pct.hashCode);
    _$hash = $jc(_$hash, bollingerWidthPct.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TimeframeRiskMetrics')
          ..add('buySignals', buySignals)
          ..add('sellSignals', sellSignals)
          ..add('neutralSignals', neutralSignals)
          ..add('rsi14', rsi14)
          ..add('change20Pct', change20Pct)
          ..add('bollingerWidthPct', bollingerWidthPct))
        .toString();
  }
}

class TimeframeRiskMetricsBuilder
    implements Builder<TimeframeRiskMetrics, TimeframeRiskMetricsBuilder> {
  _$TimeframeRiskMetrics? _$v;

  int? _buySignals;
  int? get buySignals => _$this._buySignals;
  set buySignals(int? buySignals) => _$this._buySignals = buySignals;

  int? _sellSignals;
  int? get sellSignals => _$this._sellSignals;
  set sellSignals(int? sellSignals) => _$this._sellSignals = sellSignals;

  int? _neutralSignals;
  int? get neutralSignals => _$this._neutralSignals;
  set neutralSignals(int? neutralSignals) =>
      _$this._neutralSignals = neutralSignals;

  num? _rsi14;
  num? get rsi14 => _$this._rsi14;
  set rsi14(num? rsi14) => _$this._rsi14 = rsi14;

  num? _change20Pct;
  num? get change20Pct => _$this._change20Pct;
  set change20Pct(num? change20Pct) => _$this._change20Pct = change20Pct;

  num? _bollingerWidthPct;
  num? get bollingerWidthPct => _$this._bollingerWidthPct;
  set bollingerWidthPct(num? bollingerWidthPct) =>
      _$this._bollingerWidthPct = bollingerWidthPct;

  TimeframeRiskMetricsBuilder() {
    TimeframeRiskMetrics._defaults(this);
  }

  TimeframeRiskMetricsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _buySignals = $v.buySignals;
      _sellSignals = $v.sellSignals;
      _neutralSignals = $v.neutralSignals;
      _rsi14 = $v.rsi14;
      _change20Pct = $v.change20Pct;
      _bollingerWidthPct = $v.bollingerWidthPct;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TimeframeRiskMetrics other) {
    _$v = other as _$TimeframeRiskMetrics;
  }

  @override
  void update(void Function(TimeframeRiskMetricsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TimeframeRiskMetrics build() => _build();

  _$TimeframeRiskMetrics _build() {
    final _$result = _$v ??
        _$TimeframeRiskMetrics._(
          buySignals: BuiltValueNullFieldError.checkNotNull(
              buySignals, r'TimeframeRiskMetrics', 'buySignals'),
          sellSignals: BuiltValueNullFieldError.checkNotNull(
              sellSignals, r'TimeframeRiskMetrics', 'sellSignals'),
          neutralSignals: BuiltValueNullFieldError.checkNotNull(
              neutralSignals, r'TimeframeRiskMetrics', 'neutralSignals'),
          rsi14: BuiltValueNullFieldError.checkNotNull(
              rsi14, r'TimeframeRiskMetrics', 'rsi14'),
          change20Pct: BuiltValueNullFieldError.checkNotNull(
              change20Pct, r'TimeframeRiskMetrics', 'change20Pct'),
          bollingerWidthPct: BuiltValueNullFieldError.checkNotNull(
              bollingerWidthPct, r'TimeframeRiskMetrics', 'bollingerWidthPct'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
