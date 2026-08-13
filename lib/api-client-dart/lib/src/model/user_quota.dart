//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_quota.g.dart';

/// UserQuota
///
/// Properties:
/// * [id] 
/// * [customQuotaPerHour] 
/// * [customQuotaPerDay] 
@BuiltValue()
abstract class UserQuota implements Built<UserQuota, UserQuotaBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'customQuotaPerHour')
  int get customQuotaPerHour;

  @BuiltValueField(wireName: r'customQuotaPerDay')
  int get customQuotaPerDay;

  UserQuota._();

  factory UserQuota([void updates(UserQuotaBuilder b)]) = _$UserQuota;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserQuotaBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserQuota> get serializer => _$UserQuotaSerializer();
}

class _$UserQuotaSerializer implements PrimitiveSerializer<UserQuota> {
  @override
  final Iterable<Type> types = const [UserQuota, _$UserQuota];

  @override
  final String wireName = r'UserQuota';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserQuota object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'customQuotaPerHour';
    yield serializers.serialize(
      object.customQuotaPerHour,
      specifiedType: const FullType(int),
    );
    yield r'customQuotaPerDay';
    yield serializers.serialize(
      object.customQuotaPerDay,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UserQuota object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserQuotaBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'customQuotaPerHour':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.customQuotaPerHour = valueDes;
          break;
        case r'customQuotaPerDay':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.customQuotaPerDay = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UserQuota deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserQuotaBuilder();
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

