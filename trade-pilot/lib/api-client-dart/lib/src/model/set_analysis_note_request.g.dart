// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'set_analysis_note_request.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SetAnalysisNoteRequest extends SetAnalysisNoteRequest {
  @override
  final String note;

  factory _$SetAnalysisNoteRequest(
          [void Function(SetAnalysisNoteRequestBuilder)? updates]) =>
      (SetAnalysisNoteRequestBuilder()..update(updates))._build();

  _$SetAnalysisNoteRequest._({required this.note}) : super._();
  @override
  SetAnalysisNoteRequest rebuild(
          void Function(SetAnalysisNoteRequestBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SetAnalysisNoteRequestBuilder toBuilder() =>
      SetAnalysisNoteRequestBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SetAnalysisNoteRequest && note == other.note;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SetAnalysisNoteRequest')
          ..add('note', note))
        .toString();
  }
}

class SetAnalysisNoteRequestBuilder
    implements Builder<SetAnalysisNoteRequest, SetAnalysisNoteRequestBuilder> {
  _$SetAnalysisNoteRequest? _$v;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  SetAnalysisNoteRequestBuilder() {
    SetAnalysisNoteRequest._defaults(this);
  }

  SetAnalysisNoteRequestBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _note = $v.note;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SetAnalysisNoteRequest other) {
    _$v = other as _$SetAnalysisNoteRequest;
  }

  @override
  void update(void Function(SetAnalysisNoteRequestBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SetAnalysisNoteRequest build() => _build();

  _$SetAnalysisNoteRequest _build() {
    final _$result = _$v ??
        _$SetAnalysisNoteRequest._(
          note: BuiltValueNullFieldError.checkNotNull(
              note, r'SetAnalysisNoteRequest', 'note'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
