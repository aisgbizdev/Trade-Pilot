// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'rename_filter_preset_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RenameFilterPresetBody extends RenameFilterPresetBody {
  @override
  final String name;

  factory _$RenameFilterPresetBody(
          [void Function(RenameFilterPresetBodyBuilder)? updates]) =>
      (RenameFilterPresetBodyBuilder()..update(updates))._build();

  _$RenameFilterPresetBody._({required this.name}) : super._();
  @override
  RenameFilterPresetBody rebuild(
          void Function(RenameFilterPresetBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RenameFilterPresetBodyBuilder toBuilder() =>
      RenameFilterPresetBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RenameFilterPresetBody && name == other.name;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RenameFilterPresetBody')
          ..add('name', name))
        .toString();
  }
}

class RenameFilterPresetBodyBuilder
    implements Builder<RenameFilterPresetBody, RenameFilterPresetBodyBuilder> {
  _$RenameFilterPresetBody? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  RenameFilterPresetBodyBuilder() {
    RenameFilterPresetBody._defaults(this);
  }

  RenameFilterPresetBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RenameFilterPresetBody other) {
    _$v = other as _$RenameFilterPresetBody;
  }

  @override
  void update(void Function(RenameFilterPresetBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RenameFilterPresetBody build() => _build();

  _$RenameFilterPresetBody _build() {
    final _$result = _$v ??
        _$RenameFilterPresetBody._(
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'RenameFilterPresetBody', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
