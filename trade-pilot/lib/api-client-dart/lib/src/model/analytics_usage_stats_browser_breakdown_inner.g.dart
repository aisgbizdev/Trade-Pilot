// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_usage_stats_browser_breakdown_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsUsageStatsBrowserBreakdownInner
    extends AnalyticsUsageStatsBrowserBreakdownInner {
  @override
  final String browser;
  @override
  final int count;

  factory _$AnalyticsUsageStatsBrowserBreakdownInner(
          [void Function(AnalyticsUsageStatsBrowserBreakdownInnerBuilder)?
              updates]) =>
      (AnalyticsUsageStatsBrowserBreakdownInnerBuilder()..update(updates))
          ._build();

  _$AnalyticsUsageStatsBrowserBreakdownInner._(
      {required this.browser, required this.count})
      : super._();
  @override
  AnalyticsUsageStatsBrowserBreakdownInner rebuild(
          void Function(AnalyticsUsageStatsBrowserBreakdownInnerBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsUsageStatsBrowserBreakdownInnerBuilder toBuilder() =>
      AnalyticsUsageStatsBrowserBreakdownInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsUsageStatsBrowserBreakdownInner &&
        browser == other.browser &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, browser.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'AnalyticsUsageStatsBrowserBreakdownInner')
          ..add('browser', browser)
          ..add('count', count))
        .toString();
  }
}

class AnalyticsUsageStatsBrowserBreakdownInnerBuilder
    implements
        Builder<AnalyticsUsageStatsBrowserBreakdownInner,
            AnalyticsUsageStatsBrowserBreakdownInnerBuilder> {
  _$AnalyticsUsageStatsBrowserBreakdownInner? _$v;

  String? _browser;
  String? get browser => _$this._browser;
  set browser(String? browser) => _$this._browser = browser;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  AnalyticsUsageStatsBrowserBreakdownInnerBuilder() {
    AnalyticsUsageStatsBrowserBreakdownInner._defaults(this);
  }

  AnalyticsUsageStatsBrowserBreakdownInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _browser = $v.browser;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsUsageStatsBrowserBreakdownInner other) {
    _$v = other as _$AnalyticsUsageStatsBrowserBreakdownInner;
  }

  @override
  void update(
      void Function(AnalyticsUsageStatsBrowserBreakdownInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsUsageStatsBrowserBreakdownInner build() => _build();

  _$AnalyticsUsageStatsBrowserBreakdownInner _build() {
    final _$result = _$v ??
        _$AnalyticsUsageStatsBrowserBreakdownInner._(
          browser: BuiltValueNullFieldError.checkNotNull(
              browser, r'AnalyticsUsageStatsBrowserBreakdownInner', 'browser'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'AnalyticsUsageStatsBrowserBreakdownInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
