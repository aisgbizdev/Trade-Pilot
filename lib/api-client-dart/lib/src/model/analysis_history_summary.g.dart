// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_history_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const AnalysisHistorySummaryRangeEnum _$analysisHistorySummaryRangeEnum_n7 =
    const AnalysisHistorySummaryRangeEnum._('n7');
const AnalysisHistorySummaryRangeEnum _$analysisHistorySummaryRangeEnum_n30 =
    const AnalysisHistorySummaryRangeEnum._('n30');
const AnalysisHistorySummaryRangeEnum _$analysisHistorySummaryRangeEnum_n90 =
    const AnalysisHistorySummaryRangeEnum._('n90');
const AnalysisHistorySummaryRangeEnum _$analysisHistorySummaryRangeEnum_all =
    const AnalysisHistorySummaryRangeEnum._('all');

AnalysisHistorySummaryRangeEnum _$analysisHistorySummaryRangeEnumValueOf(
    String name) {
  switch (name) {
    case 'n7':
      return _$analysisHistorySummaryRangeEnum_n7;
    case 'n30':
      return _$analysisHistorySummaryRangeEnum_n30;
    case 'n90':
      return _$analysisHistorySummaryRangeEnum_n90;
    case 'all':
      return _$analysisHistorySummaryRangeEnum_all;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AnalysisHistorySummaryRangeEnum>
    _$analysisHistorySummaryRangeEnumValues = BuiltSet<
        AnalysisHistorySummaryRangeEnum>(const <AnalysisHistorySummaryRangeEnum>[
  _$analysisHistorySummaryRangeEnum_n7,
  _$analysisHistorySummaryRangeEnum_n30,
  _$analysisHistorySummaryRangeEnum_n90,
  _$analysisHistorySummaryRangeEnum_all,
]);

Serializer<AnalysisHistorySummaryRangeEnum>
    _$analysisHistorySummaryRangeEnumSerializer =
    _$AnalysisHistorySummaryRangeEnumSerializer();

class _$AnalysisHistorySummaryRangeEnumSerializer
    implements PrimitiveSerializer<AnalysisHistorySummaryRangeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'n7': '7',
    'n30': '30',
    'n90': '90',
    'all': 'all',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    '7': 'n7',
    '30': 'n30',
    '90': 'n90',
    'all': 'all',
  };

  @override
  final Iterable<Type> types = const <Type>[AnalysisHistorySummaryRangeEnum];
  @override
  final String wireName = 'AnalysisHistorySummaryRangeEnum';

  @override
  Object serialize(
          Serializers serializers, AnalysisHistorySummaryRangeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AnalysisHistorySummaryRangeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AnalysisHistorySummaryRangeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AnalysisHistorySummary extends AnalysisHistorySummary {
  @override
  final AnalysisHistorySummaryRangeEnum range;
  @override
  final int minSamples;
  @override
  final AnalysisHistoryOutcomeStats overall;
  @override
  final BuiltList<AnalysisHistoryTimeframeStats> byTimeframe;

  factory _$AnalysisHistorySummary(
          [void Function(AnalysisHistorySummaryBuilder)? updates]) =>
      (AnalysisHistorySummaryBuilder()..update(updates))._build();

  _$AnalysisHistorySummary._(
      {required this.range,
      required this.minSamples,
      required this.overall,
      required this.byTimeframe})
      : super._();
  @override
  AnalysisHistorySummary rebuild(
          void Function(AnalysisHistorySummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisHistorySummaryBuilder toBuilder() =>
      AnalysisHistorySummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalysisHistorySummary &&
        range == other.range &&
        minSamples == other.minSamples &&
        overall == other.overall &&
        byTimeframe == other.byTimeframe;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, range.hashCode);
    _$hash = $jc(_$hash, minSamples.hashCode);
    _$hash = $jc(_$hash, overall.hashCode);
    _$hash = $jc(_$hash, byTimeframe.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalysisHistorySummary')
          ..add('range', range)
          ..add('minSamples', minSamples)
          ..add('overall', overall)
          ..add('byTimeframe', byTimeframe))
        .toString();
  }
}

class AnalysisHistorySummaryBuilder
    implements Builder<AnalysisHistorySummary, AnalysisHistorySummaryBuilder> {
  _$AnalysisHistorySummary? _$v;

  AnalysisHistorySummaryRangeEnum? _range;
  AnalysisHistorySummaryRangeEnum? get range => _$this._range;
  set range(AnalysisHistorySummaryRangeEnum? range) => _$this._range = range;

  int? _minSamples;
  int? get minSamples => _$this._minSamples;
  set minSamples(int? minSamples) => _$this._minSamples = minSamples;

  AnalysisHistoryOutcomeStats? _overall;
  AnalysisHistoryOutcomeStats? get overall => _$this._overall;
  set overall(AnalysisHistoryOutcomeStats? overall) =>
      _$this._overall = overall;

  ListBuilder<AnalysisHistoryTimeframeStats>? _byTimeframe;
  ListBuilder<AnalysisHistoryTimeframeStats> get byTimeframe =>
      _$this._byTimeframe ??= ListBuilder<AnalysisHistoryTimeframeStats>();
  set byTimeframe(ListBuilder<AnalysisHistoryTimeframeStats>? byTimeframe) =>
      _$this._byTimeframe = byTimeframe;

  AnalysisHistorySummaryBuilder() {
    AnalysisHistorySummary._defaults(this);
  }

  AnalysisHistorySummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _range = $v.range;
      _minSamples = $v.minSamples;
      _overall = $v.overall;
      _byTimeframe = $v.byTimeframe.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalysisHistorySummary other) {
    _$v = other as _$AnalysisHistorySummary;
  }

  @override
  void update(void Function(AnalysisHistorySummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalysisHistorySummary build() => _build();

  _$AnalysisHistorySummary _build() {
    _$AnalysisHistorySummary _$result;
    try {
      _$result = _$v ??
          _$AnalysisHistorySummary._(
            range: BuiltValueNullFieldError.checkNotNull(
                range, r'AnalysisHistorySummary', 'range'),
            minSamples: BuiltValueNullFieldError.checkNotNull(
                minSamples, r'AnalysisHistorySummary', 'minSamples'),
            overall: BuiltValueNullFieldError.checkNotNull(
                overall, r'AnalysisHistorySummary', 'overall'),
            byTimeframe: byTimeframe.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'byTimeframe';
        byTimeframe.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AnalysisHistorySummary', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
