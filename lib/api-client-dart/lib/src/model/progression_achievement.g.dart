// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_achievement.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionAchievement extends ProgressionAchievement {
  @override
  final String key;
  @override
  final bool unlocked;
  @override
  final DateTime? unlockedAt;

  factory _$ProgressionAchievement(
          [void Function(ProgressionAchievementBuilder)? updates]) =>
      (ProgressionAchievementBuilder()..update(updates))._build();

  _$ProgressionAchievement._(
      {required this.key, required this.unlocked, this.unlockedAt})
      : super._();
  @override
  ProgressionAchievement rebuild(
          void Function(ProgressionAchievementBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionAchievementBuilder toBuilder() =>
      ProgressionAchievementBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionAchievement &&
        key == other.key &&
        unlocked == other.unlocked &&
        unlockedAt == other.unlockedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, key.hashCode);
    _$hash = $jc(_$hash, unlocked.hashCode);
    _$hash = $jc(_$hash, unlockedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionAchievement')
          ..add('key', key)
          ..add('unlocked', unlocked)
          ..add('unlockedAt', unlockedAt))
        .toString();
  }
}

class ProgressionAchievementBuilder
    implements Builder<ProgressionAchievement, ProgressionAchievementBuilder> {
  _$ProgressionAchievement? _$v;

  String? _key;
  String? get key => _$this._key;
  set key(String? key) => _$this._key = key;

  bool? _unlocked;
  bool? get unlocked => _$this._unlocked;
  set unlocked(bool? unlocked) => _$this._unlocked = unlocked;

  DateTime? _unlockedAt;
  DateTime? get unlockedAt => _$this._unlockedAt;
  set unlockedAt(DateTime? unlockedAt) => _$this._unlockedAt = unlockedAt;

  ProgressionAchievementBuilder() {
    ProgressionAchievement._defaults(this);
  }

  ProgressionAchievementBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _key = $v.key;
      _unlocked = $v.unlocked;
      _unlockedAt = $v.unlockedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionAchievement other) {
    _$v = other as _$ProgressionAchievement;
  }

  @override
  void update(void Function(ProgressionAchievementBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionAchievement build() => _build();

  _$ProgressionAchievement _build() {
    final _$result = _$v ??
        _$ProgressionAchievement._(
          key: BuiltValueNullFieldError.checkNotNull(
              key, r'ProgressionAchievement', 'key'),
          unlocked: BuiltValueNullFieldError.checkNotNull(
              unlocked, r'ProgressionAchievement', 'unlocked'),
          unlockedAt: unlockedAt,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
