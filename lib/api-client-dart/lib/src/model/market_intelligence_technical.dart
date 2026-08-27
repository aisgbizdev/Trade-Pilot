//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'market_intelligence_technical.g.dart';

/// MarketIntelligenceTechnical
///
/// Properties:
/// * [buy] 
/// * [sell] 
/// * [neutral] 
@BuiltValue()
abstract class MarketIntelligenceTechnical implements Built<MarketIntelligenceTechnical, MarketIntelligenceTechnicalBuilder> {
  @BuiltValueField(wireName: r'buy')
  int get buy;

  @BuiltValueField(wireName: r'sell')
  int get sell;

  @BuiltValueField(wireName: r'neutral')
  int get neutral;

  MarketIntelligenceTechnical._();

  factory MarketIntelligenceTechnical([void updates(MarketIntelligenceTechnicalBuilder b)]) = _$MarketIntelligenceTechnical;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MarketIntelligenceTechnicalBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MarketIntelligenceTechnical> get serializer => _$MarketIntelligenceTechnicalSerializer();
}

class _$MarketIntelligenceTechnicalSerializer implements PrimitiveSerializer<MarketIntelligenceTechnical> {
  @override
  final Iterable<Type> types = const [MarketIntelligenceTechnical, _$MarketIntelligenceTechnical];

  @override
  final String wireName = r'MarketIntelligenceTechnical';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MarketIntelligenceTechnical object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'buy';
    yield serializers.serialize(
      object.buy,
      specifiedType: const FullType(int),
    );
    yield r'sell';
    yield serializers.serialize(
      object.sell,
      specifiedType: const FullType(int),
    );
    yield r'neutral';
    yield serializers.serialize(
      object.neutral,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MarketIntelligenceTechnical object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MarketIntelligenceTechnicalBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'buy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.buy = valueDes;
          break;
        case r'sell':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.sell = valueDes;
          break;
        case r'neutral':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.neutral = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MarketIntelligenceTechnical deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MarketIntelligenceTechnicalBuilder();
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

