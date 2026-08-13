// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_usage_stats_daily_activity_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsUsageStatsDailyActivityInner
    extends AnalyticsUsageStatsDailyActivityInner {
  @override
  final String date;
  @override
  final int count;

  factory _$AnalyticsUsageStatsDailyActivityInner(
          [void Function(AnalyticsUsageStatsDailyActivityInnerBuilder)?
              updates]) =>
      (AnalyticsUsageStatsDailyActivityInnerBuilder()..update(updates))
          ._build();

  _$AnalyticsUsageStatsDailyActivityInner._(
      {required this.date, required this.count})
      : super._();
  @override
  AnalyticsUsageStatsDailyActivityInner rebuild(
          void Function(AnalyticsUsageStatsDailyActivityInnerBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsUsageStatsDailyActivityInnerBuilder toBuilder() =>
      AnalyticsUsageStatsDailyActivityInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsUsageStatsDailyActivityInner &&
        date == other.date &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, date.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'AnalyticsUsageStatsDailyActivityInner')
          ..add('date', date)
          ..add('count', count))
        .toString();
  }
}

class AnalyticsUsageStatsDailyActivityInnerBuilder
    implements
        Builder<AnalyticsUsageStatsDailyActivityInner,
            AnalyticsUsageStatsDailyActivityInnerBuilder> {
  _$AnalyticsUsageStatsDailyActivityInner? _$v;

  String? _date;
  String? get date => _$this._date;
  set date(String? date) => _$this._date = date;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  AnalyticsUsageStatsDailyActivityInnerBuilder() {
    AnalyticsUsageStatsDailyActivityInner._defaults(this);
  }

  AnalyticsUsageStatsDailyActivityInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _date = $v.date;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsUsageStatsDailyActivityInner other) {
    _$v = other as _$AnalyticsUsageStatsDailyActivityInner;
  }

  @override
  void update(
      void Function(AnalyticsUsageStatsDailyActivityInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsUsageStatsDailyActivityInner build() => _build();

  _$AnalyticsUsageStatsDailyActivityInner _build() {
    final _$result = _$v ??
        _$AnalyticsUsageStatsDailyActivityInner._(
          date: BuiltValueNullFieldError.checkNotNull(
              date, r'AnalyticsUsageStatsDailyActivityInner', 'date'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'AnalyticsUsageStatsDailyActivityInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
