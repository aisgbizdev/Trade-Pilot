// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_token_stats_by_segment_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const AnalyticsTokenStatsBySegmentInnerSegmentEnum
    _$analyticsTokenStatsBySegmentInnerSegmentEnum_free =
    const AnalyticsTokenStatsBySegmentInnerSegmentEnum._('free');
const AnalyticsTokenStatsBySegmentInnerSegmentEnum
    _$analyticsTokenStatsBySegmentInnerSegmentEnum_paid =
    const AnalyticsTokenStatsBySegmentInnerSegmentEnum._('paid');
const AnalyticsTokenStatsBySegmentInnerSegmentEnum
    _$analyticsTokenStatsBySegmentInnerSegmentEnum_dev =
    const AnalyticsTokenStatsBySegmentInnerSegmentEnum._('dev');

AnalyticsTokenStatsBySegmentInnerSegmentEnum
    _$analyticsTokenStatsBySegmentInnerSegmentEnumValueOf(String name) {
  switch (name) {
    case 'free':
      return _$analyticsTokenStatsBySegmentInnerSegmentEnum_free;
    case 'paid':
      return _$analyticsTokenStatsBySegmentInnerSegmentEnum_paid;
    case 'dev':
      return _$analyticsTokenStatsBySegmentInnerSegmentEnum_dev;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AnalyticsTokenStatsBySegmentInnerSegmentEnum>
    _$analyticsTokenStatsBySegmentInnerSegmentEnumValues = BuiltSet<
        AnalyticsTokenStatsBySegmentInnerSegmentEnum>(const <AnalyticsTokenStatsBySegmentInnerSegmentEnum>[
  _$analyticsTokenStatsBySegmentInnerSegmentEnum_free,
  _$analyticsTokenStatsBySegmentInnerSegmentEnum_paid,
  _$analyticsTokenStatsBySegmentInnerSegmentEnum_dev,
]);

Serializer<AnalyticsTokenStatsBySegmentInnerSegmentEnum>
    _$analyticsTokenStatsBySegmentInnerSegmentEnumSerializer =
    _$AnalyticsTokenStatsBySegmentInnerSegmentEnumSerializer();

class _$AnalyticsTokenStatsBySegmentInnerSegmentEnumSerializer
    implements
        PrimitiveSerializer<AnalyticsTokenStatsBySegmentInnerSegmentEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'free': 'free',
    'paid': 'paid',
    'dev': 'dev',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'free': 'free',
    'paid': 'paid',
    'dev': 'dev',
  };

  @override
  final Iterable<Type> types = const <Type>[
    AnalyticsTokenStatsBySegmentInnerSegmentEnum
  ];
  @override
  final String wireName = 'AnalyticsTokenStatsBySegmentInnerSegmentEnum';

  @override
  Object serialize(Serializers serializers,
          AnalyticsTokenStatsBySegmentInnerSegmentEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AnalyticsTokenStatsBySegmentInnerSegmentEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AnalyticsTokenStatsBySegmentInnerSegmentEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AnalyticsTokenStatsBySegmentInner
    extends AnalyticsTokenStatsBySegmentInner {
  @override
  final AnalyticsTokenStatsBySegmentInnerSegmentEnum segment;
  @override
  final int totalTokens;
  @override
  final num estimatedCostUsd;
  @override
  final int callCount;
  @override
  final int analysisCount;

  factory _$AnalyticsTokenStatsBySegmentInner(
          [void Function(AnalyticsTokenStatsBySegmentInnerBuilder)? updates]) =>
      (AnalyticsTokenStatsBySegmentInnerBuilder()..update(updates))._build();

  _$AnalyticsTokenStatsBySegmentInner._(
      {required this.segment,
      required this.totalTokens,
      required this.estimatedCostUsd,
      required this.callCount,
      required this.analysisCount})
      : super._();
  @override
  AnalyticsTokenStatsBySegmentInner rebuild(
          void Function(AnalyticsTokenStatsBySegmentInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsTokenStatsBySegmentInnerBuilder toBuilder() =>
      AnalyticsTokenStatsBySegmentInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsTokenStatsBySegmentInner &&
        segment == other.segment &&
        totalTokens == other.totalTokens &&
        estimatedCostUsd == other.estimatedCostUsd &&
        callCount == other.callCount &&
        analysisCount == other.analysisCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, segment.hashCode);
    _$hash = $jc(_$hash, totalTokens.hashCode);
    _$hash = $jc(_$hash, estimatedCostUsd.hashCode);
    _$hash = $jc(_$hash, callCount.hashCode);
    _$hash = $jc(_$hash, analysisCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsTokenStatsBySegmentInner')
          ..add('segment', segment)
          ..add('totalTokens', totalTokens)
          ..add('estimatedCostUsd', estimatedCostUsd)
          ..add('callCount', callCount)
          ..add('analysisCount', analysisCount))
        .toString();
  }
}

class AnalyticsTokenStatsBySegmentInnerBuilder
    implements
        Builder<AnalyticsTokenStatsBySegmentInner,
            AnalyticsTokenStatsBySegmentInnerBuilder> {
  _$AnalyticsTokenStatsBySegmentInner? _$v;

  AnalyticsTokenStatsBySegmentInnerSegmentEnum? _segment;
  AnalyticsTokenStatsBySegmentInnerSegmentEnum? get segment => _$this._segment;
  set segment(AnalyticsTokenStatsBySegmentInnerSegmentEnum? segment) =>
      _$this._segment = segment;

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

  int? _analysisCount;
  int? get analysisCount => _$this._analysisCount;
  set analysisCount(int? analysisCount) =>
      _$this._analysisCount = analysisCount;

  AnalyticsTokenStatsBySegmentInnerBuilder() {
    AnalyticsTokenStatsBySegmentInner._defaults(this);
  }

  AnalyticsTokenStatsBySegmentInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _segment = $v.segment;
      _totalTokens = $v.totalTokens;
      _estimatedCostUsd = $v.estimatedCostUsd;
      _callCount = $v.callCount;
      _analysisCount = $v.analysisCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsTokenStatsBySegmentInner other) {
    _$v = other as _$AnalyticsTokenStatsBySegmentInner;
  }

  @override
  void update(
      void Function(AnalyticsTokenStatsBySegmentInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsTokenStatsBySegmentInner build() => _build();

  _$AnalyticsTokenStatsBySegmentInner _build() {
    final _$result = _$v ??
        _$AnalyticsTokenStatsBySegmentInner._(
          segment: BuiltValueNullFieldError.checkNotNull(
              segment, r'AnalyticsTokenStatsBySegmentInner', 'segment'),
          totalTokens: BuiltValueNullFieldError.checkNotNull(
              totalTokens, r'AnalyticsTokenStatsBySegmentInner', 'totalTokens'),
          estimatedCostUsd: BuiltValueNullFieldError.checkNotNull(
              estimatedCostUsd,
              r'AnalyticsTokenStatsBySegmentInner',
              'estimatedCostUsd'),
          callCount: BuiltValueNullFieldError.checkNotNull(
              callCount, r'AnalyticsTokenStatsBySegmentInner', 'callCount'),
          analysisCount: BuiltValueNullFieldError.checkNotNull(analysisCount,
              r'AnalyticsTokenStatsBySegmentInner', 'analysisCount'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
