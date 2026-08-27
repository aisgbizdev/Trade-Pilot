// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_banner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const PerformanceBannerSeverityEnum _$performanceBannerSeverityEnum_ok =
    const PerformanceBannerSeverityEnum._('ok');
const PerformanceBannerSeverityEnum _$performanceBannerSeverityEnum_watch =
    const PerformanceBannerSeverityEnum._('watch');
const PerformanceBannerSeverityEnum _$performanceBannerSeverityEnum_warn =
    const PerformanceBannerSeverityEnum._('warn');

PerformanceBannerSeverityEnum _$performanceBannerSeverityEnumValueOf(
    String name) {
  switch (name) {
    case 'ok':
      return _$performanceBannerSeverityEnum_ok;
    case 'watch':
      return _$performanceBannerSeverityEnum_watch;
    case 'warn':
      return _$performanceBannerSeverityEnum_warn;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<PerformanceBannerSeverityEnum>
    _$performanceBannerSeverityEnumValues = BuiltSet<
        PerformanceBannerSeverityEnum>(const <PerformanceBannerSeverityEnum>[
  _$performanceBannerSeverityEnum_ok,
  _$performanceBannerSeverityEnum_watch,
  _$performanceBannerSeverityEnum_warn,
]);

Serializer<PerformanceBannerSeverityEnum>
    _$performanceBannerSeverityEnumSerializer =
    _$PerformanceBannerSeverityEnumSerializer();

class _$PerformanceBannerSeverityEnumSerializer
    implements PrimitiveSerializer<PerformanceBannerSeverityEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'ok': 'ok',
    'watch': 'watch',
    'warn': 'warn',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'ok': 'ok',
    'watch': 'watch',
    'warn': 'warn',
  };

  @override
  final Iterable<Type> types = const <Type>[PerformanceBannerSeverityEnum];
  @override
  final String wireName = 'PerformanceBannerSeverityEnum';

  @override
  Object serialize(
          Serializers serializers, PerformanceBannerSeverityEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  PerformanceBannerSeverityEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      PerformanceBannerSeverityEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$PerformanceBanner extends PerformanceBanner {
  @override
  final PerformanceBannerSeverityEnum severity;
  @override
  final int recentDays;
  @override
  final int recentSample;
  @override
  final int baselineSample;
  @override
  final num recentHitRate;
  @override
  final num baselineHitRate;
  @override
  final num delta;

  factory _$PerformanceBanner(
          [void Function(PerformanceBannerBuilder)? updates]) =>
      (PerformanceBannerBuilder()..update(updates))._build();

  _$PerformanceBanner._(
      {required this.severity,
      required this.recentDays,
      required this.recentSample,
      required this.baselineSample,
      required this.recentHitRate,
      required this.baselineHitRate,
      required this.delta})
      : super._();
  @override
  PerformanceBanner rebuild(void Function(PerformanceBannerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PerformanceBannerBuilder toBuilder() =>
      PerformanceBannerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PerformanceBanner &&
        severity == other.severity &&
        recentDays == other.recentDays &&
        recentSample == other.recentSample &&
        baselineSample == other.baselineSample &&
        recentHitRate == other.recentHitRate &&
        baselineHitRate == other.baselineHitRate &&
        delta == other.delta;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, severity.hashCode);
    _$hash = $jc(_$hash, recentDays.hashCode);
    _$hash = $jc(_$hash, recentSample.hashCode);
    _$hash = $jc(_$hash, baselineSample.hashCode);
    _$hash = $jc(_$hash, recentHitRate.hashCode);
    _$hash = $jc(_$hash, baselineHitRate.hashCode);
    _$hash = $jc(_$hash, delta.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PerformanceBanner')
          ..add('severity', severity)
          ..add('recentDays', recentDays)
          ..add('recentSample', recentSample)
          ..add('baselineSample', baselineSample)
          ..add('recentHitRate', recentHitRate)
          ..add('baselineHitRate', baselineHitRate)
          ..add('delta', delta))
        .toString();
  }
}

class PerformanceBannerBuilder
    implements Builder<PerformanceBanner, PerformanceBannerBuilder> {
  _$PerformanceBanner? _$v;

  PerformanceBannerSeverityEnum? _severity;
  PerformanceBannerSeverityEnum? get severity => _$this._severity;
  set severity(PerformanceBannerSeverityEnum? severity) =>
      _$this._severity = severity;

  int? _recentDays;
  int? get recentDays => _$this._recentDays;
  set recentDays(int? recentDays) => _$this._recentDays = recentDays;

  int? _recentSample;
  int? get recentSample => _$this._recentSample;
  set recentSample(int? recentSample) => _$this._recentSample = recentSample;

  int? _baselineSample;
  int? get baselineSample => _$this._baselineSample;
  set baselineSample(int? baselineSample) =>
      _$this._baselineSample = baselineSample;

  num? _recentHitRate;
  num? get recentHitRate => _$this._recentHitRate;
  set recentHitRate(num? recentHitRate) =>
      _$this._recentHitRate = recentHitRate;

  num? _baselineHitRate;
  num? get baselineHitRate => _$this._baselineHitRate;
  set baselineHitRate(num? baselineHitRate) =>
      _$this._baselineHitRate = baselineHitRate;

  num? _delta;
  num? get delta => _$this._delta;
  set delta(num? delta) => _$this._delta = delta;

  PerformanceBannerBuilder() {
    PerformanceBanner._defaults(this);
  }

  PerformanceBannerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _severity = $v.severity;
      _recentDays = $v.recentDays;
      _recentSample = $v.recentSample;
      _baselineSample = $v.baselineSample;
      _recentHitRate = $v.recentHitRate;
      _baselineHitRate = $v.baselineHitRate;
      _delta = $v.delta;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PerformanceBanner other) {
    _$v = other as _$PerformanceBanner;
  }

  @override
  void update(void Function(PerformanceBannerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PerformanceBanner build() => _build();

  _$PerformanceBanner _build() {
    final _$result = _$v ??
        _$PerformanceBanner._(
          severity: BuiltValueNullFieldError.checkNotNull(
              severity, r'PerformanceBanner', 'severity'),
          recentDays: BuiltValueNullFieldError.checkNotNull(
              recentDays, r'PerformanceBanner', 'recentDays'),
          recentSample: BuiltValueNullFieldError.checkNotNull(
              recentSample, r'PerformanceBanner', 'recentSample'),
          baselineSample: BuiltValueNullFieldError.checkNotNull(
              baselineSample, r'PerformanceBanner', 'baselineSample'),
          recentHitRate: BuiltValueNullFieldError.checkNotNull(
              recentHitRate, r'PerformanceBanner', 'recentHitRate'),
          baselineHitRate: BuiltValueNullFieldError.checkNotNull(
              baselineHitRate, r'PerformanceBanner', 'baselineHitRate'),
          delta: BuiltValueNullFieldError.checkNotNull(
              delta, r'PerformanceBanner', 'delta'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
