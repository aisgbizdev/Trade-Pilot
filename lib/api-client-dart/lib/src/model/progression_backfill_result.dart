//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_backfill_result.g.dart';

/// ProgressionBackfillResult
///
/// Properties:
/// * [awarded]
/// * [scanned]
/// * [ruleVersion]
@BuiltValue()
abstract class ProgressionBackfillResult implements Built<ProgressionBackfillResult, ProgressionBackfillResultBuilder> {
  @BuiltValueField(wireName: r'awarded')
  int get awarded;

  @BuiltValueField(wireName: r'scanned')
  int get scanned;

  @BuiltValueField(wireName: r'ruleVersion')
  String get ruleVersion;

  ProgressionBackfillResult._();

  factory ProgressionBackfillResult([void updates(ProgressionBackfillResultBuilder b)]) = _$ProgressionBackfillResult;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionBackfillResultBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionBackfillResult> get serializer => _$ProgressionBackfillResultSerializer();
}

class _$ProgressionBackfillResultSerializer implements PrimitiveSerializer<ProgressionBackfillResult> {
  @override
  final Iterable<Type> types = const [ProgressionBackfillResult, _$ProgressionBackfillResult];

  @override
  final String wireName = r'ProgressionBackfillResult';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionBackfillResult object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'awarded';
    yield serializers.serialize(
      object.awarded,
      specifiedType: const FullType(int),
    );
    yield r'scanned';
    yield serializers.serialize(
      object.scanned,
      specifiedType: const FullType(int),
    );
    yield r'ruleVersion';
    yield serializers.serialize(
      object.ruleVersion,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionBackfillResult object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionBackfillResultBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'awarded':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.awarded = valueDes;
          break;
        case r'scanned':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.scanned = valueDes;
          break;
        case r'ruleVersion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.ruleVersion = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionBackfillResult deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionBackfillResultBuilder();
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

