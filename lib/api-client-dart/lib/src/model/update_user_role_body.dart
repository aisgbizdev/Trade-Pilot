//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_user_role_body.g.dart';

/// UpdateUserRoleBody
///
/// Properties:
/// * [role] 
@BuiltValue()
abstract class UpdateUserRoleBody implements Built<UpdateUserRoleBody, UpdateUserRoleBodyBuilder> {
  @BuiltValueField(wireName: r'role')
  UpdateUserRoleBodyRoleEnum get role;
  // enum roleEnum {  user,  admin,  super_admin,  };

  UpdateUserRoleBody._();

  factory UpdateUserRoleBody([void updates(UpdateUserRoleBodyBuilder b)]) = _$UpdateUserRoleBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateUserRoleBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateUserRoleBody> get serializer => _$UpdateUserRoleBodySerializer();
}

class _$UpdateUserRoleBodySerializer implements PrimitiveSerializer<UpdateUserRoleBody> {
  @override
  final Iterable<Type> types = const [UpdateUserRoleBody, _$UpdateUserRoleBody];

  @override
  final String wireName = r'UpdateUserRoleBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateUserRoleBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'role';
    yield serializers.serialize(
      object.role,
      specifiedType: const FullType(UpdateUserRoleBodyRoleEnum),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateUserRoleBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateUserRoleBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'role':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UpdateUserRoleBodyRoleEnum),
          ) as UpdateUserRoleBodyRoleEnum;
          result.role = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateUserRoleBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateUserRoleBodyBuilder();
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

class UpdateUserRoleBodyRoleEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'user')
  static const UpdateUserRoleBodyRoleEnum user = _$updateUserRoleBodyRoleEnum_user;
  @BuiltValueEnumConst(wireName: r'admin')
  static const UpdateUserRoleBodyRoleEnum admin = _$updateUserRoleBodyRoleEnum_admin;
  @BuiltValueEnumConst(wireName: r'super_admin')
  static const UpdateUserRoleBodyRoleEnum superAdmin = _$updateUserRoleBodyRoleEnum_superAdmin;

  static Serializer<UpdateUserRoleBodyRoleEnum> get serializer => _$updateUserRoleBodyRoleEnumSerializer;

  const UpdateUserRoleBodyRoleEnum._(String name): super(name);

  static BuiltSet<UpdateUserRoleBodyRoleEnum> get values => _$updateUserRoleBodyRoleEnumValues;
  static UpdateUserRoleBodyRoleEnum valueOf(String name) => _$updateUserRoleBodyRoleEnumValueOf(name);
}

