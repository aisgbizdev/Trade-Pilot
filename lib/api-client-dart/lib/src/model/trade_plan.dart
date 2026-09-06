//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/trade_side.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'trade_plan.g.dart';

/// Structured trade plan with both buy and sell side levels suggested by the AI. preferredSide indicates which side aligns with the trading bias; 'wait' means neither side is recommended yet (e.g. neutral bias or pending high-impact event).
///
/// Properties:
/// * [preferredSide] 
/// * [buy] 
/// * [sell] 
@BuiltValue()
abstract class TradePlan implements Built<TradePlan, TradePlanBuilder> {
  @BuiltValueField(wireName: r'preferredSide')
  TradePlanPreferredSideEnum get preferredSide;
  // enum preferredSideEnum {  buy,  sell,  wait,  };

  @BuiltValueField(wireName: r'buy')
  TradeSide get buy;

  @BuiltValueField(wireName: r'sell')
  TradeSide get sell;

  TradePlan._();

  factory TradePlan([void updates(TradePlanBuilder b)]) = _$TradePlan;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TradePlanBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TradePlan> get serializer => _$TradePlanSerializer();
}

class _$TradePlanSerializer implements PrimitiveSerializer<TradePlan> {
  @override
  final Iterable<Type> types = const [TradePlan, _$TradePlan];

  @override
  final String wireName = r'TradePlan';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TradePlan object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'preferredSide';
    yield serializers.serialize(
      object.preferredSide,
      specifiedType: const FullType(TradePlanPreferredSideEnum),
    );
    yield r'buy';
    yield serializers.serialize(
      object.buy,
      specifiedType: const FullType(TradeSide),
    );
    yield r'sell';
    yield serializers.serialize(
      object.sell,
      specifiedType: const FullType(TradeSide),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TradePlan object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TradePlanBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'preferredSide':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TradePlanPreferredSideEnum),
          ) as TradePlanPreferredSideEnum;
          result.preferredSide = valueDes;
          break;
        case r'buy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TradeSide),
          ) as TradeSide;
          result.buy.replace(valueDes);
          break;
        case r'sell':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TradeSide),
          ) as TradeSide;
          result.sell.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TradePlan deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TradePlanBuilder();
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

class TradePlanPreferredSideEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'buy')
  static const TradePlanPreferredSideEnum buy = _$tradePlanPreferredSideEnum_buy;
  @BuiltValueEnumConst(wireName: r'sell')
  static const TradePlanPreferredSideEnum sell = _$tradePlanPreferredSideEnum_sell;
  @BuiltValueEnumConst(wireName: r'wait')
  static const TradePlanPreferredSideEnum wait = _$tradePlanPreferredSideEnum_wait;

  static Serializer<TradePlanPreferredSideEnum> get serializer => _$tradePlanPreferredSideEnumSerializer;

  const TradePlanPreferredSideEnum._(String name): super(name);

  static BuiltSet<TradePlanPreferredSideEnum> get values => _$tradePlanPreferredSideEnumValues;
  static TradePlanPreferredSideEnum valueOf(String name) => _$tradePlanPreferredSideEnumValueOf(name);
}

