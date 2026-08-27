// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tags_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TagsList extends TagsList {
  @override
  final BuiltList<String> tags;

  factory _$TagsList([void Function(TagsListBuilder)? updates]) =>
      (TagsListBuilder()..update(updates))._build();

  _$TagsList._({required this.tags}) : super._();
  @override
  TagsList rebuild(void Function(TagsListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TagsListBuilder toBuilder() => TagsListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TagsList && tags == other.tags;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, tags.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TagsList')..add('tags', tags))
        .toString();
  }
}

class TagsListBuilder implements Builder<TagsList, TagsListBuilder> {
  _$TagsList? _$v;

  ListBuilder<String>? _tags;
  ListBuilder<String> get tags => _$this._tags ??= ListBuilder<String>();
  set tags(ListBuilder<String>? tags) => _$this._tags = tags;

  TagsListBuilder() {
    TagsList._defaults(this);
  }

  TagsListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _tags = $v.tags.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TagsList other) {
    _$v = other as _$TagsList;
  }

  @override
  void update(void Function(TagsListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TagsList build() => _build();

  _$TagsList _build() {
    _$TagsList _$result;
    try {
      _$result = _$v ??
          _$TagsList._(
            tags: tags.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'tags';
        tags.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TagsList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
