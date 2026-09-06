//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'reset_token_response.g.dart';

/// ResetTokenResponse
///
/// Properties:
/// * [resetToken] 
/// * [message] 
@BuiltValue()
abstract class ResetTokenResponse implements Built<ResetTokenResponse, ResetTokenResponseBuilder> {
  @BuiltValueField(wireName: r'resetToken')
  String get resetToken;

  @BuiltValueField(wireName: r'message')
  String get message;

  ResetTokenResponse._();

  factory ResetTokenResponse([void updates(ResetTokenResponseBuilder b)]) = _$ResetTokenResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ResetTokenResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ResetTokenResponse> get serializer => _$ResetTokenResponseSerializer();
}

class _$ResetTokenResponseSerializer implements PrimitiveSerializer<ResetTokenResponse> {
  @override
  final Iterable<Type> types = const [ResetTokenResponse, _$ResetTokenResponse];

  @override
  final String wireName = r'ResetTokenResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ResetTokenResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'resetToken';
    yield serializers.serialize(
      object.resetToken,
      specifiedType: const FullType(String),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ResetTokenResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ResetTokenResponseBuilder result,
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
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ResetTokenResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ResetTokenResponseBuilder();
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

