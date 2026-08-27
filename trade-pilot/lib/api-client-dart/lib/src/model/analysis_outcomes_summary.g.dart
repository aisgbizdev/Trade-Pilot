// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_outcomes_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysisOutcomesSummary extends AnalysisOutcomesSummary {
  @override
  final int rangeDays;
  @override
  final int total;
  @override
  final int pending;
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
  final int scored;
  @override
  final num? tpHitRate;
  @override
  final num? slHitRate;

  factory _$AnalysisOutcomesSummary(
          [void Function(AnalysisOutcomesSummaryBuilder)? updates]) =>
      (AnalysisOutcomesSummaryBuilder()..update(updates))._build();

  _$AnalysisOutcomesSummary._(
      {required this.rangeDays,
      required this.total,
      required this.pending,
      required this.tp1Hit,
      required this.tp2Hit,
      required this.slHit,
      required this.expired,
      required this.invalidated,
      required this.scored,
      this.tpHitRate,
      this.slHitRate})
      : super._();
  @override
  AnalysisOutcomesSummary rebuild(
          void Function(AnalysisOutcomesSummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisOutcomesSummaryBuilder toBuilder() =>
      AnalysisOutcomesSummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysisOutcomesSummary &&
        rangeDays == other.rangeDays &&
        total == other.total &&
        pending == other.pending &&
        tp1Hit == other.tp1Hit &&
        tp2Hit == other.tp2Hit &&
        slHit == other.slHit &&
        expired == other.expired &&
        invalidated == other.invalidated &&
        scored == other.scored &&
        tpHitRate == other.tpHitRate &&
        slHitRate == other.slHitRate;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, rangeDays.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, pending.hashCode);
    _$hash = $jc(_$hash, tp1Hit.hashCode);
    _$hash = $jc(_$hash, tp2Hit.hashCode);
    _$hash = $jc(_$hash, slHit.hashCode);
    _$hash = $jc(_$hash, expired.hashCode);
    _$hash = $jc(_$hash, invalidated.hashCode);
    _$hash = $jc(_$hash, scored.hashCode);
    _$hash = $jc(_$hash, tpHitRate.hashCode);
    _$hash = $jc(_$hash, slHitRate.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalysisOutcomesSummary')
          ..add('rangeDays', rangeDays)
          ..add('total', total)
          ..add('pending', pending)
          ..add('tp1Hit', tp1Hit)
          ..add('tp2Hit', tp2Hit)
          ..add('slHit', slHit)
          ..add('expired', expired)
          ..add('invalidated', invalidated)
          ..add('scored', scored)
          ..add('tpHitRate', tpHitRate)
          ..add('slHitRate', slHitRate))
        .toString();
  }
}

class AnalysisOutcomesSummaryBuilder
    implements
        Builder<AnalysisOutcomesSummary, AnalysisOutcomesSummaryBuilder> {
  _$AnalysisOutcomesSummary? _$v;

  int? _rangeDays;
  int? get rangeDays => _$this._rangeDays;
  set rangeDays(int? rangeDays) => _$this._rangeDays = rangeDays;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  int? _pending;
  int? get pending => _$this._pending;
  set pending(int? pending) => _$this._pending = pending;

  int? _tp1Hit;
  int? get tp1Hit => _$this._tp1Hit;
  set tp1Hit(int? tp1Hit) => _$this._tp1Hit = tp1Hit;

  int? _tp2Hit;
  int? get tp2Hit => _$this._tp2Hit;
  set tp2Hit(int? tp2Hit) => _$this._tp2Hit = tp2Hit;

  int? _slHit;
  int? get slHit => _$this._slHit;
  set slHit(int? slHit) => _$this._slHit = slHit;

  int? _expired;
  int? get expired => _$this._expired;
  set expired(int? expired) => _$this._expired = expired;

  int? _invalidated;
  int? get invalidated => _$this._invalidated;
  set invalidated(int? invalidated) => _$this._invalidated = invalidated;

  int? _scored;
  int? get scored => _$this._scored;
  set scored(int? scored) => _$this._scored = scored;

  num? _tpHitRate;
  num? get tpHitRate => _$this._tpHitRate;
  set tpHitRate(num? tpHitRate) => _$this._tpHitRate = tpHitRate;

  num? _slHitRate;
  num? get slHitRate => _$this._slHitRate;
  set slHitRate(num? slHitRate) => _$this._slHitRate = slHitRate;

  AnalysisOutcomesSummaryBuilder() {
    AnalysisOutcomesSummary._defaults(this);
  }

  AnalysisOutcomesSummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _rangeDays = $v.rangeDays;
      _total = $v.total;
      _pending = $v.pending;
      _tp1Hit = $v.tp1Hit;
      _tp2Hit = $v.tp2Hit;
      _slHit = $v.slHit;
      _expired = $v.expired;
      _invalidated = $v.invalidated;
      _scored = $v.scored;
      _tpHitRate = $v.tpHitRate;
      _slHitRate = $v.slHitRate;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalysisOutcomesSummary other) {
    _$v = other as _$AnalysisOutcomesSummary;
  }

  @override
  void update(void Function(AnalysisOutcomesSummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysisOutcomesSummary build() => _build();

  _$AnalysisOutcomesSummary _build() {
    final _$result = _$v ??
        _$AnalysisOutcomesSummary._(
          rangeDays: BuiltValueNullFieldError.checkNotNull(
              rangeDays, r'AnalysisOutcomesSummary', 'rangeDays'),
          total: BuiltValueNullFieldError.checkNotNull(
              total, r'AnalysisOutcomesSummary', 'total'),
          pending: BuiltValueNullFieldError.checkNotNull(
              pending, r'AnalysisOutcomesSummary', 'pending'),
          tp1Hit: BuiltValueNullFieldError.checkNotNull(
              tp1Hit, r'AnalysisOutcomesSummary', 'tp1Hit'),
          tp2Hit: BuiltValueNullFieldError.checkNotNull(
              tp2Hit, r'AnalysisOutcomesSummary', 'tp2Hit'),
          slHit: BuiltValueNullFieldError.checkNotNull(
              slHit, r'AnalysisOutcomesSummary', 'slHit'),
          expired: BuiltValueNullFieldError.checkNotNull(
              expired, r'AnalysisOutcomesSummary', 'expired'),
          invalidated: BuiltValueNullFieldError.checkNotNull(
              invalidated, r'AnalysisOutcomesSummary', 'invalidated'),
          scored: BuiltValueNullFieldError.checkNotNull(
              scored, r'AnalysisOutcomesSummary', 'scored'),
          tpHitRate: tpHitRate,
          slHitRate: slHitRate,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
