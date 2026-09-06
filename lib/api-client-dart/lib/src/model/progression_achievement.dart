//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_achievement.g.dart';

/// ProgressionAchievement
///
/// Properties:
/// * [key] 
/// * [unlocked] 
/// * [unlockedAt] 
@BuiltValue()
abstract class ProgressionAchievement implements Built<ProgressionAchievement, ProgressionAchievementBuilder> {
  @BuiltValueField(wireName: r'key')
  String get key;

  @BuiltValueField(wireName: r'unlocked')
  bool get unlocked;

  @BuiltValueField(wireName: r'unlockedAt')
  DateTime? get unlockedAt;

  ProgressionAchievement._();

  factory ProgressionAchievement([void updates(ProgressionAchievementBuilder b)]) = _$ProgressionAchievement;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionAchievementBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionAchievement> get serializer => _$ProgressionAchievementSerializer();
}

class _$ProgressionAchievementSerializer implements PrimitiveSerializer<ProgressionAchievement> {
  @override
  final Iterable<Type> types = const [ProgressionAchievement, _$ProgressionAchievement];

  @override
  final String wireName = r'ProgressionAchievement';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionAchievement object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'key';
    yield serializers.serialize(
      object.key,
      specifiedType: const FullType(String),
    );
    yield r'unlocked';
    yield serializers.serialize(
      object.unlocked,
      specifiedType: const FullType(bool),
    );
    yield r'unlockedAt';
    yield object.unlockedAt == null ? null : serializers.serialize(
      object.unlockedAt,
      specifiedType: const FullType.nullable(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionAchievement object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionAchievementBuilder result,
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
        case r'unlocked':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.unlocked = valueDes;
          break;
        case r'unlockedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.unlockedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionAchievement deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionAchievementBuilder();
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

