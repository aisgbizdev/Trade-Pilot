//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/timeframe_risk_metrics.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'timeframe_risk.g.dart';

/// TimeframeRisk
///
/// Properties:
/// * [timeframe]
/// * [status]
/// * [riskScore]
/// * [riskCategory]
/// * [reasonCodes]
/// * [metrics]
/// * [dataQuality]
/// * [confidence]
/// * [recommendation]
@BuiltValue()
abstract class TimeframeRisk implements Built<TimeframeRisk, TimeframeRiskBuilder> {
  @BuiltValueField(wireName: r'timeframe')
  TimeframeRiskTimeframeEnum get timeframe;
  // enum timeframeEnum {  15m,  1h,  4h,  1D,  1W,  };

  @BuiltValueField(wireName: r'status')
  TimeframeRiskStatusEnum get status;
  // enum statusEnum {  available,  unavailable,  insufficient,  };

  @BuiltValueField(wireName: r'riskScore')
  int? get riskScore;

  @BuiltValueField(wireName: r'riskCategory')
  TimeframeRiskRiskCategoryEnum get riskCategory;
  // enum riskCategoryEnum {  low,  moderate,  high,  unavailable,  };

  @BuiltValueField(wireName: r'reasonCodes')
  BuiltList<String> get reasonCodes;

  @BuiltValueField(wireName: r'metrics')
  TimeframeRiskMetrics? get metrics;

  @BuiltValueField(wireName: r'dataQuality')
  TimeframeRiskDataQualityEnum get dataQuality;
  // enum dataQualityEnum {  good,  limited,  stale,  unavailable,  };

  @BuiltValueField(wireName: r'confidence')
  TimeframeRiskConfidenceEnum get confidence;
  // enum confidenceEnum {  low,  medium,  high,  };

  @BuiltValueField(wireName: r'recommendation')
  TimeframeRiskRecommendationEnum get recommendation;
  // enum recommendationEnum {  eligible,  caution,  wait,  };

  TimeframeRisk._();

  factory TimeframeRisk([void updates(TimeframeRiskBuilder b)]) = _$TimeframeRisk;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TimeframeRiskBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TimeframeRisk> get serializer => _$TimeframeRiskSerializer();
}

class _$TimeframeRiskSerializer implements PrimitiveSerializer<TimeframeRisk> {
  @override
  final Iterable<Type> types = const [TimeframeRisk, _$TimeframeRisk];

  @override
  final String wireName = r'TimeframeRisk';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TimeframeRisk object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'timeframe';
    yield serializers.serialize(
      object.timeframe,
      specifiedType: const FullType(TimeframeRiskTimeframeEnum),
    );
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(TimeframeRiskStatusEnum),
    );
    yield r'riskScore';
    yield object.riskScore == null ? null : serializers.serialize(
      object.riskScore,
      specifiedType: const FullType.nullable(int),
    );
    yield r'riskCategory';
    yield serializers.serialize(
      object.riskCategory,
      specifiedType: const FullType(TimeframeRiskRiskCategoryEnum),
    );
    yield r'reasonCodes';
    yield serializers.serialize(
      object.reasonCodes,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'metrics';
    yield object.metrics == null ? null : serializers.serialize(
      object.metrics,
      specifiedType: const FullType.nullable(TimeframeRiskMetrics),
    );
    yield r'dataQuality';
    yield serializers.serialize(
      object.dataQuality,
      specifiedType: const FullType(TimeframeRiskDataQualityEnum),
    );
    yield r'confidence';
    yield serializers.serialize(
      object.confidence,
      specifiedType: const FullType(TimeframeRiskConfidenceEnum),
    );
    yield r'recommendation';
    yield serializers.serialize(
      object.recommendation,
      specifiedType: const FullType(TimeframeRiskRecommendationEnum),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TimeframeRisk object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TimeframeRiskBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'timeframe':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TimeframeRiskTimeframeEnum),
          ) as TimeframeRiskTimeframeEnum;
          result.timeframe = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TimeframeRiskStatusEnum),
          ) as TimeframeRiskStatusEnum;
          result.status = valueDes;
          break;
        case r'riskScore':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.riskScore = valueDes;
          break;
        case r'riskCategory':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TimeframeRiskRiskCategoryEnum),
          ) as TimeframeRiskRiskCategoryEnum;
          result.riskCategory = valueDes;
          break;
        case r'reasonCodes':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.reasonCodes.replace(valueDes);
          break;
        case r'metrics':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(TimeframeRiskMetrics),
          ) as TimeframeRiskMetrics?;
          if (valueDes == null) continue;
          result.metrics.replace(valueDes);
          break;
        case r'dataQuality':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TimeframeRiskDataQualityEnum),
          ) as TimeframeRiskDataQualityEnum;
          result.dataQuality = valueDes;
          break;
        case r'confidence':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TimeframeRiskConfidenceEnum),
          ) as TimeframeRiskConfidenceEnum;
          result.confidence = valueDes;
          break;
        case r'recommendation':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TimeframeRiskRecommendationEnum),
          ) as TimeframeRiskRecommendationEnum;
          result.recommendation = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TimeframeRisk deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TimeframeRiskBuilder();
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

class TimeframeRiskTimeframeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'15m')
  static const TimeframeRiskTimeframeEnum n15m = _$timeframeRiskTimeframeEnum_n15m;
  @BuiltValueEnumConst(wireName: r'1h')
  static const TimeframeRiskTimeframeEnum n1h = _$timeframeRiskTimeframeEnum_n1h;
  @BuiltValueEnumConst(wireName: r'4h')
  static const TimeframeRiskTimeframeEnum n4h = _$timeframeRiskTimeframeEnum_n4h;
  @BuiltValueEnumConst(wireName: r'1D')
  static const TimeframeRiskTimeframeEnum n1d = _$timeframeRiskTimeframeEnum_n1d;
  @BuiltValueEnumConst(wireName: r'1W')
  static const TimeframeRiskTimeframeEnum n1w = _$timeframeRiskTimeframeEnum_n1w;

  static Serializer<TimeframeRiskTimeframeEnum> get serializer => _$timeframeRiskTimeframeEnumSerializer;

  const TimeframeRiskTimeframeEnum._(String name): super(name);

  static BuiltSet<TimeframeRiskTimeframeEnum> get values => _$timeframeRiskTimeframeEnumValues;
  static TimeframeRiskTimeframeEnum valueOf(String name) => _$timeframeRiskTimeframeEnumValueOf(name);
}

class TimeframeRiskStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'available')
  static const TimeframeRiskStatusEnum available = _$timeframeRiskStatusEnum_available;
  @BuiltValueEnumConst(wireName: r'unavailable')
  static const TimeframeRiskStatusEnum unavailable = _$timeframeRiskStatusEnum_unavailable;
  @BuiltValueEnumConst(wireName: r'insufficient')
  static const TimeframeRiskStatusEnum insufficient = _$timeframeRiskStatusEnum_insufficient;

  static Serializer<TimeframeRiskStatusEnum> get serializer => _$timeframeRiskStatusEnumSerializer;

  const TimeframeRiskStatusEnum._(String name): super(name);

  static BuiltSet<TimeframeRiskStatusEnum> get values => _$timeframeRiskStatusEnumValues;
  static TimeframeRiskStatusEnum valueOf(String name) => _$timeframeRiskStatusEnumValueOf(name);
}

class TimeframeRiskRiskCategoryEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'low')
  static const TimeframeRiskRiskCategoryEnum low = _$timeframeRiskRiskCategoryEnum_low;
  @BuiltValueEnumConst(wireName: r'moderate')
  static const TimeframeRiskRiskCategoryEnum moderate = _$timeframeRiskRiskCategoryEnum_moderate;
  @BuiltValueEnumConst(wireName: r'high')
  static const TimeframeRiskRiskCategoryEnum high = _$timeframeRiskRiskCategoryEnum_high;
  @BuiltValueEnumConst(wireName: r'unavailable')
  static const TimeframeRiskRiskCategoryEnum unavailable = _$timeframeRiskRiskCategoryEnum_unavailable;

  static Serializer<TimeframeRiskRiskCategoryEnum> get serializer => _$timeframeRiskRiskCategoryEnumSerializer;

  const TimeframeRiskRiskCategoryEnum._(String name): super(name);

  static BuiltSet<TimeframeRiskRiskCategoryEnum> get values => _$timeframeRiskRiskCategoryEnumValues;
  static TimeframeRiskRiskCategoryEnum valueOf(String name) => _$timeframeRiskRiskCategoryEnumValueOf(name);
}

class TimeframeRiskDataQualityEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'good')
  static const TimeframeRiskDataQualityEnum good = _$timeframeRiskDataQualityEnum_good;
  @BuiltValueEnumConst(wireName: r'limited')
  static const TimeframeRiskDataQualityEnum limited = _$timeframeRiskDataQualityEnum_limited;
  @BuiltValueEnumConst(wireName: r'stale')
  static const TimeframeRiskDataQualityEnum stale = _$timeframeRiskDataQualityEnum_stale;
  @BuiltValueEnumConst(wireName: r'unavailable')
  static const TimeframeRiskDataQualityEnum unavailable = _$timeframeRiskDataQualityEnum_unavailable;

  static Serializer<TimeframeRiskDataQualityEnum> get serializer => _$timeframeRiskDataQualityEnumSerializer;

  const TimeframeRiskDataQualityEnum._(String name): super(name);

  static BuiltSet<TimeframeRiskDataQualityEnum> get values => _$timeframeRiskDataQualityEnumValues;
  static TimeframeRiskDataQualityEnum valueOf(String name) => _$timeframeRiskDataQualityEnumValueOf(name);
}

class TimeframeRiskConfidenceEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'low')
  static const TimeframeRiskConfidenceEnum low = _$timeframeRiskConfidenceEnum_low;
  @BuiltValueEnumConst(wireName: r'medium')
  static const TimeframeRiskConfidenceEnum medium = _$timeframeRiskConfidenceEnum_medium;
  @BuiltValueEnumConst(wireName: r'high')
  static const TimeframeRiskConfidenceEnum high = _$timeframeRiskConfidenceEnum_high;

  static Serializer<TimeframeRiskConfidenceEnum> get serializer => _$timeframeRiskConfidenceEnumSerializer;

  const TimeframeRiskConfidenceEnum._(String name): super(name);

  static BuiltSet<TimeframeRiskConfidenceEnum> get values => _$timeframeRiskConfidenceEnumValues;
  static TimeframeRiskConfidenceEnum valueOf(String name) => _$timeframeRiskConfidenceEnumValueOf(name);
}

class TimeframeRiskRecommendationEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'eligible')
  static const TimeframeRiskRecommendationEnum eligible = _$timeframeRiskRecommendationEnum_eligible;
  @BuiltValueEnumConst(wireName: r'caution')
  static const TimeframeRiskRecommendationEnum caution = _$timeframeRiskRecommendationEnum_caution;
  @BuiltValueEnumConst(wireName: r'wait')
  static const TimeframeRiskRecommendationEnum wait = _$timeframeRiskRecommendationEnum_wait;

  static Serializer<TimeframeRiskRecommendationEnum> get serializer => _$timeframeRiskRecommendationEnumSerializer;

  const TimeframeRiskRecommendationEnum._(String name): super(name);

  static BuiltSet<TimeframeRiskRecommendationEnum> get values => _$timeframeRiskRecommendationEnumValues;
  static TimeframeRiskRecommendationEnum valueOf(String name) => _$timeframeRiskRecommendationEnumValueOf(name);
}

