// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_usage_stats_country_breakdown_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsUsageStatsCountryBreakdownInner
    extends AnalyticsUsageStatsCountryBreakdownInner {
  @override
  final String country;
  @override
  final int count;

  factory _$AnalyticsUsageStatsCountryBreakdownInner(
          [void Function(AnalyticsUsageStatsCountryBreakdownInnerBuilder)?
              updates]) =>
      (AnalyticsUsageStatsCountryBreakdownInnerBuilder()..update(updates))
          ._build();

  _$AnalyticsUsageStatsCountryBreakdownInner._(
      {required this.country, required this.count})
      : super._();
  @override
  AnalyticsUsageStatsCountryBreakdownInner rebuild(
          void Function(AnalyticsUsageStatsCountryBreakdownInnerBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsUsageStatsCountryBreakdownInnerBuilder toBuilder() =>
      AnalyticsUsageStatsCountryBreakdownInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsUsageStatsCountryBreakdownInner &&
        country == other.country &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, country.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'AnalyticsUsageStatsCountryBreakdownInner')
          ..add('country', country)
          ..add('count', count))
        .toString();
  }
}

class AnalyticsUsageStatsCountryBreakdownInnerBuilder
    implements
        Builder<AnalyticsUsageStatsCountryBreakdownInner,
            AnalyticsUsageStatsCountryBreakdownInnerBuilder> {
  _$AnalyticsUsageStatsCountryBreakdownInner? _$v;

  String? _country;
  String? get country => _$this._country;
  set country(String? country) => _$this._country = country;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  AnalyticsUsageStatsCountryBreakdownInnerBuilder() {
    AnalyticsUsageStatsCountryBreakdownInner._defaults(this);
  }

  AnalyticsUsageStatsCountryBreakdownInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _country = $v.country;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsUsageStatsCountryBreakdownInner other) {
    _$v = other as _$AnalyticsUsageStatsCountryBreakdownInner;
  }

  @override
  void update(
      void Function(AnalyticsUsageStatsCountryBreakdownInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsUsageStatsCountryBreakdownInner build() => _build();

  _$AnalyticsUsageStatsCountryBreakdownInner _build() {
    final _$result = _$v ??
        _$AnalyticsUsageStatsCountryBreakdownInner._(
          country: BuiltValueNullFieldError.checkNotNull(
              country, r'AnalyticsUsageStatsCountryBreakdownInner', 'country'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'AnalyticsUsageStatsCountryBreakdownInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
