// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'journal_stats.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$JournalStats extends JournalStats {
  @override
  final JournalStatsTotals totals;
  @override
  final num? winRate;
  @override
  final num? avgPnlPercent;
  @override
  final num? avgPnlAmount;
  @override
  final JournalGroupStat? bestInstrument;
  @override
  final JournalGroupStat? worstInstrument;
  @override
  final JournalGroupStat? bestSession;
  @override
  final JournalGroupStat? worstSession;

  factory _$JournalStats([void Function(JournalStatsBuilder)? updates]) =>
      (JournalStatsBuilder()..update(updates))._build();

  _$JournalStats._(
      {required this.totals,
      this.winRate,
      this.avgPnlPercent,
      this.avgPnlAmount,
      this.bestInstrument,
      this.worstInstrument,
      this.bestSession,
      this.worstSession})
      : super._();
  @override
  JournalStats rebuild(void Function(JournalStatsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  JournalStatsBuilder toBuilder() => JournalStatsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is JournalStats &&
        totals == other.totals &&
        winRate == other.winRate &&
        avgPnlPercent == other.avgPnlPercent &&
        avgPnlAmount == other.avgPnlAmount &&
        bestInstrument == other.bestInstrument &&
        worstInstrument == other.worstInstrument &&
        bestSession == other.bestSession &&
        worstSession == other.worstSession;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totals.hashCode);
    _$hash = $jc(_$hash, winRate.hashCode);
    _$hash = $jc(_$hash, avgPnlPercent.hashCode);
    _$hash = $jc(_$hash, avgPnlAmount.hashCode);
    _$hash = $jc(_$hash, bestInstrument.hashCode);
    _$hash = $jc(_$hash, worstInstrument.hashCode);
    _$hash = $jc(_$hash, bestSession.hashCode);
    _$hash = $jc(_$hash, worstSession.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'JournalStats')
          ..add('totals', totals)
          ..add('winRate', winRate)
          ..add('avgPnlPercent', avgPnlPercent)
          ..add('avgPnlAmount', avgPnlAmount)
          ..add('bestInstrument', bestInstrument)
          ..add('worstInstrument', worstInstrument)
          ..add('bestSession', bestSession)
          ..add('worstSession', worstSession))
        .toString();
  }
}

class JournalStatsBuilder
    implements Builder<JournalStats, JournalStatsBuilder> {
  _$JournalStats? _$v;

  JournalStatsTotalsBuilder? _totals;
  JournalStatsTotalsBuilder get totals =>
      _$this._totals ??= JournalStatsTotalsBuilder();
  set totals(JournalStatsTotalsBuilder? totals) => _$this._totals = totals;

  num? _winRate;
  num? get winRate => _$this._winRate;
  set winRate(num? winRate) => _$this._winRate = winRate;

  num? _avgPnlPercent;
  num? get avgPnlPercent => _$this._avgPnlPercent;
  set avgPnlPercent(num? avgPnlPercent) =>
      _$this._avgPnlPercent = avgPnlPercent;

  num? _avgPnlAmount;
  num? get avgPnlAmount => _$this._avgPnlAmount;
  set avgPnlAmount(num? avgPnlAmount) => _$this._avgPnlAmount = avgPnlAmount;

  JournalGroupStatBuilder? _bestInstrument;
  JournalGroupStatBuilder get bestInstrument =>
      _$this._bestInstrument ??= JournalGroupStatBuilder();
  set bestInstrument(JournalGroupStatBuilder? bestInstrument) =>
      _$this._bestInstrument = bestInstrument;

  JournalGroupStatBuilder? _worstInstrument;
  JournalGroupStatBuilder get worstInstrument =>
      _$this._worstInstrument ??= JournalGroupStatBuilder();
  set worstInstrument(JournalGroupStatBuilder? worstInstrument) =>
      _$this._worstInstrument = worstInstrument;

  JournalGroupStatBuilder? _bestSession;
  JournalGroupStatBuilder get bestSession =>
      _$this._bestSession ??= JournalGroupStatBuilder();
  set bestSession(JournalGroupStatBuilder? bestSession) =>
      _$this._bestSession = bestSession;

  JournalGroupStatBuilder? _worstSession;
  JournalGroupStatBuilder get worstSession =>
      _$this._worstSession ??= JournalGroupStatBuilder();
  set worstSession(JournalGroupStatBuilder? worstSession) =>
      _$this._worstSession = worstSession;

  JournalStatsBuilder() {
    JournalStats._defaults(this);
  }

  JournalStatsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totals = $v.totals.toBuilder();
      _winRate = $v.winRate;
      _avgPnlPercent = $v.avgPnlPercent;
      _avgPnlAmount = $v.avgPnlAmount;
      _bestInstrument = $v.bestInstrument?.toBuilder();
      _worstInstrument = $v.worstInstrument?.toBuilder();
      _bestSession = $v.bestSession?.toBuilder();
      _worstSession = $v.worstSession?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(JournalStats other) {
    _$v = other as _$JournalStats;
  }

  @override
  void update(void Function(JournalStatsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  JournalStats build() => _build();

  _$JournalStats _build() {
    _$JournalStats _$result;
    try {
      _$result = _$v ??
          _$JournalStats._(
            totals: totals.build(),
            winRate: winRate,
            avgPnlPercent: avgPnlPercent,
            avgPnlAmount: avgPnlAmount,
            bestInstrument: _bestInstrument?.build(),
            worstInstrument: _worstInstrument?.build(),
            bestSession: _bestSession?.build(),
            worstSession: _worstSession?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'totals';
        totals.build();

        _$failedField = 'bestInstrument';
        _bestInstrument?.build();
        _$failedField = 'worstInstrument';
        _worstInstrument?.build();
        _$failedField = 'bestSession';
        _bestSession?.build();
        _$failedField = 'worstSession';
        _worstSession?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'JournalStats', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
