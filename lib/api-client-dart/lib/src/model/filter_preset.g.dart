// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'filter_preset.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FilterPreset extends FilterPreset {
  @override
  final int id;
  @override
  final String name;
  @override
  final FilterPresetFilters filters;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$FilterPreset([void Function(FilterPresetBuilder)? updates]) =>
      (FilterPresetBuilder()..update(updates))._build();

  _$FilterPreset._(
      {required this.id,
      required this.name,
      required this.filters,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  FilterPreset rebuild(void Function(FilterPresetBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FilterPresetBuilder toBuilder() => FilterPresetBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FilterPreset &&
        id == other.id &&
        name == other.name &&
        filters == other.filters &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, filters.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FilterPreset')
          ..add('id', id)
          ..add('name', name)
          ..add('filters', filters)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class FilterPresetBuilder
    implements Builder<FilterPreset, FilterPresetBuilder> {
  _$FilterPreset? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  FilterPresetFiltersBuilder? _filters;
  FilterPresetFiltersBuilder get filters =>
      _$this._filters ??= FilterPresetFiltersBuilder();
  set filters(FilterPresetFiltersBuilder? filters) => _$this._filters = filters;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  FilterPresetBuilder() {
    FilterPreset._defaults(this);
  }

  FilterPresetBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _filters = $v.filters.toBuilder();
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FilterPreset other) {
    _$v = other as _$FilterPreset;
  }

  @override
  void update(void Function(FilterPresetBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FilterPreset build() => _build();

  _$FilterPreset _build() {
    _$FilterPreset _$result;
    try {
      _$result = _$v ??
          _$FilterPreset._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'FilterPreset', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'FilterPreset', 'name'),
            filters: filters.build(),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'FilterPreset', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'FilterPreset', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'filters';
        filters.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FilterPreset', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
