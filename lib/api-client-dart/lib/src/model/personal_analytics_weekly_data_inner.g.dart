// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'personal_analytics_weekly_data_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PersonalAnalyticsWeeklyDataInner
    extends PersonalAnalyticsWeeklyDataInner {
  @override
  final String week;
  @override
  final int count;

  factory _$PersonalAnalyticsWeeklyDataInner(
          [void Function(PersonalAnalyticsWeeklyDataInnerBuilder)? updates]) =>
      (PersonalAnalyticsWeeklyDataInnerBuilder()..update(updates))._build();

  _$PersonalAnalyticsWeeklyDataInner._(
      {required this.week, required this.count})
      : super._();
  @override
  PersonalAnalyticsWeeklyDataInner rebuild(
          void Function(PersonalAnalyticsWeeklyDataInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PersonalAnalyticsWeeklyDataInnerBuilder toBuilder() =>
      PersonalAnalyticsWeeklyDataInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PersonalAnalyticsWeeklyDataInner &&
        week == other.week &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, week.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PersonalAnalyticsWeeklyDataInner')
          ..add('week', week)
          ..add('count', count))
        .toString();
  }
}

class PersonalAnalyticsWeeklyDataInnerBuilder
    implements
        Builder<PersonalAnalyticsWeeklyDataInner,
            PersonalAnalyticsWeeklyDataInnerBuilder> {
  _$PersonalAnalyticsWeeklyDataInner? _$v;

  String? _week;
  String? get week => _$this._week;
  set week(String? week) => _$this._week = week;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  PersonalAnalyticsWeeklyDataInnerBuilder() {
    PersonalAnalyticsWeeklyDataInner._defaults(this);
  }

  PersonalAnalyticsWeeklyDataInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _week = $v.week;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PersonalAnalyticsWeeklyDataInner other) {
    _$v = other as _$PersonalAnalyticsWeeklyDataInner;
  }

  @override
  void update(void Function(PersonalAnalyticsWeeklyDataInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PersonalAnalyticsWeeklyDataInner build() => _build();

  _$PersonalAnalyticsWeeklyDataInner _build() {
    final _$result = _$v ??
        _$PersonalAnalyticsWeeklyDataInner._(
          week: BuiltValueNullFieldError.checkNotNull(
              week, r'PersonalAnalyticsWeeklyDataInner', 'week'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'PersonalAnalyticsWeeklyDataInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
