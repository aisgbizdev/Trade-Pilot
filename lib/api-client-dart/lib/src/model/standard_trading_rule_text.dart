//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'standard_trading_rule_text.g.dart';

/// StandardTradingRuleText
///
/// Properties:
/// * [id] 
/// * [en] 
@BuiltValue()
abstract class StandardTradingRuleText implements Built<StandardTradingRuleText, StandardTradingRuleTextBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'en')
  String get en;

  StandardTradingRuleText._();

  factory StandardTradingRuleText([void updates(StandardTradingRuleTextBuilder b)]) = _$StandardTradingRuleText;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(StandardTradingRuleTextBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<StandardTradingRuleText> get serializer => _$StandardTradingRuleTextSerializer();
}

class _$StandardTradingRuleTextSerializer implements PrimitiveSerializer<StandardTradingRuleText> {
  @override
  final Iterable<Type> types = const [StandardTradingRuleText, _$StandardTradingRuleText];

  @override
  final String wireName = r'StandardTradingRuleText';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    StandardTradingRuleText object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'en';
    yield serializers.serialize(
      object.en,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    StandardTradingRuleText object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required StandardTradingRuleTextBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'en':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.en = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  StandardTradingRuleText deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = StandardTradingRuleTextBuilder();
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

