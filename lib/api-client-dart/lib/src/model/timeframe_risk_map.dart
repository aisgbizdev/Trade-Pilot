//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/timeframe_risk.dart';
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/timeframe_risk_map_overall.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'timeframe_risk_map.g.dart';

/// TimeframeRiskMap
///
/// Properties:
/// * [instrument] 
/// * [generatedAt] 
/// * [timeframes] 
/// * [overall] 
@BuiltValue()
abstract class TimeframeRiskMap implements Built<TimeframeRiskMap, TimeframeRiskMapBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'generatedAt')
  DateTime get generatedAt;

  @BuiltValueField(wireName: r'timeframes')
  BuiltList<TimeframeRisk> get timeframes;

  @BuiltValueField(wireName: r'overall')
  TimeframeRiskMapOverall get overall;

  TimeframeRiskMap._();

  factory TimeframeRiskMap([void updates(TimeframeRiskMapBuilder b)]) = _$TimeframeRiskMap;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TimeframeRiskMapBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TimeframeRiskMap> get serializer => _$TimeframeRiskMapSerializer();
}

class _$TimeframeRiskMapSerializer implements PrimitiveSerializer<TimeframeRiskMap> {
  @override
  final Iterable<Type> types = const [TimeframeRiskMap, _$TimeframeRiskMap];

  @override
  final String wireName = r'TimeframeRiskMap';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TimeframeRiskMap object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'generatedAt';
    yield serializers.serialize(
      object.generatedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'timeframes';
    yield serializers.serialize(
      object.timeframes,
      specifiedType: const FullType(BuiltList, [FullType(TimeframeRisk)]),
    );
    yield r'overall';
    yield serializers.serialize(
      object.overall,
      specifiedType: const FullType(TimeframeRiskMapOverall),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TimeframeRiskMap object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TimeframeRiskMapBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'generatedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.generatedAt = valueDes;
          break;
        case r'timeframes':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(TimeframeRisk)]),
          ) as BuiltList<TimeframeRisk>;
          result.timeframes.replace(valueDes);
          break;
        case r'overall':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TimeframeRiskMapOverall),
          ) as TimeframeRiskMapOverall;
          result.overall.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TimeframeRiskMap deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TimeframeRiskMapBuilder();
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

