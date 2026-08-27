// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_quota_hourly.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysisQuotaHourly extends AnalysisQuotaHourly {
  @override
  final int limit;
  @override
  final int used;
  @override
  final int remaining;

  factory _$AnalysisQuotaHourly(
          [void Function(AnalysisQuotaHourlyBuilder)? updates]) =>
      (AnalysisQuotaHourlyBuilder()..update(updates))._build();

  _$AnalysisQuotaHourly._(
      {required this.limit, required this.used, required this.remaining})
      : super._();
  @override
  AnalysisQuotaHourly rebuild(
          void Function(AnalysisQuotaHourlyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisQuotaHourlyBuilder toBuilder() =>
      AnalysisQuotaHourlyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysisQuotaHourly &&
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
    return (newBuiltValueToStringHelper(r'AnalysisQuotaHourly')
          ..add('limit', limit)
          ..add('used', used)
          ..add('remaining', remaining))
        .toString();
  }
}

class AnalysisQuotaHourlyBuilder
    implements Builder<AnalysisQuotaHourly, AnalysisQuotaHourlyBuilder> {
  _$AnalysisQuotaHourly? _$v;

  int? _limit;
  int? get limit => _$this._limit;
  set limit(int? limit) => _$this._limit = limit;

  int? _used;
  int? get used => _$this._used;
  set used(int? used) => _$this._used = used;

  int? _remaining;
  int? get remaining => _$this._remaining;
  set remaining(int? remaining) => _$this._remaining = remaining;

  AnalysisQuotaHourlyBuilder() {
    AnalysisQuotaHourly._defaults(this);
  }

  AnalysisQuotaHourlyBuilder get _$this {
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
  void replace(AnalysisQuotaHourly other) {
    _$v = other as _$AnalysisQuotaHourly;
  }

  @override
  void update(void Function(AnalysisQuotaHourlyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysisQuotaHourly build() => _build();

  _$AnalysisQuotaHourly _build() {
    final _$result = _$v ??
        _$AnalysisQuotaHourly._(
          limit: BuiltValueNullFieldError.checkNotNull(
              limit, r'AnalysisQuotaHourly', 'limit'),
          used: BuiltValueNullFieldError.checkNotNull(
              used, r'AnalysisQuotaHourly', 'used'),
          remaining: BuiltValueNullFieldError.checkNotNull(
              remaining, r'AnalysisQuotaHourly', 'remaining'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
