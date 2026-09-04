// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_history_timeframe_stats.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysisHistoryTimeframeStats extends AnalysisHistoryTimeframeStats {
  @override
  final String timeframe;
  @override
  final int total;
  @override
  final int pending;
  @override
  final int activeValid;
  @override
  final int tp1Hit;
  @override
  final int tp2Hit;
  @override
  final int slHit;
  @override
  final int expired;
  @override
  final int invalidated;
  @override
  final num? winRate;
  @override
  final num? completionRate;

  factory _$AnalysisHistoryTimeframeStats(
          [void Function(AnalysisHistoryTimeframeStatsBuilder)? updates]) =>
      (AnalysisHistoryTimeframeStatsBuilder()..update(updates))._build();

  _$AnalysisHistoryTimeframeStats._(
      {required this.timeframe,
      required this.total,
      required this.pending,
      required this.activeValid,
      required this.tp1Hit,
      required this.tp2Hit,
      required this.slHit,
      required this.expired,
      required this.invalidated,
      this.winRate,
      this.completionRate})
      : super._();
  @override
  AnalysisHistoryTimeframeStats rebuild(
          void Function(AnalysisHistoryTimeframeStatsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisHistoryTimeframeStatsBuilder toBuilder() =>
      AnalysisHistoryTimeframeStatsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysisHistoryTimeframeStats &&
        timeframe == other.timeframe &&
        total == other.total &&
        pending == other.pending &&
        activeValid == other.activeValid &&
        tp1Hit == other.tp1Hit &&
        tp2Hit == other.tp2Hit &&
        slHit == other.slHit &&
        expired == other.expired &&
        invalidated == other.invalidated &&
        winRate == other.winRate &&
        completionRate == other.completionRate;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, timeframe.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, pending.hashCode);
    _$hash = $jc(_$hash, activeValid.hashCode);
    _$hash = $jc(_$hash, tp1Hit.hashCode);
    _$hash = $jc(_$hash, tp2Hit.hashCode);
    _$hash = $jc(_$hash, slHit.hashCode);
    _$hash = $jc(_$hash, expired.hashCode);
    _$hash = $jc(_$hash, invalidated.hashCode);
    _$hash = $jc(_$hash, winRate.hashCode);
    _$hash = $jc(_$hash, completionRate.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalysisHistoryTimeframeStats')
          ..add('timeframe', timeframe)
          ..add('total', total)
          ..add('pending', pending)
          ..add('activeValid', activeValid)
          ..add('tp1Hit', tp1Hit)
          ..add('tp2Hit', tp2Hit)
          ..add('slHit', slHit)
          ..add('expired', expired)
          ..add('invalidated', invalidated)
          ..add('winRate', winRate)
          ..add('completionRate', completionRate))
        .toString();
  }
}

class AnalysisHistoryTimeframeStatsBuilder
    implements
        Builder<AnalysisHistoryTimeframeStats,
            AnalysisHistoryTimeframeStatsBuilder>,
        AnalysisHistoryOutcomeStatsBuilder {
  _$AnalysisHistoryTimeframeStats? _$v;

  String? _timeframe;
  String? get timeframe => _$this._timeframe;
  set timeframe(covariant String? timeframe) => _$this._timeframe = timeframe;

  int? _total;
  int? get total => _$this._total;
  set total(covariant int? total) => _$this._total = total;

  int? _pending;
  int? get pending => _$this._pending;
  set pending(covariant int? pending) => _$this._pending = pending;

  int? _activeValid;
  int? get activeValid => _$this._activeValid;
  set activeValid(covariant int? activeValid) =>
      _$this._activeValid = activeValid;

  int? _tp1Hit;
  int? get tp1Hit => _$this._tp1Hit;
  set tp1Hit(covariant int? tp1Hit) => _$this._tp1Hit = tp1Hit;

  int? _tp2Hit;
  int? get tp2Hit => _$this._tp2Hit;
  set tp2Hit(covariant int? tp2Hit) => _$this._tp2Hit = tp2Hit;

  int? _slHit;
  int? get slHit => _$this._slHit;
  set slHit(covariant int? slHit) => _$this._slHit = slHit;

  int? _expired;
  int? get expired => _$this._expired;
  set expired(covariant int? expired) => _$this._expired = expired;

  int? _invalidated;
  int? get invalidated => _$this._invalidated;
  set invalidated(covariant int? invalidated) =>
      _$this._invalidated = invalidated;

  num? _winRate;
  num? get winRate => _$this._winRate;
  set winRate(covariant num? winRate) => _$this._winRate = winRate;

  num? _completionRate;
  num? get completionRate => _$this._completionRate;
  set completionRate(covariant num? completionRate) =>
      _$this._completionRate = completionRate;

  AnalysisHistoryTimeframeStatsBuilder() {
    AnalysisHistoryTimeframeStats._defaults(this);
  }

  AnalysisHistoryTimeframeStatsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _timeframe = $v.timeframe;
      _total = $v.total;
      _pending = $v.pending;
      _activeValid = $v.activeValid;
      _tp1Hit = $v.tp1Hit;
      _tp2Hit = $v.tp2Hit;
      _slHit = $v.slHit;
      _expired = $v.expired;
      _invalidated = $v.invalidated;
      _winRate = $v.winRate;
      _completionRate = $v.completionRate;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(covariant AnalysisHistoryTimeframeStats other) {
    _$v = other as _$AnalysisHistoryTimeframeStats;
  }

  @override
  void update(void Function(AnalysisHistoryTimeframeStatsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysisHistoryTimeframeStats build() => _build();

  _$AnalysisHistoryTimeframeStats _build() {
    final _$result = _$v ??
        _$AnalysisHistoryTimeframeStats._(
          timeframe: BuiltValueNullFieldError.checkNotNull(
              timeframe, r'AnalysisHistoryTimeframeStats', 'timeframe'),
          total: BuiltValueNullFieldError.checkNotNull(
              total, r'AnalysisHistoryTimeframeStats', 'total'),
          pending: BuiltValueNullFieldError.checkNotNull(
              pending, r'AnalysisHistoryTimeframeStats', 'pending'),
          activeValid: BuiltValueNullFieldError.checkNotNull(
              activeValid, r'AnalysisHistoryTimeframeStats', 'activeValid'),
          tp1Hit: BuiltValueNullFieldError.checkNotNull(
              tp1Hit, r'AnalysisHistoryTimeframeStats', 'tp1Hit'),
          tp2Hit: BuiltValueNullFieldError.checkNotNull(
              tp2Hit, r'AnalysisHistoryTimeframeStats', 'tp2Hit'),
          slHit: BuiltValueNullFieldError.checkNotNull(
              slHit, r'AnalysisHistoryTimeframeStats', 'slHit'),
          expired: BuiltValueNullFieldError.checkNotNull(
              expired, r'AnalysisHistoryTimeframeStats', 'expired'),
          invalidated: BuiltValueNullFieldError.checkNotNull(
              invalidated, r'AnalysisHistoryTimeframeStats', 'invalidated'),
          winRate: winRate,
          completionRate: completionRate,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
