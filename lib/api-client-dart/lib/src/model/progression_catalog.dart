//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/progression_achievement.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_catalog.g.dart';

/// ProgressionCatalog
///
/// Properties:
/// * [achievements] 
@BuiltValue()
abstract class ProgressionCatalog implements Built<ProgressionCatalog, ProgressionCatalogBuilder> {
  @BuiltValueField(wireName: r'achievements')
  BuiltList<ProgressionAchievement> get achievements;

  ProgressionCatalog._();

  factory ProgressionCatalog([void updates(ProgressionCatalogBuilder b)]) = _$ProgressionCatalog;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionCatalogBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionCatalog> get serializer => _$ProgressionCatalogSerializer();
}

class _$ProgressionCatalogSerializer implements PrimitiveSerializer<ProgressionCatalog> {
  @override
  final Iterable<Type> types = const [ProgressionCatalog, _$ProgressionCatalog];

  @override
  final String wireName = r'ProgressionCatalog';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionCatalog object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'achievements';
    yield serializers.serialize(
      object.achievements,
      specifiedType: const FullType(BuiltList, [FullType(ProgressionAchievement)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionCatalog object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionCatalogBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'achievements':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(ProgressionAchievement)]),
          ) as BuiltList<ProgressionAchievement>;
          result.achievements.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionCatalog deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionCatalogBuilder();
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

