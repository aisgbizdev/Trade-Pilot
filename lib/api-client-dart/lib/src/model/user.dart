//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user.g.dart';

/// User
///
/// Properties:
/// * [id] 
/// * [email] 
/// * [displayName] 
/// * [avatarUrl] - Object-storage path (e.g. `/objects/uploads/uuid`) for the user's profile photo. Null if not set.
/// * [role] 
/// * [selectedMode] 
/// * [themePreference] 
/// * [securityQuestion] 
/// * [onboardingCompleted] 
/// * [createdAt] 
@BuiltValue()
abstract class User implements Built<User, UserBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'email')
  String get email;

  @BuiltValueField(wireName: r'displayName')
  String get displayName;

  /// Object-storage path (e.g. `/objects/uploads/uuid`) for the user's profile photo. Null if not set.
  @BuiltValueField(wireName: r'avatarUrl')
  String? get avatarUrl;

  @BuiltValueField(wireName: r'role')
  UserRoleEnum get role;
  // enum roleEnum {  user,  admin,  super_admin,  };

  @BuiltValueField(wireName: r'selectedMode')
  UserSelectedModeEnum get selectedMode;
  // enum selectedModeEnum {  beginner,  pro,  };

  @BuiltValueField(wireName: r'themePreference')
  UserThemePreferenceEnum get themePreference;
  // enum themePreferenceEnum {  light,  dark,  };

  @BuiltValueField(wireName: r'securityQuestion')
  String? get securityQuestion;

  @BuiltValueField(wireName: r'onboardingCompleted')
  bool get onboardingCompleted;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  User._();

  factory User([void updates(UserBuilder b)]) = _$User;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<User> get serializer => _$UserSerializer();
}

class _$UserSerializer implements PrimitiveSerializer<User> {
  @override
  final Iterable<Type> types = const [User, _$User];

  @override
  final String wireName = r'User';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    User object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
    yield r'displayName';
    yield serializers.serialize(
      object.displayName,
      specifiedType: const FullType(String),
    );
    if (object.avatarUrl != null) {
      yield r'avatarUrl';
      yield serializers.serialize(
        object.avatarUrl,
        specifiedType: const FullType(String),
      );
    }
    yield r'role';
    yield serializers.serialize(
      object.role,
      specifiedType: const FullType(UserRoleEnum),
    );
    yield r'selectedMode';
    yield serializers.serialize(
      object.selectedMode,
      specifiedType: const FullType(UserSelectedModeEnum),
    );
    yield r'themePreference';
    yield serializers.serialize(
      object.themePreference,
      specifiedType: const FullType(UserThemePreferenceEnum),
    );
    if (object.securityQuestion != null) {
      yield r'securityQuestion';
      yield serializers.serialize(
        object.securityQuestion,
        specifiedType: const FullType(String),
      );
    }
    yield r'onboardingCompleted';
    yield serializers.serialize(
      object.onboardingCompleted,
      specifiedType: const FullType(bool),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    User object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserBuilder result,
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
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.email = valueDes;
          break;
        case r'displayName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.displayName = valueDes;
          break;
        case r'avatarUrl':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.avatarUrl = valueDes;
          break;
        case r'role':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UserRoleEnum),
          ) as UserRoleEnum;
          result.role = valueDes;
          break;
        case r'selectedMode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UserSelectedModeEnum),
          ) as UserSelectedModeEnum;
          result.selectedMode = valueDes;
          break;
        case r'themePreference':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UserThemePreferenceEnum),
          ) as UserThemePreferenceEnum;
          result.themePreference = valueDes;
          break;
        case r'securityQuestion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.securityQuestion = valueDes;
          break;
        case r'onboardingCompleted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.onboardingCompleted = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  User deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserBuilder();
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

class UserRoleEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'user')
  static const UserRoleEnum user = _$userRoleEnum_user;
  @BuiltValueEnumConst(wireName: r'admin')
  static const UserRoleEnum admin = _$userRoleEnum_admin;
  @BuiltValueEnumConst(wireName: r'super_admin')
  static const UserRoleEnum superAdmin = _$userRoleEnum_superAdmin;

  static Serializer<UserRoleEnum> get serializer => _$userRoleEnumSerializer;

  const UserRoleEnum._(String name): super(name);

  static BuiltSet<UserRoleEnum> get values => _$userRoleEnumValues;
  static UserRoleEnum valueOf(String name) => _$userRoleEnumValueOf(name);
}

class UserSelectedModeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'beginner')
  static const UserSelectedModeEnum beginner = _$userSelectedModeEnum_beginner;
  @BuiltValueEnumConst(wireName: r'pro')
  static const UserSelectedModeEnum pro = _$userSelectedModeEnum_pro;

  static Serializer<UserSelectedModeEnum> get serializer => _$userSelectedModeEnumSerializer;

  const UserSelectedModeEnum._(String name): super(name);

  static BuiltSet<UserSelectedModeEnum> get values => _$userSelectedModeEnumValues;
  static UserSelectedModeEnum valueOf(String name) => _$userSelectedModeEnumValueOf(name);
}

class UserThemePreferenceEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'light')
  static const UserThemePreferenceEnum light = _$userThemePreferenceEnum_light;
  @BuiltValueEnumConst(wireName: r'dark')
  static const UserThemePreferenceEnum dark = _$userThemePreferenceEnum_dark;

  static Serializer<UserThemePreferenceEnum> get serializer => _$userThemePreferenceEnumSerializer;

  const UserThemePreferenceEnum._(String name): super(name);

  static BuiltSet<UserThemePreferenceEnum> get values => _$userThemePreferenceEnumValues;
  static UserThemePreferenceEnum valueOf(String name) => _$userThemePreferenceEnumValueOf(name);
}

