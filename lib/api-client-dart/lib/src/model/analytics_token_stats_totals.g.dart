// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_token_stats_totals.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsTokenStatsTotals extends AnalyticsTokenStatsTotals {
  @override
  final int totalTokens;
  @override
  final num totalCostUsd;
  @override
  final int totalCalls;

  factory _$AnalyticsTokenStatsTotals(
          [void Function(AnalyticsTokenStatsTotalsBuilder)? updates]) =>
      (AnalyticsTokenStatsTotalsBuilder()..update(updates))._build();

  _$AnalyticsTokenStatsTotals._(
      {required this.totalTokens,
      required this.totalCostUsd,
      required this.totalCalls})
      : super._();
  @override
  AnalyticsTokenStatsTotals rebuild(
          void Function(AnalyticsTokenStatsTotalsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsTokenStatsTotalsBuilder toBuilder() =>
      AnalyticsTokenStatsTotalsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsTokenStatsTotals &&
        totalTokens == other.totalTokens &&
        totalCostUsd == other.totalCostUsd &&
        totalCalls == other.totalCalls;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalTokens.hashCode);
    _$hash = $jc(_$hash, totalCostUsd.hashCode);
    _$hash = $jc(_$hash, totalCalls.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsTokenStatsTotals')
          ..add('totalTokens', totalTokens)
          ..add('totalCostUsd', totalCostUsd)
          ..add('totalCalls', totalCalls))
        .toString();
  }
}

class AnalyticsTokenStatsTotalsBuilder
    implements
        Builder<AnalyticsTokenStatsTotals, AnalyticsTokenStatsTotalsBuilder> {
  _$AnalyticsTokenStatsTotals? _$v;

  int? _totalTokens;
  int? get totalTokens => _$this._totalTokens;
  set totalTokens(int? totalTokens) => _$this._totalTokens = totalTokens;

  num? _totalCostUsd;
  num? get totalCostUsd => _$this._totalCostUsd;
  set totalCostUsd(num? totalCostUsd) => _$this._totalCostUsd = totalCostUsd;

  int? _totalCalls;
  int? get totalCalls => _$this._totalCalls;
  set totalCalls(int? totalCalls) => _$this._totalCalls = totalCalls;

  AnalyticsTokenStatsTotalsBuilder() {
    AnalyticsTokenStatsTotals._defaults(this);
  }

  AnalyticsTokenStatsTotalsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalTokens = $v.totalTokens;
      _totalCostUsd = $v.totalCostUsd;
      _totalCalls = $v.totalCalls;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsTokenStatsTotals other) {
    _$v = other as _$AnalyticsTokenStatsTotals;
  }

  @override
  void update(void Function(AnalyticsTokenStatsTotalsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsTokenStatsTotals build() => _build();

  _$AnalyticsTokenStatsTotals _build() {
    final _$result = _$v ??
        _$AnalyticsTokenStatsTotals._(
          totalTokens: BuiltValueNullFieldError.checkNotNull(
              totalTokens, r'AnalyticsTokenStatsTotals', 'totalTokens'),
          totalCostUsd: BuiltValueNullFieldError.checkNotNull(
              totalCostUsd, r'AnalyticsTokenStatsTotals', 'totalCostUsd'),
          totalCalls: BuiltValueNullFieldError.checkNotNull(
              totalCalls, r'AnalyticsTokenStatsTotals', 'totalCalls'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
