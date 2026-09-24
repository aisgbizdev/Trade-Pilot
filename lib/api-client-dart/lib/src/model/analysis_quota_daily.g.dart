// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_quota_daily.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysisQuotaDaily extends AnalysisQuotaDaily {
  @override
  final int limit;
  @override
  final int used;
  @override
  final int remaining;

  factory _$AnalysisQuotaDaily(
          [void Function(AnalysisQuotaDailyBuilder)? updates]) =>
      (AnalysisQuotaDailyBuilder()..update(updates))._build();

  _$AnalysisQuotaDaily._(
      {required this.limit, required this.used, required this.remaining})
      : super._();
  @override
  AnalysisQuotaDaily rebuild(
          void Function(AnalysisQuotaDailyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisQuotaDailyBuilder toBuilder() =>
      AnalysisQuotaDailyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysisQuotaDaily &&
        limit == other.limit &&
        used == other.used &&
        remaining == other.remaining;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jc(_$hash, used.hashCode);
    _$hash = $jc(_$hash, remaining.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalysisQuotaDaily')
          ..add('limit', limit)
          ..add('used', used)
          ..add('remaining', remaining))
        .toString();
  }
}

class AnalysisQuotaDailyBuilder
    implements Builder<AnalysisQuotaDaily, AnalysisQuotaDailyBuilder> {
  _$AnalysisQuotaDaily? _$v;

  int? _limit;
  int? get limit => _$this._limit;
  set limit(int? limit) => _$this._limit = limit;

  int? _used;
  int? get used => _$this._used;
  set used(int? used) => _$this._used = used;

  int? _remaining;
  int? get remaining => _$this._remaining;
  set remaining(int? remaining) => _$this._remaining = remaining;

  AnalysisQuotaDailyBuilder() {
    AnalysisQuotaDaily._defaults(this);
  }

  AnalysisQuotaDailyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _limit = $v.limit;
      _used = $v.used;
      _remaining = $v.remaining;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalysisQuotaDaily other) {
    _$v = other as _$AnalysisQuotaDaily;
  }

  @override
  void update(void Function(AnalysisQuotaDailyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysisQuotaDaily build() => _build();

  _$AnalysisQuotaDaily _build() {
    final _$result = _$v ??
        _$AnalysisQuotaDaily._(
          limit: BuiltValueNullFieldError.checkNotNull(
              limit, r'AnalysisQuotaDaily', 'limit'),
          used: BuiltValueNullFieldError.checkNotNull(
              used, r'AnalysisQuotaDaily', 'used'),
          remaining: BuiltValueNullFieldError.checkNotNull(
              remaining, r'AnalysisQuotaDaily', 'remaining'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
