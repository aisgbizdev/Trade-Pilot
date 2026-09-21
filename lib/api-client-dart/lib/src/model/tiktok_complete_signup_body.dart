//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'tiktok_complete_signup_body.g.dart';

/// TiktokCompleteSignupBody
///
/// Properties:
/// * [email] 
@BuiltValue()
abstract class TiktokCompleteSignupBody implements Built<TiktokCompleteSignupBody, TiktokCompleteSignupBodyBuilder> {
  @BuiltValueField(wireName: r'email')
  String get email;

  TiktokCompleteSignupBody._();

  factory TiktokCompleteSignupBody([void updates(TiktokCompleteSignupBodyBuilder b)]) = _$TiktokCompleteSignupBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TiktokCompleteSignupBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TiktokCompleteSignupBody> get serializer => _$TiktokCompleteSignupBodySerializer();
}

class _$TiktokCompleteSignupBodySerializer implements PrimitiveSerializer<TiktokCompleteSignupBody> {
  @override
  final Iterable<Type> types = const [TiktokCompleteSignupBody, _$TiktokCompleteSignupBody];

  @override
  final String wireName = r'TiktokCompleteSignupBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TiktokCompleteSignupBody object, {
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
    TiktokCompleteSignupBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TiktokCompleteSignupBodyBuilder result,
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
  TiktokCompleteSignupBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TiktokCompleteSignupBodyBuilder();
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

