//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'apple_reauth_body.g.dart';

/// AppleReauthBody
///
/// Properties:
/// * [identityToken] - A FRESH Apple identity token for the same account. Never logged.
/// * [authorizationCode] - A FRESH Apple authorization code from the same sign-in. Never logged.
/// * [nonce] - The RAW nonce used for this fresh sign-in. Never logged.
@BuiltValue()
abstract class AppleReauthBody implements Built<AppleReauthBody, AppleReauthBodyBuilder> {
  /// A FRESH Apple identity token for the same account. Never logged.
  @BuiltValueField(wireName: r'identityToken')
  String get identityToken;

  /// A FRESH Apple authorization code from the same sign-in. Never logged.
  @BuiltValueField(wireName: r'authorizationCode')
  String get authorizationCode;

  /// The RAW nonce used for this fresh sign-in. Never logged.
  @BuiltValueField(wireName: r'nonce')
  String get nonce;

  AppleReauthBody._();

  factory AppleReauthBody([void updates(AppleReauthBodyBuilder b)]) = _$AppleReauthBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AppleReauthBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AppleReauthBody> get serializer => _$AppleReauthBodySerializer();
}

class _$AppleReauthBodySerializer implements PrimitiveSerializer<AppleReauthBody> {
  @override
  final Iterable<Type> types = const [AppleReauthBody, _$AppleReauthBody];

  @override
  final String wireName = r'AppleReauthBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AppleReauthBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'identityToken';
    yield serializers.serialize(
      object.identityToken,
      specifiedType: const FullType(String),
    );
    yield r'authorizationCode';
    yield serializers.serialize(
      object.authorizationCode,
      specifiedType: const FullType(String),
    );
    yield r'nonce';
    yield serializers.serialize(
      object.nonce,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AppleReauthBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AppleReauthBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'identityToken':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.identityToken = valueDes;
          break;
        case r'authorizationCode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.authorizationCode = valueDes;
          break;
        case r'nonce':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.nonce = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AppleReauthBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AppleReauthBodyBuilder();
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

