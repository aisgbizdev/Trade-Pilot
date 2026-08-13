// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_usage_stats_device_breakdown_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsUsageStatsDeviceBreakdownInner
    extends AnalyticsUsageStatsDeviceBreakdownInner {
  @override
  final String deviceType;
  @override
  final int count;

  factory _$AnalyticsUsageStatsDeviceBreakdownInner(
          [void Function(AnalyticsUsageStatsDeviceBreakdownInnerBuilder)?
              updates]) =>
      (AnalyticsUsageStatsDeviceBreakdownInnerBuilder()..update(updates))
          ._build();

  _$AnalyticsUsageStatsDeviceBreakdownInner._(
      {required this.deviceType, required this.count})
      : super._();
  @override
  AnalyticsUsageStatsDeviceBreakdownInner rebuild(
          void Function(AnalyticsUsageStatsDeviceBreakdownInnerBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsUsageStatsDeviceBreakdownInnerBuilder toBuilder() =>
      AnalyticsUsageStatsDeviceBreakdownInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsUsageStatsDeviceBreakdownInner &&
        deviceType == other.deviceType &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, deviceType.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'AnalyticsUsageStatsDeviceBreakdownInner')
          ..add('deviceType', deviceType)
          ..add('count', count))
        .toString();
  }
}

class AnalyticsUsageStatsDeviceBreakdownInnerBuilder
    implements
        Builder<AnalyticsUsageStatsDeviceBreakdownInner,
            AnalyticsUsageStatsDeviceBreakdownInnerBuilder> {
  _$AnalyticsUsageStatsDeviceBreakdownInner? _$v;

  String? _deviceType;
  String? get deviceType => _$this._deviceType;
  set deviceType(String? deviceType) => _$this._deviceType = deviceType;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  AnalyticsUsageStatsDeviceBreakdownInnerBuilder() {
    AnalyticsUsageStatsDeviceBreakdownInner._defaults(this);
  }

  AnalyticsUsageStatsDeviceBreakdownInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _deviceType = $v.deviceType;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsUsageStatsDeviceBreakdownInner other) {
    _$v = other as _$AnalyticsUsageStatsDeviceBreakdownInner;
  }

  @override
  void update(
      void Function(AnalyticsUsageStatsDeviceBreakdownInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsUsageStatsDeviceBreakdownInner build() => _build();

  _$AnalyticsUsageStatsDeviceBreakdownInner _build() {
    final _$result = _$v ??
        _$AnalyticsUsageStatsDeviceBreakdownInner._(
          deviceType: BuiltValueNullFieldError.checkNotNull(deviceType,
              r'AnalyticsUsageStatsDeviceBreakdownInner', 'deviceType'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'AnalyticsUsageStatsDeviceBreakdownInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
