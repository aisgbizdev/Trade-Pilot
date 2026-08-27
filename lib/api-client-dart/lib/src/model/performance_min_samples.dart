//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'performance_min_samples.g.dart';

/// Sample-size guardrails the server enforces — published so the UI's honesty copy can quote them directly instead of hardcoding.
///
/// Properties:
/// * [bucket] - Minimum resolved analyses per bucket before that bucket renders.
/// * [overall] - Minimum resolved analyses overall before any segment renders.
/// * [banner] - Minimum resolved analyses in the recent window before the current-state banner makes a claim.
@BuiltValue()
abstract class PerformanceMinSamples implements Built<PerformanceMinSamples, PerformanceMinSamplesBuilder> {
  /// Minimum resolved analyses per bucket before that bucket renders.
  @BuiltValueField(wireName: r'bucket')
  int get bucket;

  /// Minimum resolved analyses overall before any segment renders.
  @BuiltValueField(wireName: r'overall')
  int get overall;

  /// Minimum resolved analyses in the recent window before the current-state banner makes a claim.
  @BuiltValueField(wireName: r'banner')
  int get banner;

  PerformanceMinSamples._();

  factory PerformanceMinSamples([void updates(PerformanceMinSamplesBuilder b)]) = _$PerformanceMinSamples;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PerformanceMinSamplesBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PerformanceMinSamples> get serializer => _$PerformanceMinSamplesSerializer();
}

class _$PerformanceMinSamplesSerializer implements PrimitiveSerializer<PerformanceMinSamples> {
  @override
  final Iterable<Type> types = const [PerformanceMinSamples, _$PerformanceMinSamples];

  @override
  final String wireName = r'PerformanceMinSamples';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PerformanceMinSamples object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'bucket';
    yield serializers.serialize(
      object.bucket,
      specifiedType: const FullType(int),
    );
    yield r'overall';
    yield serializers.serialize(
      object.overall,
      specifiedType: const FullType(int),
    );
    yield r'banner';
    yield serializers.serialize(
      object.banner,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PerformanceMinSamples object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PerformanceMinSamplesBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'bucket':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.bucket = valueDes;
          break;
        case r'overall':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.overall = valueDes;
          break;
        case r'banner':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.banner = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PerformanceMinSamples deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PerformanceMinSamplesBuilder();
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

