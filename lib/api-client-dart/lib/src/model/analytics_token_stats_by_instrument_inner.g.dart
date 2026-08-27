// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_token_stats_by_instrument_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsTokenStatsByInstrumentInner
    extends AnalyticsTokenStatsByInstrumentInner {
  @override
  final String instrument;
  @override
  final int totalTokens;
  @override
  final num estimatedCostUsd;

  factory _$AnalyticsTokenStatsByInstrumentInner(
          [void Function(AnalyticsTokenStatsByInstrumentInnerBuilder)?
              updates]) =>
      (AnalyticsTokenStatsByInstrumentInnerBuilder()..update(updates))._build();

  _$AnalyticsTokenStatsByInstrumentInner._(
      {required this.instrument,
      required this.totalTokens,
      required this.estimatedCostUsd})
      : super._();
  @override
  AnalyticsTokenStatsByInstrumentInner rebuild(
          void Function(AnalyticsTokenStatsByInstrumentInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsTokenStatsByInstrumentInnerBuilder toBuilder() =>
      AnalyticsTokenStatsByInstrumentInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsTokenStatsByInstrumentInner &&
        instrument == other.instrument &&
        totalTokens == other.totalTokens &&
        estimatedCostUsd == other.estimatedCostUsd;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, totalTokens.hashCode);
    _$hash = $jc(_$hash, estimatedCostUsd.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsTokenStatsByInstrumentInner')
          ..add('instrument', instrument)
          ..add('totalTokens', totalTokens)
          ..add('estimatedCostUsd', estimatedCostUsd))
        .toString();
  }
}

class AnalyticsTokenStatsByInstrumentInnerBuilder
    implements
        Builder<AnalyticsTokenStatsByInstrumentInner,
            AnalyticsTokenStatsByInstrumentInnerBuilder> {
  _$AnalyticsTokenStatsByInstrumentInner? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  int? _totalTokens;
  int? get totalTokens => _$this._totalTokens;
  set totalTokens(int? totalTokens) => _$this._totalTokens = totalTokens;

  num? _estimatedCostUsd;
  num? get estimatedCostUsd => _$this._estimatedCostUsd;
  set estimatedCostUsd(num? estimatedCostUsd) =>
      _$this._estimatedCostUsd = estimatedCostUsd;

  AnalyticsTokenStatsByInstrumentInnerBuilder() {
    AnalyticsTokenStatsByInstrumentInner._defaults(this);
  }

  AnalyticsTokenStatsByInstrumentInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _totalTokens = $v.totalTokens;
      _estimatedCostUsd = $v.estimatedCostUsd;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsTokenStatsByInstrumentInner other) {
    _$v = other as _$AnalyticsTokenStatsByInstrumentInner;
  }

  @override
  void update(
      void Function(AnalyticsTokenStatsByInstrumentInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsTokenStatsByInstrumentInner build() => _build();

  _$AnalyticsTokenStatsByInstrumentInner _build() {
    final _$result = _$v ??
        _$AnalyticsTokenStatsByInstrumentInner._(
          instrument: BuiltValueNullFieldError.checkNotNull(instrument,
              r'AnalyticsTokenStatsByInstrumentInner', 'instrument'),
          totalTokens: BuiltValueNullFieldError.checkNotNull(totalTokens,
              r'AnalyticsTokenStatsByInstrumentInner', 'totalTokens'),
          estimatedCostUsd: BuiltValueNullFieldError.checkNotNull(
              estimatedCostUsd,
              r'AnalyticsTokenStatsByInstrumentInner',
              'estimatedCostUsd'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
