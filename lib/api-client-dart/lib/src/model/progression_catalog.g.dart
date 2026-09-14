// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_catalog.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionCatalog extends ProgressionCatalog {
  @override
  final BuiltList<ProgressionAchievement> achievements;
  @override
  final BuiltList<String> completedGuideIds;

  factory _$ProgressionCatalog(
          [void Function(ProgressionCatalogBuilder)? updates]) =>
      (ProgressionCatalogBuilder()..update(updates))._build();

  _$ProgressionCatalog._(
      {required this.achievements, required this.completedGuideIds})
      : super._();
  @override
  ProgressionCatalog rebuild(
          void Function(ProgressionCatalogBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionCatalogBuilder toBuilder() =>
      ProgressionCatalogBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionCatalog &&
        achievements == other.achievements &&
        completedGuideIds == other.completedGuideIds;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, achievements.hashCode);
    _$hash = $jc(_$hash, completedGuideIds.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionCatalog')
          ..add('achievements', achievements)
          ..add('completedGuideIds', completedGuideIds))
        .toString();
  }
}

class ProgressionCatalogBuilder
    implements Builder<ProgressionCatalog, ProgressionCatalogBuilder> {
  _$ProgressionCatalog? _$v;

  ListBuilder<ProgressionAchievement>? _achievements;
  ListBuilder<ProgressionAchievement> get achievements =>
      _$this._achievements ??= ListBuilder<ProgressionAchievement>();
  set achievements(ListBuilder<ProgressionAchievement>? achievements) =>
      _$this._achievements = achievements;

  ListBuilder<String>? _completedGuideIds;
  ListBuilder<String> get completedGuideIds =>
      _$this._completedGuideIds ??= ListBuilder<String>();
  set completedGuideIds(ListBuilder<String>? completedGuideIds) =>
      _$this._completedGuideIds = completedGuideIds;

  ProgressionCatalogBuilder() {
    ProgressionCatalog._defaults(this);
  }

  ProgressionCatalogBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _achievements = $v.achievements.toBuilder();
      _completedGuideIds = $v.completedGuideIds.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionCatalog other) {
    _$v = other as _$ProgressionCatalog;
  }

  @override
  void update(void Function(ProgressionCatalogBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionCatalog build() => _build();

  _$ProgressionCatalog _build() {
    _$ProgressionCatalog _$result;
    try {
      _$result = _$v ??
          _$ProgressionCatalog._(
            achievements: achievements.build(),
            completedGuideIds: completedGuideIds.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'achievements';
        achievements.build();
        _$failedField = 'completedGuideIds';
        completedGuideIds.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProgressionCatalog', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
