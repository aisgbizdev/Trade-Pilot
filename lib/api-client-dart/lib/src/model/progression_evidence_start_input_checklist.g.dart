// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_evidence_start_input_checklist.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionEvidenceStartInputChecklist
    extends ProgressionEvidenceStartInputChecklist {
  @override
  final String instrument;
  @override
  final String timeframe;

  factory _$ProgressionEvidenceStartInputChecklist(
          [void Function(ProgressionEvidenceStartInputChecklistBuilder)?
              updates]) =>
      (ProgressionEvidenceStartInputChecklistBuilder()..update(updates))
          ._build();

  _$ProgressionEvidenceStartInputChecklist._(
      {required this.instrument, required this.timeframe})
      : super._();
  @override
  ProgressionEvidenceStartInputChecklist rebuild(
          void Function(ProgressionEvidenceStartInputChecklistBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionEvidenceStartInputChecklistBuilder toBuilder() =>
      ProgressionEvidenceStartInputChecklistBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionEvidenceStartInputChecklist &&
        instrument == other.instrument &&
        timeframe == other.timeframe;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, timeframe.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'ProgressionEvidenceStartInputChecklist')
          ..add('instrument', instrument)
          ..add('timeframe', timeframe))
        .toString();
  }
}

class ProgressionEvidenceStartInputChecklistBuilder
    implements
        Builder<ProgressionEvidenceStartInputChecklist,
            ProgressionEvidenceStartInputChecklistBuilder> {
  _$ProgressionEvidenceStartInputChecklist? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  String? _timeframe;
  String? get timeframe => _$this._timeframe;
  set timeframe(String? timeframe) => _$this._timeframe = timeframe;

  ProgressionEvidenceStartInputChecklistBuilder() {
    ProgressionEvidenceStartInputChecklist._defaults(this);
  }

  ProgressionEvidenceStartInputChecklistBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _timeframe = $v.timeframe;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionEvidenceStartInputChecklist other) {
    _$v = other as _$ProgressionEvidenceStartInputChecklist;
  }

  @override
  void update(
      void Function(ProgressionEvidenceStartInputChecklistBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionEvidenceStartInputChecklist build() => _build();

  _$ProgressionEvidenceStartInputChecklist _build() {
    final _$result = _$v ??
        _$ProgressionEvidenceStartInputChecklist._(
          instrument: BuiltValueNullFieldError.checkNotNull(instrument,
              r'ProgressionEvidenceStartInputChecklist', 'instrument'),
          timeframe: BuiltValueNullFieldError.checkNotNull(timeframe,
              r'ProgressionEvidenceStartInputChecklist', 'timeframe'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
