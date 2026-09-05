//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'timeframe_risk_map_overall.g.dart';

/// TimeframeRiskMapOverall
///
/// Properties:
/// * [state] 
/// * [reasonCode] 
@BuiltValue()
abstract class TimeframeRiskMapOverall implements Built<TimeframeRiskMapOverall, TimeframeRiskMapOverallBuilder> {
  @BuiltValueField(wireName: r'state')
  TimeframeRiskMapOverallStateEnum get state;
  // enum stateEnum {  wait,  no_recommendation,  };

  @BuiltValueField(wireName: r'reasonCode')
  String get reasonCode;

  TimeframeRiskMapOverall._();

  factory TimeframeRiskMapOverall([void updates(TimeframeRiskMapOverallBuilder b)]) = _$TimeframeRiskMapOverall;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TimeframeRiskMapOverallBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TimeframeRiskMapOverall> get serializer => _$TimeframeRiskMapOverallSerializer();
}

class _$TimeframeRiskMapOverallSerializer implements PrimitiveSerializer<TimeframeRiskMapOverall> {
  @override
  final Iterable<Type> types = const [TimeframeRiskMapOverall, _$TimeframeRiskMapOverall];

  @override
  final String wireName = r'TimeframeRiskMapOverall';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TimeframeRiskMapOverall object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'state';
    yield serializers.serialize(
      object.state,
      specifiedType: const FullType(TimeframeRiskMapOverallStateEnum),
    );
    yield r'reasonCode';
    yield serializers.serialize(
      object.reasonCode,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TimeframeRiskMapOverall object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TimeframeRiskMapOverallBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'state':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TimeframeRiskMapOverallStateEnum),
          ) as TimeframeRiskMapOverallStateEnum;
          result.state = valueDes;
          break;
        case r'reasonCode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.reasonCode = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TimeframeRiskMapOverall deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TimeframeRiskMapOverallBuilder();
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

class TimeframeRiskMapOverallStateEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'wait')
  static const TimeframeRiskMapOverallStateEnum wait = _$timeframeRiskMapOverallStateEnum_wait;
  @BuiltValueEnumConst(wireName: r'no_recommendation')
  static const TimeframeRiskMapOverallStateEnum noRecommendation = _$timeframeRiskMapOverallStateEnum_noRecommendation;

  static Serializer<TimeframeRiskMapOverallStateEnum> get serializer => _$timeframeRiskMapOverallStateEnumSerializer;

  const TimeframeRiskMapOverallStateEnum._(String name): super(name);

  static BuiltSet<TimeframeRiskMapOverallStateEnum> get values => _$timeframeRiskMapOverallStateEnumValues;
  static TimeframeRiskMapOverallStateEnum valueOf(String name) => _$timeframeRiskMapOverallStateEnumValueOf(name);
}

