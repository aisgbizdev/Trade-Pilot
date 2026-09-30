//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'market_snapshot_candle.g.dart';

/// MarketSnapshotCandle
///
/// Properties:
/// * [date] 
/// * [open] 
/// * [high] 
/// * [low] 
/// * [close] 
@BuiltValue()
abstract class MarketSnapshotCandle implements Built<MarketSnapshotCandle, MarketSnapshotCandleBuilder> {
  @BuiltValueField(wireName: r'date')
  DateTime get date;

  @BuiltValueField(wireName: r'open')
  num get open;

  @BuiltValueField(wireName: r'high')
  num get high;

  @BuiltValueField(wireName: r'low')
  num get low;

  @BuiltValueField(wireName: r'close')
  num get close;

  MarketSnapshotCandle._();

  factory MarketSnapshotCandle([void updates(MarketSnapshotCandleBuilder b)]) = _$MarketSnapshotCandle;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MarketSnapshotCandleBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MarketSnapshotCandle> get serializer => _$MarketSnapshotCandleSerializer();
}

class _$MarketSnapshotCandleSerializer implements PrimitiveSerializer<MarketSnapshotCandle> {
  @override
  final Iterable<Type> types = const [MarketSnapshotCandle, _$MarketSnapshotCandle];

  @override
  final String wireName = r'MarketSnapshotCandle';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MarketSnapshotCandle object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'date';
    yield serializers.serialize(
      object.date,
      specifiedType: const FullType(DateTime),
    );
    yield r'open';
    yield serializers.serialize(
      object.open,
      specifiedType: const FullType(num),
    );
    yield r'high';
    yield serializers.serialize(
      object.high,
      specifiedType: const FullType(num),
    );
    yield r'low';
    yield serializers.serialize(
      object.low,
      specifiedType: const FullType(num),
    );
    yield r'close';
    yield serializers.serialize(
      object.close,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MarketSnapshotCandle object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MarketSnapshotCandleBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'date':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.date = valueDes;
          break;
        case r'open':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.open = valueDes;
          break;
        case r'high':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.high = valueDes;
          break;
        case r'low':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.low = valueDes;
          break;
        case r'close':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.close = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MarketSnapshotCandle deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MarketSnapshotCandleBuilder();
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

