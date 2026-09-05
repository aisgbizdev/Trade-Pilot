// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'timeframe_risk_map_overall.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const TimeframeRiskMapOverallStateEnum _$timeframeRiskMapOverallStateEnum_wait =
    const TimeframeRiskMapOverallStateEnum._('wait');
const TimeframeRiskMapOverallStateEnum
    _$timeframeRiskMapOverallStateEnum_noRecommendation =
    const TimeframeRiskMapOverallStateEnum._('noRecommendation');

TimeframeRiskMapOverallStateEnum _$timeframeRiskMapOverallStateEnumValueOf(
    String name) {
  switch (name) {
    case 'wait':
      return _$timeframeRiskMapOverallStateEnum_wait;
    case 'noRecommendation':
      return _$timeframeRiskMapOverallStateEnum_noRecommendation;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<TimeframeRiskMapOverallStateEnum>
    _$timeframeRiskMapOverallStateEnumValues = BuiltSet<
        TimeframeRiskMapOverallStateEnum>(const <TimeframeRiskMapOverallStateEnum>[
  _$timeframeRiskMapOverallStateEnum_wait,
  _$timeframeRiskMapOverallStateEnum_noRecommendation,
]);

Serializer<TimeframeRiskMapOverallStateEnum>
    _$timeframeRiskMapOverallStateEnumSerializer =
    _$TimeframeRiskMapOverallStateEnumSerializer();

class _$TimeframeRiskMapOverallStateEnumSerializer
    implements PrimitiveSerializer<TimeframeRiskMapOverallStateEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'wait': 'wait',
    'noRecommendation': 'no_recommendation',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'wait': 'wait',
    'no_recommendation': 'noRecommendation',
  };

  @override
  final Iterable<Type> types = const <Type>[TimeframeRiskMapOverallStateEnum];
  @override
  final String wireName = 'TimeframeRiskMapOverallStateEnum';

  @override
  Object serialize(
          Serializers serializers, TimeframeRiskMapOverallStateEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  TimeframeRiskMapOverallStateEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      TimeframeRiskMapOverallStateEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$TimeframeRiskMapOverall extends TimeframeRiskMapOverall {
  @override
  final TimeframeRiskMapOverallStateEnum state;
  @override
  final String reasonCode;

  factory _$TimeframeRiskMapOverall(
          [void Function(TimeframeRiskMapOverallBuilder)? updates]) =>
      (TimeframeRiskMapOverallBuilder()..update(updates))._build();

  _$TimeframeRiskMapOverall._({required this.state, required this.reasonCode})
      : super._();
  @override
  TimeframeRiskMapOverall rebuild(
          void Function(TimeframeRiskMapOverallBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TimeframeRiskMapOverallBuilder toBuilder() =>
      TimeframeRiskMapOverallBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TimeframeRiskMapOverall &&
        state == other.state &&
        reasonCode == other.reasonCode;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, state.hashCode);
    _$hash = $jc(_$hash, reasonCode.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TimeframeRiskMapOverall')
          ..add('state', state)
          ..add('reasonCode', reasonCode))
        .toString();
  }
}

class TimeframeRiskMapOverallBuilder
    implements
        Builder<TimeframeRiskMapOverall, TimeframeRiskMapOverallBuilder> {
  _$TimeframeRiskMapOverall? _$v;

  TimeframeRiskMapOverallStateEnum? _state;
  TimeframeRiskMapOverallStateEnum? get state => _$this._state;
  set state(TimeframeRiskMapOverallStateEnum? state) => _$this._state = state;

  String? _reasonCode;
  String? get reasonCode => _$this._reasonCode;
  set reasonCode(String? reasonCode) => _$this._reasonCode = reasonCode;

  TimeframeRiskMapOverallBuilder() {
    TimeframeRiskMapOverall._defaults(this);
  }

  TimeframeRiskMapOverallBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _state = $v.state;
      _reasonCode = $v.reasonCode;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TimeframeRiskMapOverall other) {
    _$v = other as _$TimeframeRiskMapOverall;
  }

  @override
  void update(void Function(TimeframeRiskMapOverallBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TimeframeRiskMapOverall build() => _build();

  _$TimeframeRiskMapOverall _build() {
    final _$result = _$v ??
        _$TimeframeRiskMapOverall._(
          state: BuiltValueNullFieldError.checkNotNull(
              state, r'TimeframeRiskMapOverall', 'state'),
          reasonCode: BuiltValueNullFieldError.checkNotNull(
              reasonCode, r'TimeframeRiskMapOverall', 'reasonCode'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
