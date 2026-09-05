// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionSummary extends ProgressionSummary {
  @override
  final int totalXp;
  @override
  final int level;
  @override
  final int masteryLevel;
  @override
  final String rank;
  @override
  final int currentLevelXp;
  @override
  final int nextLevelXp;
  @override
  final int currentStreak;
  @override
  final int longestStreak;

  factory _$ProgressionSummary(
          [void Function(ProgressionSummaryBuilder)? updates]) =>
      (ProgressionSummaryBuilder()..update(updates))._build();

  _$ProgressionSummary._(
      {required this.totalXp,
      required this.level,
      required this.masteryLevel,
      required this.rank,
      required this.currentLevelXp,
      required this.nextLevelXp,
      required this.currentStreak,
      required this.longestStreak})
      : super._();
  @override
  ProgressionSummary rebuild(
          void Function(ProgressionSummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionSummaryBuilder toBuilder() =>
      ProgressionSummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionSummary &&
        totalXp == other.totalXp &&
        level == other.level &&
        masteryLevel == other.masteryLevel &&
        rank == other.rank &&
        currentLevelXp == other.currentLevelXp &&
        nextLevelXp == other.nextLevelXp &&
        currentStreak == other.currentStreak &&
        longestStreak == other.longestStreak;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalXp.hashCode);
    _$hash = $jc(_$hash, level.hashCode);
    _$hash = $jc(_$hash, masteryLevel.hashCode);
    _$hash = $jc(_$hash, rank.hashCode);
    _$hash = $jc(_$hash, currentLevelXp.hashCode);
    _$hash = $jc(_$hash, nextLevelXp.hashCode);
    _$hash = $jc(_$hash, currentStreak.hashCode);
    _$hash = $jc(_$hash, longestStreak.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionSummary')
          ..add('totalXp', totalXp)
          ..add('level', level)
          ..add('masteryLevel', masteryLevel)
          ..add('rank', rank)
          ..add('currentLevelXp', currentLevelXp)
          ..add('nextLevelXp', nextLevelXp)
          ..add('currentStreak', currentStreak)
          ..add('longestStreak', longestStreak))
        .toString();
  }
}

class ProgressionSummaryBuilder
    implements Builder<ProgressionSummary, ProgressionSummaryBuilder> {
  _$ProgressionSummary? _$v;

  int? _totalXp;
  int? get totalXp => _$this._totalXp;
  set totalXp(int? totalXp) => _$this._totalXp = totalXp;

  int? _level;
  int? get level => _$this._level;
  set level(int? level) => _$this._level = level;

  int? _masteryLevel;
  int? get masteryLevel => _$this._masteryLevel;
  set masteryLevel(int? masteryLevel) => _$this._masteryLevel = masteryLevel;

  String? _rank;
  String? get rank => _$this._rank;
  set rank(String? rank) => _$this._rank = rank;

  int? _currentLevelXp;
  int? get currentLevelXp => _$this._currentLevelXp;
  set currentLevelXp(int? currentLevelXp) =>
      _$this._currentLevelXp = currentLevelXp;

  int? _nextLevelXp;
  int? get nextLevelXp => _$this._nextLevelXp;
  set nextLevelXp(int? nextLevelXp) => _$this._nextLevelXp = nextLevelXp;

  int? _currentStreak;
  int? get currentStreak => _$this._currentStreak;
  set currentStreak(int? currentStreak) =>
      _$this._currentStreak = currentStreak;

  int? _longestStreak;
  int? get longestStreak => _$this._longestStreak;
  set longestStreak(int? longestStreak) =>
      _$this._longestStreak = longestStreak;

  ProgressionSummaryBuilder() {
    ProgressionSummary._defaults(this);
  }

  ProgressionSummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalXp = $v.totalXp;
      _level = $v.level;
      _masteryLevel = $v.masteryLevel;
      _rank = $v.rank;
      _currentLevelXp = $v.currentLevelXp;
      _nextLevelXp = $v.nextLevelXp;
      _currentStreak = $v.currentStreak;
      _longestStreak = $v.longestStreak;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionSummary other) {
    _$v = other as _$ProgressionSummary;
  }

  @override
  void update(void Function(ProgressionSummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionSummary build() => _build();

  _$ProgressionSummary _build() {
    final _$result = _$v ??
        _$ProgressionSummary._(
          totalXp: BuiltValueNullFieldError.checkNotNull(
              totalXp, r'ProgressionSummary', 'totalXp'),
          level: BuiltValueNullFieldError.checkNotNull(
              level, r'ProgressionSummary', 'level'),
          masteryLevel: BuiltValueNullFieldError.checkNotNull(
              masteryLevel, r'ProgressionSummary', 'masteryLevel'),
          rank: BuiltValueNullFieldError.checkNotNull(
              rank, r'ProgressionSummary', 'rank'),
          currentLevelXp: BuiltValueNullFieldError.checkNotNull(
              currentLevelXp, r'ProgressionSummary', 'currentLevelXp'),
          nextLevelXp: BuiltValueNullFieldError.checkNotNull(
              nextLevelXp, r'ProgressionSummary', 'nextLevelXp'),
          currentStreak: BuiltValueNullFieldError.checkNotNull(
              currentStreak, r'ProgressionSummary', 'currentStreak'),
          longestStreak: BuiltValueNullFieldError.checkNotNull(
              longestStreak, r'ProgressionSummary', 'longestStreak'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
