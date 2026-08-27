// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_note_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysisNoteResponse extends AnalysisNoteResponse {
  @override
  final String note;
  @override
  final DateTime updatedAt;

  factory _$AnalysisNoteResponse(
          [void Function(AnalysisNoteResponseBuilder)? updates]) =>
      (AnalysisNoteResponseBuilder()..update(updates))._build();

  _$AnalysisNoteResponse._({required this.note, required this.updatedAt})
      : super._();
  @override
  AnalysisNoteResponse rebuild(
          void Function(AnalysisNoteResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisNoteResponseBuilder toBuilder() =>
      AnalysisNoteResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysisNoteResponse &&
        note == other.note &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalysisNoteResponse')
          ..add('note', note)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class AnalysisNoteResponseBuilder
    implements Builder<AnalysisNoteResponse, AnalysisNoteResponseBuilder> {
  _$AnalysisNoteResponse? _$v;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  AnalysisNoteResponseBuilder() {
    AnalysisNoteResponse._defaults(this);
  }

  AnalysisNoteResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _note = $v.note;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalysisNoteResponse other) {
    _$v = other as _$AnalysisNoteResponse;
  }

  @override
  void update(void Function(AnalysisNoteResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysisNoteResponse build() => _build();

  _$AnalysisNoteResponse _build() {
    final _$result = _$v ??
        _$AnalysisNoteResponse._(
          note: BuiltValueNullFieldError.checkNotNull(
              note, r'AnalysisNoteResponse', 'note'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'AnalysisNoteResponse', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
