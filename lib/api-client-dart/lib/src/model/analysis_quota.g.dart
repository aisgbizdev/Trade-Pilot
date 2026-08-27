// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_quota.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalysisQuota extends AnalysisQuota {
  @override
  final bool unlimited;
  @override
  final AnalysisQuotaHourly hourly;
  @override
  final AnalysisQuotaHourly daily;

  factory _$AnalysisQuota([void Function(AnalysisQuotaBuilder)? updates]) =>
      (AnalysisQuotaBuilder()..update(updates))._build();

  _$AnalysisQuota._(
      {required this.unlimited, required this.hourly, required this.daily})
      : super._();
  @override
  AnalysisQuota rebuild(void Function(AnalysisQuotaBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisQuotaBuilder toBuilder() => AnalysisQuotaBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysisQuota &&
        unlimited == other.unlimited &&
        hourly == other.hourly &&
        daily == other.daily;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, unlimited.hashCode);
    _$hash = $jc(_$hash, hourly.hashCode);
    _$hash = $jc(_$hash, daily.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalysisQuota')
          ..add('unlimited', unlimited)
          ..add('hourly', hourly)
          ..add('daily', daily))
        .toString();
  }
}

class AnalysisQuotaBuilder
    implements Builder<AnalysisQuota, AnalysisQuotaBuilder> {
  _$AnalysisQuota? _$v;

  bool? _unlimited;
  bool? get unlimited => _$this._unlimited;
  set unlimited(bool? unlimited) => _$this._unlimited = unlimited;

  AnalysisQuotaHourlyBuilder? _hourly;
  AnalysisQuotaHourlyBuilder get hourly =>
      _$this._hourly ??= AnalysisQuotaHourlyBuilder();
  set hourly(AnalysisQuotaHourlyBuilder? hourly) => _$this._hourly = hourly;

  AnalysisQuotaHourlyBuilder? _daily;
  AnalysisQuotaHourlyBuilder get daily =>
      _$this._daily ??= AnalysisQuotaHourlyBuilder();
  set daily(AnalysisQuotaHourlyBuilder? daily) => _$this._daily = daily;

  AnalysisQuotaBuilder() {
    AnalysisQuota._defaults(this);
  }

  AnalysisQuotaBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _unlimited = $v.unlimited;
      _hourly = $v.hourly.toBuilder();
      _daily = $v.daily.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalysisQuota other) {
    _$v = other as _$AnalysisQuota;
  }

  @override
  void update(void Function(AnalysisQuotaBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysisQuota build() => _build();

  _$AnalysisQuota _build() {
    _$AnalysisQuota _$result;
    try {
      _$result = _$v ??
          _$AnalysisQuota._(
            unlimited: BuiltValueNullFieldError.checkNotNull(
                unlimited, r'AnalysisQuota', 'unlimited'),
            hourly: hourly.build(),
            daily: daily.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'hourly';
        hourly.build();
        _$failedField = 'daily';
        daily.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AnalysisQuota', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
