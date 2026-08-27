//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'standard_trading_rules_fixed_rate.g.dart';

/// StandardTradingRulesFixedRate
///
/// Properties:
/// * [usd] 
/// * [idr] 
/// * [label] 
@BuiltValue()
abstract class StandardTradingRulesFixedRate implements Built<StandardTradingRulesFixedRate, StandardTradingRulesFixedRateBuilder> {
  @BuiltValueField(wireName: r'usd')
  num get usd;

  @BuiltValueField(wireName: r'idr')
  num get idr;

  @BuiltValueField(wireName: r'label')
  String get label;

  StandardTradingRulesFixedRate._();

  factory StandardTradingRulesFixedRate([void updates(StandardTradingRulesFixedRateBuilder b)]) = _$StandardTradingRulesFixedRate;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(StandardTradingRulesFixedRateBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<StandardTradingRulesFixedRate> get serializer => _$StandardTradingRulesFixedRateSerializer();
}

class _$StandardTradingRulesFixedRateSerializer implements PrimitiveSerializer<StandardTradingRulesFixedRate> {
  @override
  final Iterable<Type> types = const [StandardTradingRulesFixedRate, _$StandardTradingRulesFixedRate];

  @override
  final String wireName = r'StandardTradingRulesFixedRate';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    StandardTradingRulesFixedRate object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'usd';
    yield serializers.serialize(
      object.usd,
      specifiedType: const FullType(num),
    );
    yield r'idr';
    yield serializers.serialize(
      object.idr,
      specifiedType: const FullType(num),
    );
    yield r'label';
    yield serializers.serialize(
      object.label,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    StandardTradingRulesFixedRate object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required StandardTradingRulesFixedRateBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'usd':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.usd = valueDes;
          break;
        case r'idr':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.idr = valueDes;
          break;
        case r'label':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.label = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  StandardTradingRulesFixedRate deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = StandardTradingRulesFixedRateBuilder();
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

