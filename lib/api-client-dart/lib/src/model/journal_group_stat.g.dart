// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'journal_group_stat.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$JournalGroupStat extends JournalGroupStat {
  @override
  final String key;
  @override
  final num winRate;
  @override
  final int total;
  @override
  final num? avgPnlPercent;

  factory _$JournalGroupStat(
          [void Function(JournalGroupStatBuilder)? updates]) =>
      (JournalGroupStatBuilder()..update(updates))._build();

  _$JournalGroupStat._(
      {required this.key,
      required this.winRate,
      required this.total,
      this.avgPnlPercent})
      : super._();
  @override
  JournalGroupStat rebuild(void Function(JournalGroupStatBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  JournalGroupStatBuilder toBuilder() =>
      JournalGroupStatBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is JournalGroupStat &&
        key == other.key &&
        winRate == other.winRate &&
        total == other.total &&
        avgPnlPercent == other.avgPnlPercent;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, key.hashCode);
    _$hash = $jc(_$hash, winRate.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, avgPnlPercent.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'JournalGroupStat')
          ..add('key', key)
          ..add('winRate', winRate)
          ..add('total', total)
          ..add('avgPnlPercent', avgPnlPercent))
        .toString();
  }
}

class JournalGroupStatBuilder
    implements Builder<JournalGroupStat, JournalGroupStatBuilder> {
  _$JournalGroupStat? _$v;

  String? _key;
  String? get key => _$this._key;
  set key(String? key) => _$this._key = key;

  num? _winRate;
  num? get winRate => _$this._winRate;
  set winRate(num? winRate) => _$this._winRate = winRate;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  num? _avgPnlPercent;
  num? get avgPnlPercent => _$this._avgPnlPercent;
  set avgPnlPercent(num? avgPnlPercent) =>
      _$this._avgPnlPercent = avgPnlPercent;

  JournalGroupStatBuilder() {
    JournalGroupStat._defaults(this);
  }

  JournalGroupStatBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _key = $v.key;
      _winRate = $v.winRate;
      _total = $v.total;
      _avgPnlPercent = $v.avgPnlPercent;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(JournalGroupStat other) {
    _$v = other as _$JournalGroupStat;
  }

  @override
  void update(void Function(JournalGroupStatBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  JournalGroupStat build() => _build();

  _$JournalGroupStat _build() {
    final _$result = _$v ??
        _$JournalGroupStat._(
          key: BuiltValueNullFieldError.checkNotNull(
              key, r'JournalGroupStat', 'key'),
          winRate: BuiltValueNullFieldError.checkNotNull(
              winRate, r'JournalGroupStat', 'winRate'),
          total: BuiltValueNullFieldError.checkNotNull(
              total, r'JournalGroupStat', 'total'),
          avgPnlPercent: avgPnlPercent,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
