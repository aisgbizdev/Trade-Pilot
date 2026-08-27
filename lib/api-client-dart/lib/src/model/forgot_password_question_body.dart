//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'forgot_password_question_body.g.dart';

/// ForgotPasswordQuestionBody
///
/// Properties:
/// * [email] 
@BuiltValue()
abstract class ForgotPasswordQuestionBody implements Built<ForgotPasswordQuestionBody, ForgotPasswordQuestionBodyBuilder> {
  @BuiltValueField(wireName: r'email')
  String get email;

  ForgotPasswordQuestionBody._();

  factory ForgotPasswordQuestionBody([void updates(ForgotPasswordQuestionBodyBuilder b)]) = _$ForgotPasswordQuestionBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ForgotPasswordQuestionBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ForgotPasswordQuestionBody> get serializer => _$ForgotPasswordQuestionBodySerializer();
}

class _$ForgotPasswordQuestionBodySerializer implements PrimitiveSerializer<ForgotPasswordQuestionBody> {
  @override
  final Iterable<Type> types = const [ForgotPasswordQuestionBody, _$ForgotPasswordQuestionBody];

  @override
  final String wireName = r'ForgotPasswordQuestionBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ForgotPasswordQuestionBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ForgotPasswordQuestionBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ForgotPasswordQuestionBodyBuilder result,
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ForgotPasswordQuestionBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ForgotPasswordQuestionBodyBuilder();
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

