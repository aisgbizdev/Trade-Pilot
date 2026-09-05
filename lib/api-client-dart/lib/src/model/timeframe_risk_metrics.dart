//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'timeframe_risk_metrics.g.dart';

/// TimeframeRiskMetrics
///
/// Properties:
/// * [buySignals]
/// * [sellSignals]
/// * [neutralSignals]
/// * [rsi14]
/// * [change20Pct]
/// * [bollingerWidthPct]
@BuiltValue()
abstract class TimeframeRiskMetrics implements Built<TimeframeRiskMetrics, TimeframeRiskMetricsBuilder> {
  @BuiltValueField(wireName: r'buySignals')
  int get buySignals;

  @BuiltValueField(wireName: r'sellSignals')
  int get sellSignals;

  @BuiltValueField(wireName: r'neutralSignals')
  int get neutralSignals;

  @BuiltValueField(wireName: r'rsi14')
  num get rsi14;

  @BuiltValueField(wireName: r'change20Pct')
  num get change20Pct;

  @BuiltValueField(wireName: r'bollingerWidthPct')
  num get bollingerWidthPct;

  TimeframeRiskMetrics._();

  factory TimeframeRiskMetrics([void updates(TimeframeRiskMetricsBuilder b)]) = _$TimeframeRiskMetrics;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TimeframeRiskMetricsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TimeframeRiskMetrics> get serializer => _$TimeframeRiskMetricsSerializer();
}

class _$TimeframeRiskMetricsSerializer implements PrimitiveSerializer<TimeframeRiskMetrics> {
  @override
  final Iterable<Type> types = const [TimeframeRiskMetrics, _$TimeframeRiskMetrics];

  @override
  final String wireName = r'TimeframeRiskMetrics';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TimeframeRiskMetrics object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'buySignals';
    yield serializers.serialize(
      object.buySignals,
      specifiedType: const FullType(int),
    );
    yield r'sellSignals';
    yield serializers.serialize(
      object.sellSignals,
      specifiedType: const FullType(int),
    );
    yield r'neutralSignals';
    yield serializers.serialize(
      object.neutralSignals,
      specifiedType: const FullType(int),
    );
    yield r'rsi14';
    yield serializers.serialize(
      object.rsi14,
      specifiedType: const FullType(num),
    );
    yield r'change20Pct';
    yield serializers.serialize(
      object.change20Pct,
      specifiedType: const FullType(num),
    );
    yield r'bollingerWidthPct';
    yield serializers.serialize(
      object.bollingerWidthPct,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TimeframeRiskMetrics object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TimeframeRiskMetricsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'buySignals':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.buySignals = valueDes;
          break;
        case r'sellSignals':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.sellSignals = valueDes;
          break;
        case r'neutralSignals':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.neutralSignals = valueDes;
          break;
        case r'rsi14':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.rsi14 = valueDes;
          break;
        case r'change20Pct':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.change20Pct = valueDes;
          break;
        case r'bollingerWidthPct':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.bollingerWidthPct = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TimeframeRiskMetrics deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TimeframeRiskMetricsBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

