//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_award.g.dart';

/// ProgressionAward
///
/// Properties:
/// * [awarded] 
/// * [xp] 
/// * [reason] 
@BuiltValue()
abstract class ProgressionAward implements Built<ProgressionAward, ProgressionAwardBuilder> {
  @BuiltValueField(wireName: r'awarded')
  bool get awarded;

  @BuiltValueField(wireName: r'xp')
  int get xp;

  @BuiltValueField(wireName: r'reason')
  String? get reason;

  ProgressionAward._();

  factory ProgressionAward([void updates(ProgressionAwardBuilder b)]) = _$ProgressionAward;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionAwardBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionAward> get serializer => _$ProgressionAwardSerializer();
}

class _$ProgressionAwardSerializer implements PrimitiveSerializer<ProgressionAward> {
  @override
  final Iterable<Type> types = const [ProgressionAward, _$ProgressionAward];

  @override
  final String wireName = r'ProgressionAward';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionAward object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'awarded';
    yield serializers.serialize(
      object.awarded,
      specifiedType: const FullType(bool),
    );
    yield r'xp';
    yield serializers.serialize(
      object.xp,
      specifiedType: const FullType(int),
    );
    if (object.reason != null) {
      yield r'reason';
      yield serializers.serialize(
        object.reason,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionAward object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionAwardBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'awarded':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.awarded = valueDes;
          break;
        case r'xp':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.xp = valueDes;
          break;
        case r'reason':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.reason = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionAward deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionAwardBuilder();
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

