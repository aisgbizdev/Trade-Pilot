// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'personal_analytics.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PersonalAnalytics extends PersonalAnalytics {
  @override
  final int totalAllTime;
  @override
  final int totalThisMonth;
  @override
  final int totalThisWeek;
  @override
  final BuiltList<PersonalAnalyticsTopInstrumentsInner> topInstruments;
  @override
  final String? dominantMode;
  @override
  final num? accuracyRate;
  @override
  final int feedbackCount;
  @override
  final BuiltList<PersonalAnalyticsWeeklyDataInner> weeklyData;

  factory _$PersonalAnalytics(
          [void Function(PersonalAnalyticsBuilder)? updates]) =>
      (PersonalAnalyticsBuilder()..update(updates))._build();

  _$PersonalAnalytics._(
      {required this.totalAllTime,
      required this.totalThisMonth,
      required this.totalThisWeek,
      required this.topInstruments,
      this.dominantMode,
      this.accuracyRate,
      required this.feedbackCount,
      required this.weeklyData})
      : super._();
  @override
  PersonalAnalytics rebuild(void Function(PersonalAnalyticsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PersonalAnalyticsBuilder toBuilder() =>
      PersonalAnalyticsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PersonalAnalytics &&
        totalAllTime == other.totalAllTime &&
        totalThisMonth == other.totalThisMonth &&
        totalThisWeek == other.totalThisWeek &&
        topInstruments == other.topInstruments &&
        dominantMode == other.dominantMode &&
        accuracyRate == other.accuracyRate &&
        feedbackCount == other.feedbackCount &&
        weeklyData == other.weeklyData;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalAllTime.hashCode);
    _$hash = $jc(_$hash, totalThisMonth.hashCode);
    _$hash = $jc(_$hash, totalThisWeek.hashCode);
    _$hash = $jc(_$hash, topInstruments.hashCode);
    _$hash = $jc(_$hash, dominantMode.hashCode);
    _$hash = $jc(_$hash, accuracyRate.hashCode);
    _$hash = $jc(_$hash, feedbackCount.hashCode);
    _$hash = $jc(_$hash, weeklyData.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PersonalAnalytics')
          ..add('totalAllTime', totalAllTime)
          ..add('totalThisMonth', totalThisMonth)
          ..add('totalThisWeek', totalThisWeek)
          ..add('topInstruments', topInstruments)
          ..add('dominantMode', dominantMode)
          ..add('accuracyRate', accuracyRate)
          ..add('feedbackCount', feedbackCount)
          ..add('weeklyData', weeklyData))
        .toString();
  }
}

class PersonalAnalyticsBuilder
    implements Builder<PersonalAnalytics, PersonalAnalyticsBuilder> {
  _$PersonalAnalytics? _$v;

  int? _totalAllTime;
  int? get totalAllTime => _$this._totalAllTime;
  set totalAllTime(int? totalAllTime) => _$this._totalAllTime = totalAllTime;

  int? _totalThisMonth;
  int? get totalThisMonth => _$this._totalThisMonth;
  set totalThisMonth(int? totalThisMonth) =>
      _$this._totalThisMonth = totalThisMonth;

  int? _totalThisWeek;
  int? get totalThisWeek => _$this._totalThisWeek;
  set totalThisWeek(int? totalThisWeek) =>
      _$this._totalThisWeek = totalThisWeek;

  ListBuilder<PersonalAnalyticsTopInstrumentsInner>? _topInstruments;
  ListBuilder<PersonalAnalyticsTopInstrumentsInner> get topInstruments =>
      _$this._topInstruments ??=
          ListBuilder<PersonalAnalyticsTopInstrumentsInner>();
  set topInstruments(
          ListBuilder<PersonalAnalyticsTopInstrumentsInner>? topInstruments) =>
      _$this._topInstruments = topInstruments;

  String? _dominantMode;
  String? get dominantMode => _$this._dominantMode;
  set dominantMode(String? dominantMode) => _$this._dominantMode = dominantMode;

  num? _accuracyRate;
  num? get accuracyRate => _$this._accuracyRate;
  set accuracyRate(num? accuracyRate) => _$this._accuracyRate = accuracyRate;

  int? _feedbackCount;
  int? get feedbackCount => _$this._feedbackCount;
  set feedbackCount(int? feedbackCount) =>
      _$this._feedbackCount = feedbackCount;

  ListBuilder<PersonalAnalyticsWeeklyDataInner>? _weeklyData;
  ListBuilder<PersonalAnalyticsWeeklyDataInner> get weeklyData =>
      _$this._weeklyData ??= ListBuilder<PersonalAnalyticsWeeklyDataInner>();
  set weeklyData(ListBuilder<PersonalAnalyticsWeeklyDataInner>? weeklyData) =>
      _$this._weeklyData = weeklyData;

  PersonalAnalyticsBuilder() {
    PersonalAnalytics._defaults(this);
  }

  PersonalAnalyticsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalAllTime = $v.totalAllTime;
      _totalThisMonth = $v.totalThisMonth;
      _totalThisWeek = $v.totalThisWeek;
      _topInstruments = $v.topInstruments.toBuilder();
      _dominantMode = $v.dominantMode;
      _accuracyRate = $v.accuracyRate;
      _feedbackCount = $v.feedbackCount;
      _weeklyData = $v.weeklyData.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PersonalAnalytics other) {
    _$v = other as _$PersonalAnalytics;
  }

  @override
  void update(void Function(PersonalAnalyticsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PersonalAnalytics build() => _build();

  _$PersonalAnalytics _build() {
    _$PersonalAnalytics _$result;
    try {
      _$result = _$v ??
          _$PersonalAnalytics._(
            totalAllTime: BuiltValueNullFieldError.checkNotNull(
                totalAllTime, r'PersonalAnalytics', 'totalAllTime'),
            totalThisMonth: BuiltValueNullFieldError.checkNotNull(
                totalThisMonth, r'PersonalAnalytics', 'totalThisMonth'),
            totalThisWeek: BuiltValueNullFieldError.checkNotNull(
                totalThisWeek, r'PersonalAnalytics', 'totalThisWeek'),
            topInstruments: topInstruments.build(),
            dominantMode: dominantMode,
            accuracyRate: accuracyRate,
            feedbackCount: BuiltValueNullFieldError.checkNotNull(
                feedbackCount, r'PersonalAnalytics', 'feedbackCount'),
            weeklyData: weeklyData.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'topInstruments';
        topInstruments.build();

        _$failedField = 'weeklyData';
        weeklyData.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PersonalAnalytics', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
