// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_token_stats.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsTokenStats extends AnalyticsTokenStats {
  @override
  final int windowDays;
  @override
  final BuiltList<AnalyticsTokenStatsDailyTokensInner> dailyTokens;
  @override
  final BuiltList<AnalyticsTokenStatsByModelInner> byModel;
  @override
  final BuiltList<AnalyticsTokenStatsByInstrumentInner> byInstrument;
  @override
  final BuiltList<AnalyticsTokenStatsTopUsersInner> topUsers;
  @override
  final AnalyticsTokenStatsTotals totals;

  factory _$AnalyticsTokenStats(
          [void Function(AnalyticsTokenStatsBuilder)? updates]) =>
      (AnalyticsTokenStatsBuilder()..update(updates))._build();

  _$AnalyticsTokenStats._(
      {required this.windowDays,
      required this.dailyTokens,
      required this.byModel,
      required this.byInstrument,
      required this.topUsers,
      required this.totals})
      : super._();
  @override
  AnalyticsTokenStats rebuild(
          void Function(AnalyticsTokenStatsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsTokenStatsBuilder toBuilder() =>
      AnalyticsTokenStatsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsTokenStats &&
        windowDays == other.windowDays &&
        dailyTokens == other.dailyTokens &&
        byModel == other.byModel &&
        byInstrument == other.byInstrument &&
        topUsers == other.topUsers &&
        totals == other.totals;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, windowDays.hashCode);
    _$hash = $jc(_$hash, dailyTokens.hashCode);
    _$hash = $jc(_$hash, byModel.hashCode);
    _$hash = $jc(_$hash, byInstrument.hashCode);
    _$hash = $jc(_$hash, topUsers.hashCode);
    _$hash = $jc(_$hash, totals.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsTokenStats')
          ..add('windowDays', windowDays)
          ..add('dailyTokens', dailyTokens)
          ..add('byModel', byModel)
          ..add('byInstrument', byInstrument)
          ..add('topUsers', topUsers)
          ..add('totals', totals))
        .toString();
  }
}

class AnalyticsTokenStatsBuilder
    implements Builder<AnalyticsTokenStats, AnalyticsTokenStatsBuilder> {
  _$AnalyticsTokenStats? _$v;

  int? _windowDays;
  int? get windowDays => _$this._windowDays;
  set windowDays(int? windowDays) => _$this._windowDays = windowDays;

  ListBuilder<AnalyticsTokenStatsDailyTokensInner>? _dailyTokens;
  ListBuilder<AnalyticsTokenStatsDailyTokensInner> get dailyTokens =>
      _$this._dailyTokens ??=
          ListBuilder<AnalyticsTokenStatsDailyTokensInner>();
  set dailyTokens(
          ListBuilder<AnalyticsTokenStatsDailyTokensInner>? dailyTokens) =>
      _$this._dailyTokens = dailyTokens;

  ListBuilder<AnalyticsTokenStatsByModelInner>? _byModel;
  ListBuilder<AnalyticsTokenStatsByModelInner> get byModel =>
      _$this._byModel ??= ListBuilder<AnalyticsTokenStatsByModelInner>();
  set byModel(ListBuilder<AnalyticsTokenStatsByModelInner>? byModel) =>
      _$this._byModel = byModel;

  ListBuilder<AnalyticsTokenStatsByInstrumentInner>? _byInstrument;
  ListBuilder<AnalyticsTokenStatsByInstrumentInner> get byInstrument =>
      _$this._byInstrument ??=
          ListBuilder<AnalyticsTokenStatsByInstrumentInner>();
  set byInstrument(
          ListBuilder<AnalyticsTokenStatsByInstrumentInner>? byInstrument) =>
      _$this._byInstrument = byInstrument;

  ListBuilder<AnalyticsTokenStatsTopUsersInner>? _topUsers;
  ListBuilder<AnalyticsTokenStatsTopUsersInner> get topUsers =>
      _$this._topUsers ??= ListBuilder<AnalyticsTokenStatsTopUsersInner>();
  set topUsers(ListBuilder<AnalyticsTokenStatsTopUsersInner>? topUsers) =>
      _$this._topUsers = topUsers;

  AnalyticsTokenStatsTotalsBuilder? _totals;
  AnalyticsTokenStatsTotalsBuilder get totals =>
      _$this._totals ??= AnalyticsTokenStatsTotalsBuilder();
  set totals(AnalyticsTokenStatsTotalsBuilder? totals) =>
      _$this._totals = totals;

  AnalyticsTokenStatsBuilder() {
    AnalyticsTokenStats._defaults(this);
  }

  AnalyticsTokenStatsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _windowDays = $v.windowDays;
      _dailyTokens = $v.dailyTokens.toBuilder();
      _byModel = $v.byModel.toBuilder();
      _byInstrument = $v.byInstrument.toBuilder();
      _topUsers = $v.topUsers.toBuilder();
      _totals = $v.totals.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsTokenStats other) {
    _$v = other as _$AnalyticsTokenStats;
  }

  @override
  void update(void Function(AnalyticsTokenStatsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsTokenStats build() => _build();

  _$AnalyticsTokenStats _build() {
    _$AnalyticsTokenStats _$result;
    try {
      _$result = _$v ??
          _$AnalyticsTokenStats._(
            windowDays: BuiltValueNullFieldError.checkNotNull(
                windowDays, r'AnalyticsTokenStats', 'windowDays'),
            dailyTokens: dailyTokens.build(),
            byModel: byModel.build(),
            byInstrument: byInstrument.build(),
            topUsers: topUsers.build(),
            totals: totals.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'dailyTokens';
        dailyTokens.build();
        _$failedField = 'byModel';
        byModel.build();
        _$failedField = 'byInstrument';
        byInstrument.build();
        _$failedField = 'topUsers';
        topUsers.build();
        _$failedField = 'totals';
        totals.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AnalyticsTokenStats', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
