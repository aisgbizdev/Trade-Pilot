// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'add_user_tag_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AddUserTagBody extends AddUserTagBody {
  @override
  final String tag;

  factory _$AddUserTagBody([void Function(AddUserTagBodyBuilder)? updates]) =>
      (AddUserTagBodyBuilder()..update(updates))._build();

  _$AddUserTagBody._({required this.tag}) : super._();
  @override
  AddUserTagBody rebuild(void Function(AddUserTagBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AddUserTagBodyBuilder toBuilder() => AddUserTagBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AddUserTagBody && tag == other.tag;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, tag.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AddUserTagBody')..add('tag', tag))
        .toString();
  }
}

class AddUserTagBodyBuilder
    implements Builder<AddUserTagBody, AddUserTagBodyBuilder> {
  _$AddUserTagBody? _$v;

  String? _tag;
  String? get tag => _$this._tag;
  set tag(String? tag) => _$this._tag = tag;

  AddUserTagBodyBuilder() {
    AddUserTagBody._defaults(this);
  }

  AddUserTagBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _tag = $v.tag;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AddUserTagBody other) {
    _$v = other as _$AddUserTagBody;
  }

  @override
  void update(void Function(AddUserTagBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AddUserTagBody build() => _build();

  _$AddUserTagBody _build() {
    final _$result = _$v ??
        _$AddUserTagBody._(
          tag: BuiltValueNullFieldError.checkNotNull(
              tag, r'AddUserTagBody', 'tag'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
