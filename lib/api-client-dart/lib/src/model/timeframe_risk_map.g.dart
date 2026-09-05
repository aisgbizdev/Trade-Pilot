// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'timeframe_risk_map.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TimeframeRiskMap extends TimeframeRiskMap {
  @override
  final String instrument;
  @override
  final DateTime generatedAt;
  @override
  final BuiltList<TimeframeRisk> timeframes;
  @override
  final TimeframeRiskMapOverall overall;

  factory _$TimeframeRiskMap(
          [void Function(TimeframeRiskMapBuilder)? updates]) =>
      (TimeframeRiskMapBuilder()..update(updates))._build();

  _$TimeframeRiskMap._(
      {required this.instrument,
      required this.generatedAt,
      required this.timeframes,
      required this.overall})
      : super._();
  @override
  TimeframeRiskMap rebuild(void Function(TimeframeRiskMapBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TimeframeRiskMapBuilder toBuilder() =>
      TimeframeRiskMapBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TimeframeRiskMap &&
        instrument == other.instrument &&
        generatedAt == other.generatedAt &&
        timeframes == other.timeframes &&
        overall == other.overall;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, generatedAt.hashCode);
    _$hash = $jc(_$hash, timeframes.hashCode);
    _$hash = $jc(_$hash, overall.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TimeframeRiskMap')
          ..add('instrument', instrument)
          ..add('generatedAt', generatedAt)
          ..add('timeframes', timeframes)
          ..add('overall', overall))
        .toString();
  }
}

class TimeframeRiskMapBuilder
    implements Builder<TimeframeRiskMap, TimeframeRiskMapBuilder> {
  _$TimeframeRiskMap? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  DateTime? _generatedAt;
  DateTime? get generatedAt => _$this._generatedAt;
  set generatedAt(DateTime? generatedAt) => _$this._generatedAt = generatedAt;

  ListBuilder<TimeframeRisk>? _timeframes;
  ListBuilder<TimeframeRisk> get timeframes =>
      _$this._timeframes ??= ListBuilder<TimeframeRisk>();
  set timeframes(ListBuilder<TimeframeRisk>? timeframes) =>
      _$this._timeframes = timeframes;

  TimeframeRiskMapOverallBuilder? _overall;
  TimeframeRiskMapOverallBuilder get overall =>
      _$this._overall ??= TimeframeRiskMapOverallBuilder();
  set overall(TimeframeRiskMapOverallBuilder? overall) =>
      _$this._overall = overall;

  TimeframeRiskMapBuilder() {
    TimeframeRiskMap._defaults(this);
  }

  TimeframeRiskMapBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _generatedAt = $v.generatedAt;
      _timeframes = $v.timeframes.toBuilder();
      _overall = $v.overall.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TimeframeRiskMap other) {
    _$v = other as _$TimeframeRiskMap;
  }

  @override
  void update(void Function(TimeframeRiskMapBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TimeframeRiskMap build() => _build();

  _$TimeframeRiskMap _build() {
    _$TimeframeRiskMap _$result;
    try {
      _$result = _$v ??
          _$TimeframeRiskMap._(
            instrument: BuiltValueNullFieldError.checkNotNull(
                instrument, r'TimeframeRiskMap', 'instrument'),
            generatedAt: BuiltValueNullFieldError.checkNotNull(
                generatedAt, r'TimeframeRiskMap', 'generatedAt'),
            timeframes: timeframes.build(),
            overall: overall.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'timeframes';
        timeframes.build();
        _$failedField = 'overall';
        overall.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TimeframeRiskMap', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
