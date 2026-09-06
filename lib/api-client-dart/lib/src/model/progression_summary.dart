//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_summary.g.dart';

/// ProgressionSummary
///
/// Properties:
/// * [totalXp] 
/// * [level] 
/// * [masteryLevel] 
/// * [rank] 
/// * [currentLevelXp] - Absolute XP floor for current level
/// * [nextLevelXp] - Absolute XP target for next level or Mastery step
/// * [currentStreak] 
/// * [longestStreak] 
@BuiltValue()
abstract class ProgressionSummary implements Built<ProgressionSummary, ProgressionSummaryBuilder> {
  @BuiltValueField(wireName: r'totalXp')
  int get totalXp;

  @BuiltValueField(wireName: r'level')
  int get level;

  @BuiltValueField(wireName: r'masteryLevel')
  int get masteryLevel;

  @BuiltValueField(wireName: r'rank')
  String get rank;

  /// Absolute XP floor for current level
  @BuiltValueField(wireName: r'currentLevelXp')
  int get currentLevelXp;

  /// Absolute XP target for next level or Mastery step
  @BuiltValueField(wireName: r'nextLevelXp')
  int get nextLevelXp;

  @BuiltValueField(wireName: r'currentStreak')
  int get currentStreak;

  @BuiltValueField(wireName: r'longestStreak')
  int get longestStreak;

  ProgressionSummary._();

  factory ProgressionSummary([void updates(ProgressionSummaryBuilder b)]) = _$ProgressionSummary;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionSummaryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionSummary> get serializer => _$ProgressionSummarySerializer();
}

class _$ProgressionSummarySerializer implements PrimitiveSerializer<ProgressionSummary> {
  @override
  final Iterable<Type> types = const [ProgressionSummary, _$ProgressionSummary];

  @override
  final String wireName = r'ProgressionSummary';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalXp';
    yield serializers.serialize(
      object.totalXp,
      specifiedType: const FullType(int),
    );
    yield r'level';
    yield serializers.serialize(
      object.level,
      specifiedType: const FullType(int),
    );
    yield r'masteryLevel';
    yield serializers.serialize(
      object.masteryLevel,
      specifiedType: const FullType(int),
    );
    yield r'rank';
    yield serializers.serialize(
      object.rank,
      specifiedType: const FullType(String),
    );
    yield r'currentLevelXp';
    yield serializers.serialize(
      object.currentLevelXp,
      specifiedType: const FullType(int),
    );
    yield r'nextLevelXp';
    yield serializers.serialize(
      object.nextLevelXp,
      specifiedType: const FullType(int),
    );
    yield r'currentStreak';
    yield serializers.serialize(
      object.currentStreak,
      specifiedType: const FullType(int),
    );
    yield r'longestStreak';
    yield serializers.serialize(
      object.longestStreak,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionSummary object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionSummaryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalXp':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalXp = valueDes;
          break;
        case r'level':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.level = valueDes;
          break;
        case r'masteryLevel':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.masteryLevel = valueDes;
          break;
        case r'rank':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.rank = valueDes;
          break;
        case r'currentLevelXp':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.currentLevelXp = valueDes;
          break;
        case r'nextLevelXp':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.nextLevelXp = valueDes;
          break;
        case r'currentStreak':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.currentStreak = valueDes;
          break;
        case r'longestStreak':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.longestStreak = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionSummary deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionSummaryBuilder();
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

