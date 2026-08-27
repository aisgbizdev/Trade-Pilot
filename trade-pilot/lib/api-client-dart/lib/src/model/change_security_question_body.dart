//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'change_security_question_body.g.dart';

/// ChangeSecurityQuestionBody
///
/// Properties:
/// * [currentPassword] 
/// * [securityQuestion] 
/// * [securityAnswer] 
@BuiltValue()
abstract class ChangeSecurityQuestionBody implements Built<ChangeSecurityQuestionBody, ChangeSecurityQuestionBodyBuilder> {
  @BuiltValueField(wireName: r'currentPassword')
  String get currentPassword;

  @BuiltValueField(wireName: r'securityQuestion')
  String get securityQuestion;

  @BuiltValueField(wireName: r'securityAnswer')
  String get securityAnswer;

  ChangeSecurityQuestionBody._();

  factory ChangeSecurityQuestionBody([void updates(ChangeSecurityQuestionBodyBuilder b)]) = _$ChangeSecurityQuestionBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ChangeSecurityQuestionBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ChangeSecurityQuestionBody> get serializer => _$ChangeSecurityQuestionBodySerializer();
}

class _$ChangeSecurityQuestionBodySerializer implements PrimitiveSerializer<ChangeSecurityQuestionBody> {
  @override
  final Iterable<Type> types = const [ChangeSecurityQuestionBody, _$ChangeSecurityQuestionBody];

  @override
  final String wireName = r'ChangeSecurityQuestionBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ChangeSecurityQuestionBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'currentPassword';
    yield serializers.serialize(
      object.currentPassword,
      specifiedType: const FullType(String),
    );
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
  }

  @override
  Object serialize(
    Serializers serializers,
    ChangeSecurityQuestionBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ChangeSecurityQuestionBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'currentPassword':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.currentPassword = valueDes;
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ChangeSecurityQuestionBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ChangeSecurityQuestionBodyBuilder();
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

