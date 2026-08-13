//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'security_question_response.g.dart';

/// SecurityQuestionResponse
///
/// Properties:
/// * [securityQuestion] 
/// * [email] 
@BuiltValue()
abstract class SecurityQuestionResponse implements Built<SecurityQuestionResponse, SecurityQuestionResponseBuilder> {
  @BuiltValueField(wireName: r'securityQuestion')
  String get securityQuestion;

  @BuiltValueField(wireName: r'email')
  String get email;

  SecurityQuestionResponse._();

  factory SecurityQuestionResponse([void updates(SecurityQuestionResponseBuilder b)]) = _$SecurityQuestionResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SecurityQuestionResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SecurityQuestionResponse> get serializer => _$SecurityQuestionResponseSerializer();
}

class _$SecurityQuestionResponseSerializer implements PrimitiveSerializer<SecurityQuestionResponse> {
  @override
  final Iterable<Type> types = const [SecurityQuestionResponse, _$SecurityQuestionResponse];

  @override
  final String wireName = r'SecurityQuestionResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SecurityQuestionResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'securityQuestion';
    yield serializers.serialize(
      object.securityQuestion,
      specifiedType: const FullType(String),
    );
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SecurityQuestionResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SecurityQuestionResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'securityQuestion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.securityQuestion = valueDes;
          break;
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.email = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SecurityQuestionResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SecurityQuestionResponseBuilder();
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

