// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_history_outcome_stats.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

abstract class AnalysisHistoryOutcomeStatsBuilder {
  void replace(AnalysisHistoryOutcomeStats other);
  void update(void Function(AnalysisHistoryOutcomeStatsBuilder) updates);
  int? get total;
  set total(int? total);

  int? get pending;
  set pending(int? pending);

  int? get activeValid;
  set activeValid(int? activeValid);

  int? get tp1Hit;
  set tp1Hit(int? tp1Hit);

  int? get tp2Hit;
  set tp2Hit(int? tp2Hit);

  int? get slHit;
  set slHit(int? slHit);

  int? get expired;
  set expired(int? expired);

  int? get invalidated;
  set invalidated(int? invalidated);

  num? get winRate;
  set winRate(num? winRate);

  num? get completionRate;
  set completionRate(num? completionRate);
}

class _$$AnalysisHistoryOutcomeStats extends $AnalysisHistoryOutcomeStats {
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

  factory _$$AnalysisHistoryOutcomeStats(
          [void Function($AnalysisHistoryOutcomeStatsBuilder)? updates]) =>
      ($AnalysisHistoryOutcomeStatsBuilder()..update(updates))._build();

  _$$AnalysisHistoryOutcomeStats._(
      {required this.total,
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
  $AnalysisHistoryOutcomeStats rebuild(
          void Function($AnalysisHistoryOutcomeStatsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  $AnalysisHistoryOutcomeStatsBuilder toBuilder() =>
      $AnalysisHistoryOutcomeStatsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is $AnalysisHistoryOutcomeStats &&
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
    return (newBuiltValueToStringHelper(r'$AnalysisHistoryOutcomeStats')
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

class $AnalysisHistoryOutcomeStatsBuilder
    implements
        Builder<$AnalysisHistoryOutcomeStats,
            $AnalysisHistoryOutcomeStatsBuilder>,
        AnalysisHistoryOutcomeStatsBuilder {
  _$$AnalysisHistoryOutcomeStats? _$v;

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

  $AnalysisHistoryOutcomeStatsBuilder() {
    $AnalysisHistoryOutcomeStats._defaults(this);
  }

  $AnalysisHistoryOutcomeStatsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
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
  void replace(covariant $AnalysisHistoryOutcomeStats other) {
    _$v = other as _$$AnalysisHistoryOutcomeStats;
  }

  @override
  void update(void Function($AnalysisHistoryOutcomeStatsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  $AnalysisHistoryOutcomeStats build() => _build();

  _$$AnalysisHistoryOutcomeStats _build() {
    final _$result = _$v ??
        _$$AnalysisHistoryOutcomeStats._(
          total: BuiltValueNullFieldError.checkNotNull(
              total, r'$AnalysisHistoryOutcomeStats', 'total'),
          pending: BuiltValueNullFieldError.checkNotNull(
              pending, r'$AnalysisHistoryOutcomeStats', 'pending'),
          activeValid: BuiltValueNullFieldError.checkNotNull(
              activeValid, r'$AnalysisHistoryOutcomeStats', 'activeValid'),
          tp1Hit: BuiltValueNullFieldError.checkNotNull(
              tp1Hit, r'$AnalysisHistoryOutcomeStats', 'tp1Hit'),
          tp2Hit: BuiltValueNullFieldError.checkNotNull(
              tp2Hit, r'$AnalysisHistoryOutcomeStats', 'tp2Hit'),
          slHit: BuiltValueNullFieldError.checkNotNull(
              slHit, r'$AnalysisHistoryOutcomeStats', 'slHit'),
          expired: BuiltValueNullFieldError.checkNotNull(
              expired, r'$AnalysisHistoryOutcomeStats', 'expired'),
          invalidated: BuiltValueNullFieldError.checkNotNull(
              invalidated, r'$AnalysisHistoryOutcomeStats', 'invalidated'),
          winRate: winRate,
          completionRate: completionRate,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
