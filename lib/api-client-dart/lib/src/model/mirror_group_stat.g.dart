// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mirror_group_stat.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MirrorGroupStat extends MirrorGroupStat {
  @override
  final String key;
  @override
  final int total;
  @override
  final int wins;
  @override
  final num winRate;
  @override
  final num avgPnlPercent;

  factory _$MirrorGroupStat([void Function(MirrorGroupStatBuilder)? updates]) =>
      (MirrorGroupStatBuilder()..update(updates))._build();

  _$MirrorGroupStat._(
      {required this.key,
      required this.total,
      required this.wins,
      required this.winRate,
      required this.avgPnlPercent})
      : super._();
  @override
  MirrorGroupStat rebuild(void Function(MirrorGroupStatBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MirrorGroupStatBuilder toBuilder() => MirrorGroupStatBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MirrorGroupStat &&
        key == other.key &&
        total == other.total &&
        wins == other.wins &&
        winRate == other.winRate &&
        avgPnlPercent == other.avgPnlPercent;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, key.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, wins.hashCode);
    _$hash = $jc(_$hash, winRate.hashCode);
    _$hash = $jc(_$hash, avgPnlPercent.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MirrorGroupStat')
          ..add('key', key)
          ..add('total', total)
          ..add('wins', wins)
          ..add('winRate', winRate)
          ..add('avgPnlPercent', avgPnlPercent))
        .toString();
  }
}

class MirrorGroupStatBuilder
    implements Builder<MirrorGroupStat, MirrorGroupStatBuilder> {
  _$MirrorGroupStat? _$v;

  String? _key;
  String? get key => _$this._key;
  set key(String? key) => _$this._key = key;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  int? _wins;
  int? get wins => _$this._wins;
  set wins(int? wins) => _$this._wins = wins;

  num? _winRate;
  num? get winRate => _$this._winRate;
  set winRate(num? winRate) => _$this._winRate = winRate;

  num? _avgPnlPercent;
  num? get avgPnlPercent => _$this._avgPnlPercent;
  set avgPnlPercent(num? avgPnlPercent) =>
      _$this._avgPnlPercent = avgPnlPercent;

  MirrorGroupStatBuilder() {
    MirrorGroupStat._defaults(this);
  }

  MirrorGroupStatBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _key = $v.key;
      _total = $v.total;
      _wins = $v.wins;
      _winRate = $v.winRate;
      _avgPnlPercent = $v.avgPnlPercent;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MirrorGroupStat other) {
    _$v = other as _$MirrorGroupStat;
  }

  @override
  void update(void Function(MirrorGroupStatBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MirrorGroupStat build() => _build();

  _$MirrorGroupStat _build() {
    final _$result = _$v ??
        _$MirrorGroupStat._(
          key: BuiltValueNullFieldError.checkNotNull(
              key, r'MirrorGroupStat', 'key'),
          total: BuiltValueNullFieldError.checkNotNull(
              total, r'MirrorGroupStat', 'total'),
          wins: BuiltValueNullFieldError.checkNotNull(
              wins, r'MirrorGroupStat', 'wins'),
          winRate: BuiltValueNullFieldError.checkNotNull(
              winRate, r'MirrorGroupStat', 'winRate'),
          avgPnlPercent: BuiltValueNullFieldError.checkNotNull(
              avgPnlPercent, r'MirrorGroupStat', 'avgPnlPercent'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
