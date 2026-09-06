//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'reset_password_body.g.dart';

/// ResetPasswordBody
///
/// Properties:
/// * [resetToken] 
/// * [newPassword] 
@BuiltValue()
abstract class ResetPasswordBody implements Built<ResetPasswordBody, ResetPasswordBodyBuilder> {
  @BuiltValueField(wireName: r'resetToken')
  String get resetToken;

  @BuiltValueField(wireName: r'newPassword')
  String get newPassword;

  ResetPasswordBody._();

  factory ResetPasswordBody([void updates(ResetPasswordBodyBuilder b)]) = _$ResetPasswordBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ResetPasswordBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ResetPasswordBody> get serializer => _$ResetPasswordBodySerializer();
}

class _$ResetPasswordBodySerializer implements PrimitiveSerializer<ResetPasswordBody> {
  @override
  final Iterable<Type> types = const [ResetPasswordBody, _$ResetPasswordBody];

  @override
  final String wireName = r'ResetPasswordBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ResetPasswordBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'resetToken';
    yield serializers.serialize(
      object.resetToken,
      specifiedType: const FullType(String),
    );
    yield r'newPassword';
    yield serializers.serialize(
      object.newPassword,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ResetPasswordBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ResetPasswordBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'resetToken':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.resetToken = valueDes;
          break;
        case r'newPassword':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.newPassword = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ResetPasswordBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ResetPasswordBodyBuilder();
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

