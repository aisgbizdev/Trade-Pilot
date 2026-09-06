//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'standard_trading_rule_instrument_trading_hours.g.dart';

/// StandardTradingRuleInstrumentTradingHours
///
/// Properties:
/// * [summer] 
/// * [winter] 
@BuiltValue()
abstract class StandardTradingRuleInstrumentTradingHours implements Built<StandardTradingRuleInstrumentTradingHours, StandardTradingRuleInstrumentTradingHoursBuilder> {
  @BuiltValueField(wireName: r'summer')
  String get summer;

  @BuiltValueField(wireName: r'winter')
  String get winter;

  StandardTradingRuleInstrumentTradingHours._();

  factory StandardTradingRuleInstrumentTradingHours([void updates(StandardTradingRuleInstrumentTradingHoursBuilder b)]) = _$StandardTradingRuleInstrumentTradingHours;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(StandardTradingRuleInstrumentTradingHoursBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<StandardTradingRuleInstrumentTradingHours> get serializer => _$StandardTradingRuleInstrumentTradingHoursSerializer();
}

class _$StandardTradingRuleInstrumentTradingHoursSerializer implements PrimitiveSerializer<StandardTradingRuleInstrumentTradingHours> {
  @override
  final Iterable<Type> types = const [StandardTradingRuleInstrumentTradingHours, _$StandardTradingRuleInstrumentTradingHours];

  @override
  final String wireName = r'StandardTradingRuleInstrumentTradingHours';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    StandardTradingRuleInstrumentTradingHours object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'summer';
    yield serializers.serialize(
      object.summer,
      specifiedType: const FullType(String),
    );
    yield r'winter';
    yield serializers.serialize(
      object.winter,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    StandardTradingRuleInstrumentTradingHours object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required StandardTradingRuleInstrumentTradingHoursBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'summer':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.summer = valueDes;
          break;
        case r'winter':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.winter = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  StandardTradingRuleInstrumentTradingHours deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = StandardTradingRuleInstrumentTradingHoursBuilder();
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

