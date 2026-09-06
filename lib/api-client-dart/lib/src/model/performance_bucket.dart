//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'performance_bucket.g.dart';

/// Single bucket inside a performance segment (per instrument, FX session, or market-condition). `winRate` is wins / (wins + losses) — only trades that actually triggered. `hitRate` is wins / total resolved (expired included).
///
/// Properties:
/// * [key] 
/// * [triggered] 
/// * [wins] 
/// * [losses] 
/// * [expired] 
/// * [total] 
/// * [winRate] 
/// * [hitRate] 
@BuiltValue()
abstract class PerformanceBucket implements Built<PerformanceBucket, PerformanceBucketBuilder> {
  @BuiltValueField(wireName: r'key')
  String get key;

  @BuiltValueField(wireName: r'triggered')
  int get triggered;

  @BuiltValueField(wireName: r'wins')
  int get wins;

  @BuiltValueField(wireName: r'losses')
  int get losses;

  @BuiltValueField(wireName: r'expired')
  int get expired;

  @BuiltValueField(wireName: r'total')
  int get total;

  @BuiltValueField(wireName: r'winRate')
  num get winRate;

  @BuiltValueField(wireName: r'hitRate')
  num get hitRate;

  PerformanceBucket._();

  factory PerformanceBucket([void updates(PerformanceBucketBuilder b)]) = _$PerformanceBucket;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PerformanceBucketBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PerformanceBucket> get serializer => _$PerformanceBucketSerializer();
}

class _$PerformanceBucketSerializer implements PrimitiveSerializer<PerformanceBucket> {
  @override
  final Iterable<Type> types = const [PerformanceBucket, _$PerformanceBucket];

  @override
  final String wireName = r'PerformanceBucket';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PerformanceBucket object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'key';
    yield serializers.serialize(
      object.key,
      specifiedType: const FullType(String),
    );
    yield r'triggered';
    yield serializers.serialize(
      object.triggered,
      specifiedType: const FullType(int),
    );
    yield r'wins';
    yield serializers.serialize(
      object.wins,
      specifiedType: const FullType(int),
    );
    yield r'losses';
    yield serializers.serialize(
      object.losses,
      specifiedType: const FullType(int),
    );
    yield r'expired';
    yield serializers.serialize(
      object.expired,
      specifiedType: const FullType(int),
    );
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(int),
    );
    yield r'winRate';
    yield serializers.serialize(
      object.winRate,
      specifiedType: const FullType(num),
    );
    yield r'hitRate';
    yield serializers.serialize(
      object.hitRate,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PerformanceBucket object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PerformanceBucketBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'key':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.key = valueDes;
          break;
        case r'triggered':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.triggered = valueDes;
          break;
        case r'wins':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.wins = valueDes;
          break;
        case r'losses':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.losses = valueDes;
          break;
        case r'expired':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.expired = valueDes;
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.total = valueDes;
          break;
        case r'winRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.winRate = valueDes;
          break;
        case r'hitRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.hitRate = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PerformanceBucket deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PerformanceBucketBuilder();
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

