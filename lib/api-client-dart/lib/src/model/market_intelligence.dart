//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/market_intelligence_technical.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'market_intelligence.g.dart';

/// MarketIntelligence
///
/// Properties:
/// * [status] 
/// * [evaluatedAt] 
/// * [reasonCodes] 
/// * [livePrice] 
/// * [priceChangePercent] 
/// * [technical] 
@BuiltValue()
abstract class MarketIntelligence implements Built<MarketIntelligence, MarketIntelligenceBuilder> {
  @BuiltValueField(wireName: r'status')
  MarketIntelligenceStatusEnum get status;
  // enum statusEnum {  reaffirm,  caution,  hold_scaling,  invalidate,  };

  @BuiltValueField(wireName: r'evaluatedAt')
  DateTime get evaluatedAt;

  @BuiltValueField(wireName: r'reasonCodes')
  BuiltList<String> get reasonCodes;

  @BuiltValueField(wireName: r'livePrice')
  num get livePrice;

  @BuiltValueField(wireName: r'priceChangePercent')
  String get priceChangePercent;

  @BuiltValueField(wireName: r'technical')
  MarketIntelligenceTechnical get technical;

  MarketIntelligence._();

  factory MarketIntelligence([void updates(MarketIntelligenceBuilder b)]) = _$MarketIntelligence;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MarketIntelligenceBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MarketIntelligence> get serializer => _$MarketIntelligenceSerializer();
}

class _$MarketIntelligenceSerializer implements PrimitiveSerializer<MarketIntelligence> {
  @override
  final Iterable<Type> types = const [MarketIntelligence, _$MarketIntelligence];

  @override
  final String wireName = r'MarketIntelligence';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MarketIntelligence object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(MarketIntelligenceStatusEnum),
    );
    yield r'evaluatedAt';
    yield serializers.serialize(
      object.evaluatedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'reasonCodes';
    yield serializers.serialize(
      object.reasonCodes,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'livePrice';
    yield serializers.serialize(
      object.livePrice,
      specifiedType: const FullType(num),
    );
    yield r'priceChangePercent';
    yield serializers.serialize(
      object.priceChangePercent,
      specifiedType: const FullType(String),
    );
    yield r'technical';
    yield serializers.serialize(
      object.technical,
      specifiedType: const FullType(MarketIntelligenceTechnical),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MarketIntelligence object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MarketIntelligenceBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MarketIntelligenceStatusEnum),
          ) as MarketIntelligenceStatusEnum;
          result.status = valueDes;
          break;
        case r'evaluatedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.evaluatedAt = valueDes;
          break;
        case r'reasonCodes':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.reasonCodes.replace(valueDes);
          break;
        case r'livePrice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.livePrice = valueDes;
          break;
        case r'priceChangePercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.priceChangePercent = valueDes;
          break;
        case r'technical':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MarketIntelligenceTechnical),
          ) as MarketIntelligenceTechnical;
          result.technical.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MarketIntelligence deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MarketIntelligenceBuilder();
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

class MarketIntelligenceStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'reaffirm')
  static const MarketIntelligenceStatusEnum reaffirm = _$marketIntelligenceStatusEnum_reaffirm;
  @BuiltValueEnumConst(wireName: r'caution')
  static const MarketIntelligenceStatusEnum caution = _$marketIntelligenceStatusEnum_caution;
  @BuiltValueEnumConst(wireName: r'hold_scaling')
  static const MarketIntelligenceStatusEnum holdScaling = _$marketIntelligenceStatusEnum_holdScaling;
  @BuiltValueEnumConst(wireName: r'invalidate')
  static const MarketIntelligenceStatusEnum invalidate = _$marketIntelligenceStatusEnum_invalidate;

  static Serializer<MarketIntelligenceStatusEnum> get serializer => _$marketIntelligenceStatusEnumSerializer;

  const MarketIntelligenceStatusEnum._(String name): super(name);

  static BuiltSet<MarketIntelligenceStatusEnum> get values => _$marketIntelligenceStatusEnumValues;
  static MarketIntelligenceStatusEnum valueOf(String name) => _$marketIntelligenceStatusEnumValueOf(name);
}

