// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_overall.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PerformanceOverall extends PerformanceOverall {
  @override
  final int triggered;
  @override
  final int wins;
  @override
  final int losses;
  @override
  final int expired;
  @override
  final int total;
  @override
  final num winRate;
  @override
  final num hitRate;

  factory _$PerformanceOverall(
          [void Function(PerformanceOverallBuilder)? updates]) =>
      (PerformanceOverallBuilder()..update(updates))._build();

  _$PerformanceOverall._(
      {required this.triggered,
      required this.wins,
      required this.losses,
      required this.expired,
      required this.total,
      required this.winRate,
      required this.hitRate})
      : super._();
  @override
  PerformanceOverall rebuild(
          void Function(PerformanceOverallBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PerformanceOverallBuilder toBuilder() =>
      PerformanceOverallBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PerformanceOverall &&
        triggered == other.triggered &&
        wins == other.wins &&
        losses == other.losses &&
        expired == other.expired &&
        total == other.total &&
        winRate == other.winRate &&
        hitRate == other.hitRate;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, triggered.hashCode);
    _$hash = $jc(_$hash, wins.hashCode);
    _$hash = $jc(_$hash, losses.hashCode);
    _$hash = $jc(_$hash, expired.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, winRate.hashCode);
    _$hash = $jc(_$hash, hitRate.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PerformanceOverall')
          ..add('triggered', triggered)
          ..add('wins', wins)
          ..add('losses', losses)
          ..add('expired', expired)
          ..add('total', total)
          ..add('winRate', winRate)
          ..add('hitRate', hitRate))
        .toString();
  }
}

class PerformanceOverallBuilder
    implements Builder<PerformanceOverall, PerformanceOverallBuilder> {
  _$PerformanceOverall? _$v;

  int? _triggered;
  int? get triggered => _$this._triggered;
  set triggered(int? triggered) => _$this._triggered = triggered;

  int? _wins;
  int? get wins => _$this._wins;
  set wins(int? wins) => _$this._wins = wins;

  int? _losses;
  int? get losses => _$this._losses;
  set losses(int? losses) => _$this._losses = losses;

  int? _expired;
  int? get expired => _$this._expired;
  set expired(int? expired) => _$this._expired = expired;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  num? _winRate;
  num? get winRate => _$this._winRate;
  set winRate(num? winRate) => _$this._winRate = winRate;

  num? _hitRate;
  num? get hitRate => _$this._hitRate;
  set hitRate(num? hitRate) => _$this._hitRate = hitRate;

  PerformanceOverallBuilder() {
    PerformanceOverall._defaults(this);
  }

  PerformanceOverallBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _triggered = $v.triggered;
      _wins = $v.wins;
      _losses = $v.losses;
      _expired = $v.expired;
      _total = $v.total;
      _winRate = $v.winRate;
      _hitRate = $v.hitRate;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PerformanceOverall other) {
    _$v = other as _$PerformanceOverall;
  }

  @override
  void update(void Function(PerformanceOverallBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PerformanceOverall build() => _build();

  _$PerformanceOverall _build() {
    final _$result = _$v ??
        _$PerformanceOverall._(
          triggered: BuiltValueNullFieldError.checkNotNull(
              triggered, r'PerformanceOverall', 'triggered'),
          wins: BuiltValueNullFieldError.checkNotNull(
              wins, r'PerformanceOverall', 'wins'),
          losses: BuiltValueNullFieldError.checkNotNull(
              losses, r'PerformanceOverall', 'losses'),
          expired: BuiltValueNullFieldError.checkNotNull(
              expired, r'PerformanceOverall', 'expired'),
          total: BuiltValueNullFieldError.checkNotNull(
              total, r'PerformanceOverall', 'total'),
          winRate: BuiltValueNullFieldError.checkNotNull(
              winRate, r'PerformanceOverall', 'winRate'),
          hitRate: BuiltValueNullFieldError.checkNotNull(
              hitRate, r'PerformanceOverall', 'hitRate'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
