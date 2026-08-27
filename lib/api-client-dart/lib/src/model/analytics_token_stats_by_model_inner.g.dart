// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_token_stats_by_model_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnalyticsTokenStatsByModelInner
    extends AnalyticsTokenStatsByModelInner {
  @override
  final String model;
  @override
  final int totalTokens;
  @override
  final num estimatedCostUsd;
  @override
  final int callCount;

  factory _$AnalyticsTokenStatsByModelInner(
          [void Function(AnalyticsTokenStatsByModelInnerBuilder)? updates]) =>
      (AnalyticsTokenStatsByModelInnerBuilder()..update(updates))._build();

  _$AnalyticsTokenStatsByModelInner._(
      {required this.model,
      required this.totalTokens,
      required this.estimatedCostUsd,
      required this.callCount})
      : super._();
  @override
  AnalyticsTokenStatsByModelInner rebuild(
          void Function(AnalyticsTokenStatsByModelInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsTokenStatsByModelInnerBuilder toBuilder() =>
      AnalyticsTokenStatsByModelInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsTokenStatsByModelInner &&
        model == other.model &&
        totalTokens == other.totalTokens &&
        estimatedCostUsd == other.estimatedCostUsd &&
        callCount == other.callCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, model.hashCode);
    _$hash = $jc(_$hash, totalTokens.hashCode);
    _$hash = $jc(_$hash, estimatedCostUsd.hashCode);
    _$hash = $jc(_$hash, callCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsTokenStatsByModelInner')
          ..add('model', model)
          ..add('totalTokens', totalTokens)
          ..add('estimatedCostUsd', estimatedCostUsd)
          ..add('callCount', callCount))
        .toString();
  }
}

class AnalyticsTokenStatsByModelInnerBuilder
    implements
        Builder<AnalyticsTokenStatsByModelInner,
            AnalyticsTokenStatsByModelInnerBuilder> {
  _$AnalyticsTokenStatsByModelInner? _$v;

  String? _model;
  String? get model => _$this._model;
  set model(String? model) => _$this._model = model;

  int? _totalTokens;
  int? get totalTokens => _$this._totalTokens;
  set totalTokens(int? totalTokens) => _$this._totalTokens = totalTokens;

  num? _estimatedCostUsd;
  num? get estimatedCostUsd => _$this._estimatedCostUsd;
  set estimatedCostUsd(num? estimatedCostUsd) =>
      _$this._estimatedCostUsd = estimatedCostUsd;

  int? _callCount;
  int? get callCount => _$this._callCount;
  set callCount(int? callCount) => _$this._callCount = callCount;

  AnalyticsTokenStatsByModelInnerBuilder() {
    AnalyticsTokenStatsByModelInner._defaults(this);
  }

  AnalyticsTokenStatsByModelInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _model = $v.model;
      _totalTokens = $v.totalTokens;
      _estimatedCostUsd = $v.estimatedCostUsd;
      _callCount = $v.callCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsTokenStatsByModelInner other) {
    _$v = other as _$AnalyticsTokenStatsByModelInner;
  }

  @override
  void update(void Function(AnalyticsTokenStatsByModelInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsTokenStatsByModelInner build() => _build();

  _$AnalyticsTokenStatsByModelInner _build() {
    final _$result = _$v ??
        _$AnalyticsTokenStatsByModelInner._(
          model: BuiltValueNullFieldError.checkNotNull(
              model, r'AnalyticsTokenStatsByModelInner', 'model'),
          totalTokens: BuiltValueNullFieldError.checkNotNull(
              totalTokens, r'AnalyticsTokenStatsByModelInner', 'totalTokens'),
          estimatedCostUsd: BuiltValueNullFieldError.checkNotNull(
              estimatedCostUsd,
              r'AnalyticsTokenStatsByModelInner',
              'estimatedCostUsd'),
          callCount: BuiltValueNullFieldError.checkNotNull(
              callCount, r'AnalyticsTokenStatsByModelInner', 'callCount'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
