// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trader_mirror_highlight.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TraderMirrorHighlight extends TraderMirrorHighlight {
  @override
  final String id;
  @override
  final String en;
  @override
  final String idText;

  factory _$TraderMirrorHighlight(
          [void Function(TraderMirrorHighlightBuilder)? updates]) =>
      (TraderMirrorHighlightBuilder()..update(updates))._build();

  _$TraderMirrorHighlight._(
      {required this.id, required this.en, required this.idText})
      : super._();
  @override
  TraderMirrorHighlight rebuild(
          void Function(TraderMirrorHighlightBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TraderMirrorHighlightBuilder toBuilder() =>
      TraderMirrorHighlightBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TraderMirrorHighlight &&
        id == other.id &&
        en == other.en &&
        idText == other.idText;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, en.hashCode);
    _$hash = $jc(_$hash, idText.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TraderMirrorHighlight')
          ..add('id', id)
          ..add('en', en)
          ..add('idText', idText))
        .toString();
  }
}

class TraderMirrorHighlightBuilder
    implements Builder<TraderMirrorHighlight, TraderMirrorHighlightBuilder> {
  _$TraderMirrorHighlight? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _en;
  String? get en => _$this._en;
  set en(String? en) => _$this._en = en;

  String? _idText;
  String? get idText => _$this._idText;
  set idText(String? idText) => _$this._idText = idText;

  TraderMirrorHighlightBuilder() {
    TraderMirrorHighlight._defaults(this);
  }

  TraderMirrorHighlightBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _en = $v.en;
      _idText = $v.idText;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TraderMirrorHighlight other) {
    _$v = other as _$TraderMirrorHighlight;
  }

  @override
  void update(void Function(TraderMirrorHighlightBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TraderMirrorHighlight build() => _build();

  _$TraderMirrorHighlight _build() {
    final _$result = _$v ??
        _$TraderMirrorHighlight._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'TraderMirrorHighlight', 'id'),
          en: BuiltValueNullFieldError.checkNotNull(
              en, r'TraderMirrorHighlight', 'en'),
          idText: BuiltValueNullFieldError.checkNotNull(
              idText, r'TraderMirrorHighlight', 'idText'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
