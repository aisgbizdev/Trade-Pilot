// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const PerformanceSummaryWindowDaysEnum
    _$performanceSummaryWindowDaysEnum_number30 =
    const PerformanceSummaryWindowDaysEnum._('number30');
const PerformanceSummaryWindowDaysEnum
    _$performanceSummaryWindowDaysEnum_number90 =
    const PerformanceSummaryWindowDaysEnum._('number90');

PerformanceSummaryWindowDaysEnum _$performanceSummaryWindowDaysEnumValueOf(
    String name) {
  switch (name) {
    case 'number30':
      return _$performanceSummaryWindowDaysEnum_number30;
    case 'number90':
      return _$performanceSummaryWindowDaysEnum_number90;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<PerformanceSummaryWindowDaysEnum>
    _$performanceSummaryWindowDaysEnumValues = BuiltSet<
        PerformanceSummaryWindowDaysEnum>(const <PerformanceSummaryWindowDaysEnum>[
  _$performanceSummaryWindowDaysEnum_number30,
  _$performanceSummaryWindowDaysEnum_number90,
]);

Serializer<PerformanceSummaryWindowDaysEnum>
    _$performanceSummaryWindowDaysEnumSerializer =
    _$PerformanceSummaryWindowDaysEnumSerializer();

class _$PerformanceSummaryWindowDaysEnumSerializer
    implements PrimitiveSerializer<PerformanceSummaryWindowDaysEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'number30': 30,
    'number90': 90,
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    30: 'number30',
    90: 'number90',
  };

  @override
  final Iterable<Type> types = const <Type>[PerformanceSummaryWindowDaysEnum];
  @override
  final String wireName = 'PerformanceSummaryWindowDaysEnum';

  @override
  Object serialize(
          Serializers serializers, PerformanceSummaryWindowDaysEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  PerformanceSummaryWindowDaysEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      PerformanceSummaryWindowDaysEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$PerformanceSummary extends PerformanceSummary {
  @override
  final PerformanceSummaryWindowDaysEnum windowDays;
  @override
  final DateTime generatedAt;
  @override
  final DateTime windowStart;
  @override
  final PerformanceMinSamples minSamples;
  @override
  final PerformanceOverall overall;
  @override
  final PerformanceBanner banner;
  @override
  final PerformanceSegment byInstrument;
  @override
  final PerformanceSegment bySession;
  @override
  final PerformanceSegment byCondition;
  @override
  final PerformanceSegment byVolatility;
  @override
  final PerformanceSegment byNewsActivity;

  factory _$PerformanceSummary(
          [void Function(PerformanceSummaryBuilder)? updates]) =>
      (PerformanceSummaryBuilder()..update(updates))._build();

  _$PerformanceSummary._(
      {required this.windowDays,
      required this.generatedAt,
      required this.windowStart,
      required this.minSamples,
      required this.overall,
      required this.banner,
      required this.byInstrument,
      required this.bySession,
      required this.byCondition,
      required this.byVolatility,
      required this.byNewsActivity})
      : super._();
  @override
  PerformanceSummary rebuild(
          void Function(PerformanceSummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PerformanceSummaryBuilder toBuilder() =>
      PerformanceSummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PerformanceSummary &&
        windowDays == other.windowDays &&
        generatedAt == other.generatedAt &&
        windowStart == other.windowStart &&
        minSamples == other.minSamples &&
        overall == other.overall &&
        banner == other.banner &&
        byInstrument == other.byInstrument &&
        bySession == other.bySession &&
        byCondition == other.byCondition &&
        byVolatility == other.byVolatility &&
        byNewsActivity == other.byNewsActivity;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, windowDays.hashCode);
    _$hash = $jc(_$hash, generatedAt.hashCode);
    _$hash = $jc(_$hash, windowStart.hashCode);
    _$hash = $jc(_$hash, minSamples.hashCode);
    _$hash = $jc(_$hash, overall.hashCode);
    _$hash = $jc(_$hash, banner.hashCode);
    _$hash = $jc(_$hash, byInstrument.hashCode);
    _$hash = $jc(_$hash, bySession.hashCode);
    _$hash = $jc(_$hash, byCondition.hashCode);
    _$hash = $jc(_$hash, byVolatility.hashCode);
    _$hash = $jc(_$hash, byNewsActivity.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PerformanceSummary')
          ..add('windowDays', windowDays)
          ..add('generatedAt', generatedAt)
          ..add('windowStart', windowStart)
          ..add('minSamples', minSamples)
          ..add('overall', overall)
          ..add('banner', banner)
          ..add('byInstrument', byInstrument)
          ..add('bySession', bySession)
          ..add('byCondition', byCondition)
          ..add('byVolatility', byVolatility)
          ..add('byNewsActivity', byNewsActivity))
        .toString();
  }
}

class PerformanceSummaryBuilder
    implements Builder<PerformanceSummary, PerformanceSummaryBuilder> {
  _$PerformanceSummary? _$v;

  PerformanceSummaryWindowDaysEnum? _windowDays;
  PerformanceSummaryWindowDaysEnum? get windowDays => _$this._windowDays;
  set windowDays(PerformanceSummaryWindowDaysEnum? windowDays) =>
      _$this._windowDays = windowDays;

  DateTime? _generatedAt;
  DateTime? get generatedAt => _$this._generatedAt;
  set generatedAt(DateTime? generatedAt) => _$this._generatedAt = generatedAt;

  DateTime? _windowStart;
  DateTime? get windowStart => _$this._windowStart;
  set windowStart(DateTime? windowStart) => _$this._windowStart = windowStart;

  PerformanceMinSamplesBuilder? _minSamples;
  PerformanceMinSamplesBuilder get minSamples =>
      _$this._minSamples ??= PerformanceMinSamplesBuilder();
  set minSamples(PerformanceMinSamplesBuilder? minSamples) =>
      _$this._minSamples = minSamples;

  PerformanceOverallBuilder? _overall;
  PerformanceOverallBuilder get overall =>
      _$this._overall ??= PerformanceOverallBuilder();
  set overall(PerformanceOverallBuilder? overall) => _$this._overall = overall;

  PerformanceBannerBuilder? _banner;
  PerformanceBannerBuilder get banner =>
      _$this._banner ??= PerformanceBannerBuilder();
  set banner(PerformanceBannerBuilder? banner) => _$this._banner = banner;

  PerformanceSegmentBuilder? _byInstrument;
  PerformanceSegmentBuilder get byInstrument =>
      _$this._byInstrument ??= PerformanceSegmentBuilder();
  set byInstrument(PerformanceSegmentBuilder? byInstrument) =>
      _$this._byInstrument = byInstrument;

  PerformanceSegmentBuilder? _bySession;
  PerformanceSegmentBuilder get bySession =>
      _$this._bySession ??= PerformanceSegmentBuilder();
  set bySession(PerformanceSegmentBuilder? bySession) =>
      _$this._bySession = bySession;

  PerformanceSegmentBuilder? _byCondition;
  PerformanceSegmentBuilder get byCondition =>
      _$this._byCondition ??= PerformanceSegmentBuilder();
  set byCondition(PerformanceSegmentBuilder? byCondition) =>
      _$this._byCondition = byCondition;

  PerformanceSegmentBuilder? _byVolatility;
  PerformanceSegmentBuilder get byVolatility =>
      _$this._byVolatility ??= PerformanceSegmentBuilder();
  set byVolatility(PerformanceSegmentBuilder? byVolatility) =>
      _$this._byVolatility = byVolatility;

  PerformanceSegmentBuilder? _byNewsActivity;
  PerformanceSegmentBuilder get byNewsActivity =>
      _$this._byNewsActivity ??= PerformanceSegmentBuilder();
  set byNewsActivity(PerformanceSegmentBuilder? byNewsActivity) =>
      _$this._byNewsActivity = byNewsActivity;

  PerformanceSummaryBuilder() {
    PerformanceSummary._defaults(this);
  }

  PerformanceSummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _windowDays = $v.windowDays;
      _generatedAt = $v.generatedAt;
      _windowStart = $v.windowStart;
      _minSamples = $v.minSamples.toBuilder();
      _overall = $v.overall.toBuilder();
      _banner = $v.banner.toBuilder();
      _byInstrument = $v.byInstrument.toBuilder();
      _bySession = $v.bySession.toBuilder();
      _byCondition = $v.byCondition.toBuilder();
      _byVolatility = $v.byVolatility.toBuilder();
      _byNewsActivity = $v.byNewsActivity.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PerformanceSummary other) {
    _$v = other as _$PerformanceSummary;
  }

  @override
  void update(void Function(PerformanceSummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PerformanceSummary build() => _build();

  _$PerformanceSummary _build() {
    _$PerformanceSummary _$result;
    try {
      _$result = _$v ??
          _$PerformanceSummary._(
            windowDays: BuiltValueNullFieldError.checkNotNull(
                windowDays, r'PerformanceSummary', 'windowDays'),
            generatedAt: BuiltValueNullFieldError.checkNotNull(
                generatedAt, r'PerformanceSummary', 'generatedAt'),
            windowStart: BuiltValueNullFieldError.checkNotNull(
                windowStart, r'PerformanceSummary', 'windowStart'),
            minSamples: minSamples.build(),
            overall: overall.build(),
            banner: banner.build(),
            byInstrument: byInstrument.build(),
            bySession: bySession.build(),
            byCondition: byCondition.build(),
            byVolatility: byVolatility.build(),
            byNewsActivity: byNewsActivity.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'minSamples';
        minSamples.build();
        _$failedField = 'overall';
        overall.build();
        _$failedField = 'banner';
        banner.build();
        _$failedField = 'byInstrument';
        byInstrument.build();
        _$failedField = 'bySession';
        bySession.build();
        _$failedField = 'byCondition';
        byCondition.build();
        _$failedField = 'byVolatility';
        byVolatility.build();
        _$failedField = 'byNewsActivity';
        byNewsActivity.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PerformanceSummary', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
