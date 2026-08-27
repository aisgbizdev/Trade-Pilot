//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_user_body.g.dart';

/// CreateUserBody
///
/// Properties:
/// * [email] 
/// * [password] 
/// * [displayName] 
/// * [role] 
/// * [securityQuestion] 
/// * [securityAnswer] 
@BuiltValue()
abstract class CreateUserBody implements Built<CreateUserBody, CreateUserBodyBuilder> {
  @BuiltValueField(wireName: r'email')
  String get email;

  @BuiltValueField(wireName: r'password')
  String get password;

  @BuiltValueField(wireName: r'displayName')
  String get displayName;

  @BuiltValueField(wireName: r'role')
  CreateUserBodyRoleEnum? get role;
  // enum roleEnum {  user,  admin,  super_admin,  };

  @BuiltValueField(wireName: r'securityQuestion')
  String? get securityQuestion;

  @BuiltValueField(wireName: r'securityAnswer')
  String? get securityAnswer;

  CreateUserBody._();

  factory CreateUserBody([void updates(CreateUserBodyBuilder b)]) = _$CreateUserBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateUserBodyBuilder b) => b
      ..role = CreateUserBodyRoleEnum.valueOf('user')
      ..securityQuestion = 'Nama hewan peliharaan pertama kamu?'
      ..securityAnswer = 'default';

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateUserBody> get serializer => _$CreateUserBodySerializer();
}

class _$CreateUserBodySerializer implements PrimitiveSerializer<CreateUserBody> {
  @override
  final Iterable<Type> types = const [CreateUserBody, _$CreateUserBody];

  @override
  final String wireName = r'CreateUserBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateUserBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
    yield r'password';
    yield serializers.serialize(
      object.password,
      specifiedType: const FullType(String),
    );
    yield r'displayName';
    yield serializers.serialize(
      object.displayName,
      specifiedType: const FullType(String),
    );
    if (object.role != null) {
      yield r'role';
      yield serializers.serialize(
        object.role,
        specifiedType: const FullType(CreateUserBodyRoleEnum),
      );
    }
    if (object.securityQuestion != null) {
      yield r'securityQuestion';
      yield serializers.serialize(
        object.securityQuestion,
        specifiedType: const FullType(String),
      );
    }
    if (object.securityAnswer != null) {
      yield r'securityAnswer';
      yield serializers.serialize(
        object.securityAnswer,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateUserBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateUserBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.email = valueDes;
          break;
        case r'password':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.password = valueDes;
          break;
        case r'displayName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.displayName = valueDes;
          break;
        case r'role':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateUserBodyRoleEnum),
          ) as CreateUserBodyRoleEnum?;
          if (valueDes == null) continue;
          result.role = valueDes;
          break;
        case r'securityQuestion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.securityQuestion = valueDes;
          break;
        case r'securityAnswer':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.securityAnswer = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateUserBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateUserBodyBuilder();
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

class CreateUserBodyRoleEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'user')
  static const CreateUserBodyRoleEnum user = _$createUserBodyRoleEnum_user;
  @BuiltValueEnumConst(wireName: r'admin')
  static const CreateUserBodyRoleEnum admin = _$createUserBodyRoleEnum_admin;
  @BuiltValueEnumConst(wireName: r'super_admin')
  static const CreateUserBodyRoleEnum superAdmin = _$createUserBodyRoleEnum_superAdmin;

  static Serializer<CreateUserBodyRoleEnum> get serializer => _$createUserBodyRoleEnumSerializer;

  const CreateUserBodyRoleEnum._(String name): super(name);

  static BuiltSet<CreateUserBodyRoleEnum> get values => _$createUserBodyRoleEnumValues;
  static CreateUserBodyRoleEnum valueOf(String name) => _$createUserBodyRoleEnumValueOf(name);
}

