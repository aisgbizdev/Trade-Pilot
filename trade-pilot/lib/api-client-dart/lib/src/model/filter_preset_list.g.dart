// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'filter_preset_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FilterPresetList extends FilterPresetList {
  @override
  final BuiltList<FilterPreset> presets;

  factory _$FilterPresetList(
          [void Function(FilterPresetListBuilder)? updates]) =>
      (FilterPresetListBuilder()..update(updates))._build();

  _$FilterPresetList._({required this.presets}) : super._();
  @override
  FilterPresetList rebuild(void Function(FilterPresetListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FilterPresetListBuilder toBuilder() =>
      FilterPresetListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FilterPresetList && presets == other.presets;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, presets.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FilterPresetList')
          ..add('presets', presets))
        .toString();
  }
}

class FilterPresetListBuilder
    implements Builder<FilterPresetList, FilterPresetListBuilder> {
  _$FilterPresetList? _$v;

  ListBuilder<FilterPreset>? _presets;
  ListBuilder<FilterPreset> get presets =>
      _$this._presets ??= ListBuilder<FilterPreset>();
  set presets(ListBuilder<FilterPreset>? presets) => _$this._presets = presets;

  FilterPresetListBuilder() {
    FilterPresetList._defaults(this);
  }

  FilterPresetListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _presets = $v.presets.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FilterPresetList other) {
    _$v = other as _$FilterPresetList;
  }

  @override
  void update(void Function(FilterPresetListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FilterPresetList build() => _build();

  _$FilterPresetList _build() {
    _$FilterPresetList _$result;
    try {
      _$result = _$v ??
          _$FilterPresetList._(
            presets: presets.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'presets';
        presets.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FilterPresetList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
