// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_filter_preset_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateFilterPresetBody extends CreateFilterPresetBody {
  @override
  final String name;
  @override
  final FilterPresetFilters filters;

  factory _$CreateFilterPresetBody(
          [void Function(CreateFilterPresetBodyBuilder)? updates]) =>
      (CreateFilterPresetBodyBuilder()..update(updates))._build();

  _$CreateFilterPresetBody._({required this.name, required this.filters})
      : super._();
  @override
  CreateFilterPresetBody rebuild(
          void Function(CreateFilterPresetBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateFilterPresetBodyBuilder toBuilder() =>
      CreateFilterPresetBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateFilterPresetBody &&
        name == other.name &&
        filters == other.filters;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, filters.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateFilterPresetBody')
          ..add('name', name)
          ..add('filters', filters))
        .toString();
  }
}

class CreateFilterPresetBodyBuilder
    implements Builder<CreateFilterPresetBody, CreateFilterPresetBodyBuilder> {
  _$CreateFilterPresetBody? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  FilterPresetFiltersBuilder? _filters;
  FilterPresetFiltersBuilder get filters =>
      _$this._filters ??= FilterPresetFiltersBuilder();
  set filters(FilterPresetFiltersBuilder? filters) => _$this._filters = filters;

  CreateFilterPresetBodyBuilder() {
    CreateFilterPresetBody._defaults(this);
  }

  CreateFilterPresetBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _filters = $v.filters.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateFilterPresetBody other) {
    _$v = other as _$CreateFilterPresetBody;
  }

  @override
  void update(void Function(CreateFilterPresetBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateFilterPresetBody build() => _build();

  _$CreateFilterPresetBody _build() {
    _$CreateFilterPresetBody _$result;
    try {
      _$result = _$v ??
          _$CreateFilterPresetBody._(
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'CreateFilterPresetBody', 'name'),
            filters: filters.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'filters';
        filters.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreateFilterPresetBody', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
