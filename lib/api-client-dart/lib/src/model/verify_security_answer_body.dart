//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'verify_security_answer_body.g.dart';

/// VerifySecurityAnswerBody
///
/// Properties:
/// * [email] 
/// * [securityAnswer] 
@BuiltValue()
abstract class VerifySecurityAnswerBody implements Built<VerifySecurityAnswerBody, VerifySecurityAnswerBodyBuilder> {
  @BuiltValueField(wireName: r'email')
  String get email;

  @BuiltValueField(wireName: r'securityAnswer')
  String get securityAnswer;

  VerifySecurityAnswerBody._();

  factory VerifySecurityAnswerBody([void updates(VerifySecurityAnswerBodyBuilder b)]) = _$VerifySecurityAnswerBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VerifySecurityAnswerBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VerifySecurityAnswerBody> get serializer => _$VerifySecurityAnswerBodySerializer();
}

class _$VerifySecurityAnswerBodySerializer implements PrimitiveSerializer<VerifySecurityAnswerBody> {
  @override
  final Iterable<Type> types = const [VerifySecurityAnswerBody, _$VerifySecurityAnswerBody];

  @override
  final String wireName = r'VerifySecurityAnswerBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VerifySecurityAnswerBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'email';
    yield serializers.serialize(
      object.email,
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
    VerifySecurityAnswerBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VerifySecurityAnswerBodyBuilder result,
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
  VerifySecurityAnswerBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VerifySecurityAnswerBodyBuilder();
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

