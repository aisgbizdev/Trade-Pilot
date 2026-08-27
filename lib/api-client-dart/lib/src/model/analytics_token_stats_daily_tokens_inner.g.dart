// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_token_stats_daily_tokens_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsTokenStatsDailyTokensInner
    extends AnalyticsTokenStatsDailyTokensInner {
  @override
  final String date;
  @override
  final int totalTokens;
  @override
  final num estimatedCostUsd;

  factory _$AnalyticsTokenStatsDailyTokensInner(
          [void Function(AnalyticsTokenStatsDailyTokensInnerBuilder)?
              updates]) =>
      (AnalyticsTokenStatsDailyTokensInnerBuilder()..update(updates))._build();

  _$AnalyticsTokenStatsDailyTokensInner._(
      {required this.date,
      required this.totalTokens,
      required this.estimatedCostUsd})
      : super._();
  @override
  AnalyticsTokenStatsDailyTokensInner rebuild(
          void Function(AnalyticsTokenStatsDailyTokensInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsTokenStatsDailyTokensInnerBuilder toBuilder() =>
      AnalyticsTokenStatsDailyTokensInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsTokenStatsDailyTokensInner &&
        date == other.date &&
        totalTokens == other.totalTokens &&
        estimatedCostUsd == other.estimatedCostUsd;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, date.hashCode);
    _$hash = $jc(_$hash, totalTokens.hashCode);
    _$hash = $jc(_$hash, estimatedCostUsd.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsTokenStatsDailyTokensInner')
          ..add('date', date)
          ..add('totalTokens', totalTokens)
          ..add('estimatedCostUsd', estimatedCostUsd))
        .toString();
  }
}

class AnalyticsTokenStatsDailyTokensInnerBuilder
    implements
        Builder<AnalyticsTokenStatsDailyTokensInner,
            AnalyticsTokenStatsDailyTokensInnerBuilder> {
  _$AnalyticsTokenStatsDailyTokensInner? _$v;

  String? _date;
  String? get date => _$this._date;
  set date(String? date) => _$this._date = date;

  int? _totalTokens;
  int? get totalTokens => _$this._totalTokens;
  set totalTokens(int? totalTokens) => _$this._totalTokens = totalTokens;

  num? _estimatedCostUsd;
  num? get estimatedCostUsd => _$this._estimatedCostUsd;
  set estimatedCostUsd(num? estimatedCostUsd) =>
      _$this._estimatedCostUsd = estimatedCostUsd;

  AnalyticsTokenStatsDailyTokensInnerBuilder() {
    AnalyticsTokenStatsDailyTokensInner._defaults(this);
  }

  AnalyticsTokenStatsDailyTokensInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _date = $v.date;
      _totalTokens = $v.totalTokens;
      _estimatedCostUsd = $v.estimatedCostUsd;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsTokenStatsDailyTokensInner other) {
    _$v = other as _$AnalyticsTokenStatsDailyTokensInner;
  }

  @override
  void update(
      void Function(AnalyticsTokenStatsDailyTokensInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsTokenStatsDailyTokensInner build() => _build();

  _$AnalyticsTokenStatsDailyTokensInner _build() {
    final _$result = _$v ??
        _$AnalyticsTokenStatsDailyTokensInner._(
          date: BuiltValueNullFieldError.checkNotNull(
              date, r'AnalyticsTokenStatsDailyTokensInner', 'date'),
          totalTokens: BuiltValueNullFieldError.checkNotNull(totalTokens,
              r'AnalyticsTokenStatsDailyTokensInner', 'totalTokens'),
          estimatedCostUsd: BuiltValueNullFieldError.checkNotNull(
              estimatedCostUsd,
              r'AnalyticsTokenStatsDailyTokensInner',
              'estimatedCostUsd'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
