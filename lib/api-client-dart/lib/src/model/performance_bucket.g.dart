// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_bucket.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PerformanceBucket extends PerformanceBucket {
  @override
  final String key;
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

  factory _$PerformanceBucket(
          [void Function(PerformanceBucketBuilder)? updates]) =>
      (PerformanceBucketBuilder()..update(updates))._build();

  _$PerformanceBucket._(
      {required this.key,
      required this.triggered,
      required this.wins,
      required this.losses,
      required this.expired,
      required this.total,
      required this.winRate,
      required this.hitRate})
      : super._();
  @override
  PerformanceBucket rebuild(void Function(PerformanceBucketBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PerformanceBucketBuilder toBuilder() =>
      PerformanceBucketBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PerformanceBucket &&
        key == other.key &&
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
    _$hash = $jc(_$hash, key.hashCode);
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
    return (newBuiltValueToStringHelper(r'PerformanceBucket')
          ..add('key', key)
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

class PerformanceBucketBuilder
    implements Builder<PerformanceBucket, PerformanceBucketBuilder> {
  _$PerformanceBucket? _$v;

  String? _key;
  String? get key => _$this._key;
  set key(String? key) => _$this._key = key;

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

  PerformanceBucketBuilder() {
    PerformanceBucket._defaults(this);
  }

  PerformanceBucketBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _key = $v.key;
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
  void replace(PerformanceBucket other) {
    _$v = other as _$PerformanceBucket;
  }

  @override
  void update(void Function(PerformanceBucketBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PerformanceBucket build() => _build();

  _$PerformanceBucket _build() {
    final _$result = _$v ??
        _$PerformanceBucket._(
          key: BuiltValueNullFieldError.checkNotNull(
              key, r'PerformanceBucket', 'key'),
          triggered: BuiltValueNullFieldError.checkNotNull(
              triggered, r'PerformanceBucket', 'triggered'),
          wins: BuiltValueNullFieldError.checkNotNull(
              wins, r'PerformanceBucket', 'wins'),
          losses: BuiltValueNullFieldError.checkNotNull(
              losses, r'PerformanceBucket', 'losses'),
          expired: BuiltValueNullFieldError.checkNotNull(
              expired, r'PerformanceBucket', 'expired'),
          total: BuiltValueNullFieldError.checkNotNull(
              total, r'PerformanceBucket', 'total'),
          winRate: BuiltValueNullFieldError.checkNotNull(
              winRate, r'PerformanceBucket', 'winRate'),
          hitRate: BuiltValueNullFieldError.checkNotNull(
              hitRate, r'PerformanceBucket', 'hitRate'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
