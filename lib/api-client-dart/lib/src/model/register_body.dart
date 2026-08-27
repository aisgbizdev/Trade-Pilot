//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'register_body.g.dart';

/// RegisterBody
///
/// Properties:
/// * [email] 
/// * [password] 
/// * [displayName] 
/// * [selectedMode] 
/// * [securityQuestion] 
/// * [securityAnswer] 
/// * [rememberMe] 
@BuiltValue()
abstract class RegisterBody implements Built<RegisterBody, RegisterBodyBuilder> {
  @BuiltValueField(wireName: r'email')
  String get email;

  @BuiltValueField(wireName: r'password')
  String get password;

  @BuiltValueField(wireName: r'displayName')
  String get displayName;

  @BuiltValueField(wireName: r'selectedMode')
  RegisterBodySelectedModeEnum? get selectedMode;
  // enum selectedModeEnum {  beginner,  pro,  };

  @BuiltValueField(wireName: r'securityQuestion')
  String get securityQuestion;

  @BuiltValueField(wireName: r'securityAnswer')
  String get securityAnswer;

  @BuiltValueField(wireName: r'rememberMe')
  bool? get rememberMe;

  RegisterBody._();

  factory RegisterBody([void updates(RegisterBodyBuilder b)]) = _$RegisterBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RegisterBodyBuilder b) => b
      ..selectedMode = RegisterBodySelectedModeEnum.valueOf('beginner')
      ..rememberMe = false;

  @BuiltValueSerializer(custom: true)
  static Serializer<RegisterBody> get serializer => _$RegisterBodySerializer();
}

class _$RegisterBodySerializer implements PrimitiveSerializer<RegisterBody> {
  @override
  final Iterable<Type> types = const [RegisterBody, _$RegisterBody];

  @override
  final String wireName = r'RegisterBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RegisterBody object, {
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
    if (object.selectedMode != null) {
      yield r'selectedMode';
      yield serializers.serialize(
        object.selectedMode,
        specifiedType: const FullType(RegisterBodySelectedModeEnum),
      );
    }
    yield r'securityQuestion';
    yield serializers.serialize(
      object.securityQuestion,
      specifiedType: const FullType(String),
    );
    yield r'securityAnswer';
    yield serializers.serialize(
      object.securityAnswer,
      specifiedType: const FullType(String),
    );
    if (object.rememberMe != null) {
      yield r'rememberMe';
      yield serializers.serialize(
        object.rememberMe,
        specifiedType: const FullType(bool),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    RegisterBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RegisterBodyBuilder result,
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
        case r'selectedMode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(RegisterBodySelectedModeEnum),
          ) as RegisterBodySelectedModeEnum?;
          if (valueDes == null) continue;
          result.selectedMode = valueDes;
          break;
        case r'securityQuestion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.securityQuestion = valueDes;
          break;
        case r'securityAnswer':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.securityAnswer = valueDes;
          break;
        case r'rememberMe':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.rememberMe = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RegisterBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RegisterBodyBuilder();
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

class RegisterBodySelectedModeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'beginner')
  static const RegisterBodySelectedModeEnum beginner = _$registerBodySelectedModeEnum_beginner;
  @BuiltValueEnumConst(wireName: r'pro')
  static const RegisterBodySelectedModeEnum pro = _$registerBodySelectedModeEnum_pro;

  static Serializer<RegisterBodySelectedModeEnum> get serializer => _$registerBodySelectedModeEnumSerializer;

  const RegisterBodySelectedModeEnum._(String name): super(name);

  static BuiltSet<RegisterBodySelectedModeEnum> get values => _$registerBodySelectedModeEnumValues;
  static RegisterBodySelectedModeEnum valueOf(String name) => _$registerBodySelectedModeEnumValueOf(name);
}

