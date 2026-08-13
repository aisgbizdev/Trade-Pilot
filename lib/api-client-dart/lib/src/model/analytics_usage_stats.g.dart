// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_usage_stats.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsUsageStats extends AnalyticsUsageStats {
  @override
  final int windowDays;
  @override
  final BuiltList<AnalyticsUsageStatsDailyActivityInner> dailyActivity;
  @override
  final BuiltList<AnalyticsUsageStatsFeatureBreakdownInner> featureBreakdown;
  @override
  final BuiltList<AnalyticsUsageStatsDeviceBreakdownInner> deviceBreakdown;
  @override
  final BuiltList<AnalyticsUsageStatsBrowserBreakdownInner> browserBreakdown;
  @override
  final BuiltList<AnalyticsUsageStatsCountryBreakdownInner> countryBreakdown;

  factory _$AnalyticsUsageStats(
          [void Function(AnalyticsUsageStatsBuilder)? updates]) =>
      (AnalyticsUsageStatsBuilder()..update(updates))._build();

  _$AnalyticsUsageStats._(
      {required this.windowDays,
      required this.dailyActivity,
      required this.featureBreakdown,
      required this.deviceBreakdown,
      required this.browserBreakdown,
      required this.countryBreakdown})
      : super._();
  @override
  AnalyticsUsageStats rebuild(
          void Function(AnalyticsUsageStatsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsUsageStatsBuilder toBuilder() =>
      AnalyticsUsageStatsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsUsageStats &&
        windowDays == other.windowDays &&
        dailyActivity == other.dailyActivity &&
        featureBreakdown == other.featureBreakdown &&
        deviceBreakdown == other.deviceBreakdown &&
        browserBreakdown == other.browserBreakdown &&
        countryBreakdown == other.countryBreakdown;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, windowDays.hashCode);
    _$hash = $jc(_$hash, dailyActivity.hashCode);
    _$hash = $jc(_$hash, featureBreakdown.hashCode);
    _$hash = $jc(_$hash, deviceBreakdown.hashCode);
    _$hash = $jc(_$hash, browserBreakdown.hashCode);
    _$hash = $jc(_$hash, countryBreakdown.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsUsageStats')
          ..add('windowDays', windowDays)
          ..add('dailyActivity', dailyActivity)
          ..add('featureBreakdown', featureBreakdown)
          ..add('deviceBreakdown', deviceBreakdown)
          ..add('browserBreakdown', browserBreakdown)
          ..add('countryBreakdown', countryBreakdown))
        .toString();
  }
}

class AnalyticsUsageStatsBuilder
    implements Builder<AnalyticsUsageStats, AnalyticsUsageStatsBuilder> {
  _$AnalyticsUsageStats? _$v;

  int? _windowDays;
  int? get windowDays => _$this._windowDays;
  set windowDays(int? windowDays) => _$this._windowDays = windowDays;

  ListBuilder<AnalyticsUsageStatsDailyActivityInner>? _dailyActivity;
  ListBuilder<AnalyticsUsageStatsDailyActivityInner> get dailyActivity =>
      _$this._dailyActivity ??=
          ListBuilder<AnalyticsUsageStatsDailyActivityInner>();
  set dailyActivity(
          ListBuilder<AnalyticsUsageStatsDailyActivityInner>? dailyActivity) =>
      _$this._dailyActivity = dailyActivity;

  ListBuilder<AnalyticsUsageStatsFeatureBreakdownInner>? _featureBreakdown;
  ListBuilder<AnalyticsUsageStatsFeatureBreakdownInner> get featureBreakdown =>
      _$this._featureBreakdown ??=
          ListBuilder<AnalyticsUsageStatsFeatureBreakdownInner>();
  set featureBreakdown(
          ListBuilder<AnalyticsUsageStatsFeatureBreakdownInner>?
              featureBreakdown) =>
      _$this._featureBreakdown = featureBreakdown;

  ListBuilder<AnalyticsUsageStatsDeviceBreakdownInner>? _deviceBreakdown;
  ListBuilder<AnalyticsUsageStatsDeviceBreakdownInner> get deviceBreakdown =>
      _$this._deviceBreakdown ??=
          ListBuilder<AnalyticsUsageStatsDeviceBreakdownInner>();
  set deviceBreakdown(
          ListBuilder<AnalyticsUsageStatsDeviceBreakdownInner>?
              deviceBreakdown) =>
      _$this._deviceBreakdown = deviceBreakdown;

  ListBuilder<AnalyticsUsageStatsBrowserBreakdownInner>? _browserBreakdown;
  ListBuilder<AnalyticsUsageStatsBrowserBreakdownInner> get browserBreakdown =>
      _$this._browserBreakdown ??=
          ListBuilder<AnalyticsUsageStatsBrowserBreakdownInner>();
  set browserBreakdown(
          ListBuilder<AnalyticsUsageStatsBrowserBreakdownInner>?
              browserBreakdown) =>
      _$this._browserBreakdown = browserBreakdown;

  ListBuilder<AnalyticsUsageStatsCountryBreakdownInner>? _countryBreakdown;
  ListBuilder<AnalyticsUsageStatsCountryBreakdownInner> get countryBreakdown =>
      _$this._countryBreakdown ??=
          ListBuilder<AnalyticsUsageStatsCountryBreakdownInner>();
  set countryBreakdown(
          ListBuilder<AnalyticsUsageStatsCountryBreakdownInner>?
              countryBreakdown) =>
      _$this._countryBreakdown = countryBreakdown;

  AnalyticsUsageStatsBuilder() {
    AnalyticsUsageStats._defaults(this);
  }

  AnalyticsUsageStatsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _windowDays = $v.windowDays;
      _dailyActivity = $v.dailyActivity.toBuilder();
      _featureBreakdown = $v.featureBreakdown.toBuilder();
      _deviceBreakdown = $v.deviceBreakdown.toBuilder();
      _browserBreakdown = $v.browserBreakdown.toBuilder();
      _countryBreakdown = $v.countryBreakdown.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsUsageStats other) {
    _$v = other as _$AnalyticsUsageStats;
  }

  @override
  void update(void Function(AnalyticsUsageStatsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsUsageStats build() => _build();

  _$AnalyticsUsageStats _build() {
    _$AnalyticsUsageStats _$result;
    try {
      _$result = _$v ??
          _$AnalyticsUsageStats._(
            windowDays: BuiltValueNullFieldError.checkNotNull(
                windowDays, r'AnalyticsUsageStats', 'windowDays'),
            dailyActivity: dailyActivity.build(),
            featureBreakdown: featureBreakdown.build(),
            deviceBreakdown: deviceBreakdown.build(),
            browserBreakdown: browserBreakdown.build(),
            countryBreakdown: countryBreakdown.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'dailyActivity';
        dailyActivity.build();
        _$failedField = 'featureBreakdown';
        featureBreakdown.build();
        _$failedField = 'deviceBreakdown';
        deviceBreakdown.build();
        _$failedField = 'browserBreakdown';
        browserBreakdown.build();
        _$failedField = 'countryBreakdown';
        countryBreakdown.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AnalyticsUsageStats', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
