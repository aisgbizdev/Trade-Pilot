// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_usage_stats_feature_breakdown_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsUsageStatsFeatureBreakdownInner
    extends AnalyticsUsageStatsFeatureBreakdownInner {
  @override
  final String eventType;
  @override
  final int count;

  factory _$AnalyticsUsageStatsFeatureBreakdownInner(
          [void Function(AnalyticsUsageStatsFeatureBreakdownInnerBuilder)?
              updates]) =>
      (AnalyticsUsageStatsFeatureBreakdownInnerBuilder()..update(updates))
          ._build();

  _$AnalyticsUsageStatsFeatureBreakdownInner._(
      {required this.eventType, required this.count})
      : super._();
  @override
  AnalyticsUsageStatsFeatureBreakdownInner rebuild(
          void Function(AnalyticsUsageStatsFeatureBreakdownInnerBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsUsageStatsFeatureBreakdownInnerBuilder toBuilder() =>
      AnalyticsUsageStatsFeatureBreakdownInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsUsageStatsFeatureBreakdownInner &&
        eventType == other.eventType &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, eventType.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'AnalyticsUsageStatsFeatureBreakdownInner')
          ..add('eventType', eventType)
          ..add('count', count))
        .toString();
  }
}

class AnalyticsUsageStatsFeatureBreakdownInnerBuilder
    implements
        Builder<AnalyticsUsageStatsFeatureBreakdownInner,
            AnalyticsUsageStatsFeatureBreakdownInnerBuilder> {
  _$AnalyticsUsageStatsFeatureBreakdownInner? _$v;

  String? _eventType;
  String? get eventType => _$this._eventType;
  set eventType(String? eventType) => _$this._eventType = eventType;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  AnalyticsUsageStatsFeatureBreakdownInnerBuilder() {
    AnalyticsUsageStatsFeatureBreakdownInner._defaults(this);
  }

  AnalyticsUsageStatsFeatureBreakdownInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _eventType = $v.eventType;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsUsageStatsFeatureBreakdownInner other) {
    _$v = other as _$AnalyticsUsageStatsFeatureBreakdownInner;
  }

  @override
  void update(
      void Function(AnalyticsUsageStatsFeatureBreakdownInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsUsageStatsFeatureBreakdownInner build() => _build();

  _$AnalyticsUsageStatsFeatureBreakdownInner _build() {
    final _$result = _$v ??
        _$AnalyticsUsageStatsFeatureBreakdownInner._(
          eventType: BuiltValueNullFieldError.checkNotNull(eventType,
              r'AnalyticsUsageStatsFeatureBreakdownInner', 'eventType'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'AnalyticsUsageStatsFeatureBreakdownInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
