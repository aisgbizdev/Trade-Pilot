// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_stats.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AdminStats extends AdminStats {
  @override
  final int totalUsersToday;
  @override
  final int totalAnalysesToday;
  @override
  final int totalAnalysesThisWeek;
  @override
  final int totalAnalysesThisMonth;
  @override
  final int totalUsers;
  @override
  final BuiltList<PersonalAnalyticsTopInstrumentsInner> instrumentBreakdown;
  @override
  final AdminStatsModeBreakdown modeBreakdown;

  factory _$AdminStats([void Function(AdminStatsBuilder)? updates]) =>
      (AdminStatsBuilder()..update(updates))._build();

  _$AdminStats._(
      {required this.totalUsersToday,
      required this.totalAnalysesToday,
      required this.totalAnalysesThisWeek,
      required this.totalAnalysesThisMonth,
      required this.totalUsers,
      required this.instrumentBreakdown,
      required this.modeBreakdown})
      : super._();
  @override
  AdminStats rebuild(void Function(AdminStatsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AdminStatsBuilder toBuilder() => AdminStatsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AdminStats &&
        totalUsersToday == other.totalUsersToday &&
        totalAnalysesToday == other.totalAnalysesToday &&
        totalAnalysesThisWeek == other.totalAnalysesThisWeek &&
        totalAnalysesThisMonth == other.totalAnalysesThisMonth &&
        totalUsers == other.totalUsers &&
        instrumentBreakdown == other.instrumentBreakdown &&
        modeBreakdown == other.modeBreakdown;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalUsersToday.hashCode);
    _$hash = $jc(_$hash, totalAnalysesToday.hashCode);
    _$hash = $jc(_$hash, totalAnalysesThisWeek.hashCode);
    _$hash = $jc(_$hash, totalAnalysesThisMonth.hashCode);
    _$hash = $jc(_$hash, totalUsers.hashCode);
    _$hash = $jc(_$hash, instrumentBreakdown.hashCode);
    _$hash = $jc(_$hash, modeBreakdown.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AdminStats')
          ..add('totalUsersToday', totalUsersToday)
          ..add('totalAnalysesToday', totalAnalysesToday)
          ..add('totalAnalysesThisWeek', totalAnalysesThisWeek)
          ..add('totalAnalysesThisMonth', totalAnalysesThisMonth)
          ..add('totalUsers', totalUsers)
          ..add('instrumentBreakdown', instrumentBreakdown)
          ..add('modeBreakdown', modeBreakdown))
        .toString();
  }
}

class AdminStatsBuilder implements Builder<AdminStats, AdminStatsBuilder> {
  _$AdminStats? _$v;

  int? _totalUsersToday;
  int? get totalUsersToday => _$this._totalUsersToday;
  set totalUsersToday(int? totalUsersToday) =>
      _$this._totalUsersToday = totalUsersToday;

  int? _totalAnalysesToday;
  int? get totalAnalysesToday => _$this._totalAnalysesToday;
  set totalAnalysesToday(int? totalAnalysesToday) =>
      _$this._totalAnalysesToday = totalAnalysesToday;

  int? _totalAnalysesThisWeek;
  int? get totalAnalysesThisWeek => _$this._totalAnalysesThisWeek;
  set totalAnalysesThisWeek(int? totalAnalysesThisWeek) =>
      _$this._totalAnalysesThisWeek = totalAnalysesThisWeek;

  int? _totalAnalysesThisMonth;
  int? get totalAnalysesThisMonth => _$this._totalAnalysesThisMonth;
  set totalAnalysesThisMonth(int? totalAnalysesThisMonth) =>
      _$this._totalAnalysesThisMonth = totalAnalysesThisMonth;

  int? _totalUsers;
  int? get totalUsers => _$this._totalUsers;
  set totalUsers(int? totalUsers) => _$this._totalUsers = totalUsers;

  ListBuilder<PersonalAnalyticsTopInstrumentsInner>? _instrumentBreakdown;
  ListBuilder<PersonalAnalyticsTopInstrumentsInner> get instrumentBreakdown =>
      _$this._instrumentBreakdown ??=
          ListBuilder<PersonalAnalyticsTopInstrumentsInner>();
  set instrumentBreakdown(
          ListBuilder<PersonalAnalyticsTopInstrumentsInner>?
              instrumentBreakdown) =>
      _$this._instrumentBreakdown = instrumentBreakdown;

  AdminStatsModeBreakdownBuilder? _modeBreakdown;
  AdminStatsModeBreakdownBuilder get modeBreakdown =>
      _$this._modeBreakdown ??= AdminStatsModeBreakdownBuilder();
  set modeBreakdown(AdminStatsModeBreakdownBuilder? modeBreakdown) =>
      _$this._modeBreakdown = modeBreakdown;

  AdminStatsBuilder() {
    AdminStats._defaults(this);
  }

  AdminStatsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalUsersToday = $v.totalUsersToday;
      _totalAnalysesToday = $v.totalAnalysesToday;
      _totalAnalysesThisWeek = $v.totalAnalysesThisWeek;
      _totalAnalysesThisMonth = $v.totalAnalysesThisMonth;
      _totalUsers = $v.totalUsers;
      _instrumentBreakdown = $v.instrumentBreakdown.toBuilder();
      _modeBreakdown = $v.modeBreakdown.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AdminStats other) {
    _$v = other as _$AdminStats;
  }

  @override
  void update(void Function(AdminStatsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AdminStats build() => _build();

  _$AdminStats _build() {
    _$AdminStats _$result;
    try {
      _$result = _$v ??
          _$AdminStats._(
            totalUsersToday: BuiltValueNullFieldError.checkNotNull(
                totalUsersToday, r'AdminStats', 'totalUsersToday'),
            totalAnalysesToday: BuiltValueNullFieldError.checkNotNull(
                totalAnalysesToday, r'AdminStats', 'totalAnalysesToday'),
            totalAnalysesThisWeek: BuiltValueNullFieldError.checkNotNull(
                totalAnalysesThisWeek, r'AdminStats', 'totalAnalysesThisWeek'),
            totalAnalysesThisMonth: BuiltValueNullFieldError.checkNotNull(
                totalAnalysesThisMonth,
                r'AdminStats',
                'totalAnalysesThisMonth'),
            totalUsers: BuiltValueNullFieldError.checkNotNull(
                totalUsers, r'AdminStats', 'totalUsers'),
            instrumentBreakdown: instrumentBreakdown.build(),
            modeBreakdown: modeBreakdown.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'instrumentBreakdown';
        instrumentBreakdown.build();
        _$failedField = 'modeBreakdown';
        modeBreakdown.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AdminStats', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
