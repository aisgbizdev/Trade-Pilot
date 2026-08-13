// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_summary_analysis.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DailySummaryAnalysis extends DailySummaryAnalysis {
  @override
  final int id;
  @override
  final String instrument;
  @override
  final String timeframe;
  @override
  final String? tradingBias;
  @override
  final int? confidenceMin;
  @override
  final int? confidenceMax;
  @override
  final String? preferredSide;
  @override
  final String? mainScenario;
  @override
  final DateTime createdAt;

  factory _$DailySummaryAnalysis(
          [void Function(DailySummaryAnalysisBuilder)? updates]) =>
      (DailySummaryAnalysisBuilder()..update(updates))._build();

  _$DailySummaryAnalysis._(
      {required this.id,
      required this.instrument,
      required this.timeframe,
      this.tradingBias,
      this.confidenceMin,
      this.confidenceMax,
      this.preferredSide,
      this.mainScenario,
      required this.createdAt})
      : super._();
  @override
  DailySummaryAnalysis rebuild(
          void Function(DailySummaryAnalysisBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DailySummaryAnalysisBuilder toBuilder() =>
      DailySummaryAnalysisBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DailySummaryAnalysis &&
        id == other.id &&
        instrument == other.instrument &&
        timeframe == other.timeframe &&
        tradingBias == other.tradingBias &&
        confidenceMin == other.confidenceMin &&
        confidenceMax == other.confidenceMax &&
        preferredSide == other.preferredSide &&
        mainScenario == other.mainScenario &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, timeframe.hashCode);
    _$hash = $jc(_$hash, tradingBias.hashCode);
    _$hash = $jc(_$hash, confidenceMin.hashCode);
    _$hash = $jc(_$hash, confidenceMax.hashCode);
    _$hash = $jc(_$hash, preferredSide.hashCode);
    _$hash = $jc(_$hash, mainScenario.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DailySummaryAnalysis')
          ..add('id', id)
          ..add('instrument', instrument)
          ..add('timeframe', timeframe)
          ..add('tradingBias', tradingBias)
          ..add('confidenceMin', confidenceMin)
          ..add('confidenceMax', confidenceMax)
          ..add('preferredSide', preferredSide)
          ..add('mainScenario', mainScenario)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class DailySummaryAnalysisBuilder
    implements Builder<DailySummaryAnalysis, DailySummaryAnalysisBuilder> {
  _$DailySummaryAnalysis? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  String? _timeframe;
  String? get timeframe => _$this._timeframe;
  set timeframe(String? timeframe) => _$this._timeframe = timeframe;

  String? _tradingBias;
  String? get tradingBias => _$this._tradingBias;
  set tradingBias(String? tradingBias) => _$this._tradingBias = tradingBias;

  int? _confidenceMin;
  int? get confidenceMin => _$this._confidenceMin;
  set confidenceMin(int? confidenceMin) =>
      _$this._confidenceMin = confidenceMin;

  int? _confidenceMax;
  int? get confidenceMax => _$this._confidenceMax;
  set confidenceMax(int? confidenceMax) =>
      _$this._confidenceMax = confidenceMax;

  String? _preferredSide;
  String? get preferredSide => _$this._preferredSide;
  set preferredSide(String? preferredSide) =>
      _$this._preferredSide = preferredSide;

  String? _mainScenario;
  String? get mainScenario => _$this._mainScenario;
  set mainScenario(String? mainScenario) => _$this._mainScenario = mainScenario;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DailySummaryAnalysisBuilder() {
    DailySummaryAnalysis._defaults(this);
  }

  DailySummaryAnalysisBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _instrument = $v.instrument;
      _timeframe = $v.timeframe;
      _tradingBias = $v.tradingBias;
      _confidenceMin = $v.confidenceMin;
      _confidenceMax = $v.confidenceMax;
      _preferredSide = $v.preferredSide;
      _mainScenario = $v.mainScenario;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DailySummaryAnalysis other) {
    _$v = other as _$DailySummaryAnalysis;
  }

  @override
  void update(void Function(DailySummaryAnalysisBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DailySummaryAnalysis build() => _build();

  _$DailySummaryAnalysis _build() {
    final _$result = _$v ??
        _$DailySummaryAnalysis._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'DailySummaryAnalysis', 'id'),
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'DailySummaryAnalysis', 'instrument'),
          timeframe: BuiltValueNullFieldError.checkNotNull(
              timeframe, r'DailySummaryAnalysis', 'timeframe'),
          tradingBias: tradingBias,
          confidenceMin: confidenceMin,
          confidenceMax: confidenceMax,
          preferredSide: preferredSide,
          mainScenario: mainScenario,
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'DailySummaryAnalysis', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
