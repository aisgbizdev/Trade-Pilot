//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'trade_side.g.dart';

/// One side (buy or sell) of the AI-suggested trade plan with concrete price levels. Levels are strings so the AI can return either numeric prices (e.g. '1.0857') or descriptive placeholders (e.g. 'menunggu konfirmasi level kunci') when no anchor price is available.
///
/// Properties:
/// * [entryZone] 
/// * [stopLoss] 
/// * [takeProfit1] 
/// * [takeProfit2] 
/// * [riskRewardRatio] 
/// * [rationale] 
@BuiltValue()
abstract class TradeSide implements Built<TradeSide, TradeSideBuilder> {
  @BuiltValueField(wireName: r'entryZone')
  String get entryZone;

  @BuiltValueField(wireName: r'stopLoss')
  String get stopLoss;

  @BuiltValueField(wireName: r'takeProfit1')
  String get takeProfit1;

  @BuiltValueField(wireName: r'takeProfit2')
  String get takeProfit2;

  @BuiltValueField(wireName: r'riskRewardRatio')
  String get riskRewardRatio;

  @BuiltValueField(wireName: r'rationale')
  String get rationale;

  TradeSide._();

  factory TradeSide([void updates(TradeSideBuilder b)]) = _$TradeSide;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TradeSideBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TradeSide> get serializer => _$TradeSideSerializer();
}

class _$TradeSideSerializer implements PrimitiveSerializer<TradeSide> {
  @override
  final Iterable<Type> types = const [TradeSide, _$TradeSide];

  @override
  final String wireName = r'TradeSide';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TradeSide object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'entryZone';
    yield serializers.serialize(
      object.entryZone,
      specifiedType: const FullType(String),
    );
    yield r'stopLoss';
    yield serializers.serialize(
      object.stopLoss,
      specifiedType: const FullType(String),
    );
    yield r'takeProfit1';
    yield serializers.serialize(
      object.takeProfit1,
      specifiedType: const FullType(String),
    );
    yield r'takeProfit2';
    yield serializers.serialize(
      object.takeProfit2,
      specifiedType: const FullType(String),
    );
    yield r'riskRewardRatio';
    yield serializers.serialize(
      object.riskRewardRatio,
      specifiedType: const FullType(String),
    );
    yield r'rationale';
    yield serializers.serialize(
      object.rationale,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TradeSide object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TradeSideBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'entryZone':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.entryZone = valueDes;
          break;
        case r'stopLoss':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.stopLoss = valueDes;
          break;
        case r'takeProfit1':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.takeProfit1 = valueDes;
          break;
        case r'takeProfit2':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.takeProfit2 = valueDes;
          break;
        case r'riskRewardRatio':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.riskRewardRatio = valueDes;
          break;
        case r'rationale':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.rationale = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TradeSide deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TradeSideBuilder();
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

