//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/performance_bucket.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'performance_segment.g.dart';

/// A segmentation of the outcome ledger. `gated` is true when no bucket inside the segment crossed the minimum-sample threshold; the UI then renders a 'need more data' placeholder instead of cherry-picking the largest bucket.
///
/// Properties:
/// * [gated] 
/// * [need] 
/// * [have] 
/// * [buckets] 
@BuiltValue()
abstract class PerformanceSegment implements Built<PerformanceSegment, PerformanceSegmentBuilder> {
  @BuiltValueField(wireName: r'gated')
  bool get gated;

  @BuiltValueField(wireName: r'need')
  int get need;

  @BuiltValueField(wireName: r'have')
  int get have;

  @BuiltValueField(wireName: r'buckets')
  BuiltList<PerformanceBucket> get buckets;

  PerformanceSegment._();

  factory PerformanceSegment([void updates(PerformanceSegmentBuilder b)]) = _$PerformanceSegment;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PerformanceSegmentBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PerformanceSegment> get serializer => _$PerformanceSegmentSerializer();
}

class _$PerformanceSegmentSerializer implements PrimitiveSerializer<PerformanceSegment> {
  @override
  final Iterable<Type> types = const [PerformanceSegment, _$PerformanceSegment];

  @override
  final String wireName = r'PerformanceSegment';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PerformanceSegment object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'gated';
    yield serializers.serialize(
      object.gated,
      specifiedType: const FullType(bool),
    );
    yield r'need';
    yield serializers.serialize(
      object.need,
      specifiedType: const FullType(int),
    );
    yield r'have';
    yield serializers.serialize(
      object.have,
      specifiedType: const FullType(int),
    );
    yield r'buckets';
    yield serializers.serialize(
      object.buckets,
      specifiedType: const FullType(BuiltList, [FullType(PerformanceBucket)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PerformanceSegment object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PerformanceSegmentBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'gated':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.gated = valueDes;
          break;
        case r'need':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.need = valueDes;
          break;
        case r'have':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.have = valueDes;
          break;
        case r'buckets':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(PerformanceBucket)]),
          ) as BuiltList<PerformanceBucket>;
          result.buckets.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PerformanceSegment deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PerformanceSegmentBuilder();
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

