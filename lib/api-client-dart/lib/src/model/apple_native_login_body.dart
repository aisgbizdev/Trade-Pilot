//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'apple_native_login_body.g.dart';

/// AppleNativeLoginBody
///
/// Properties:
/// * [identityToken] - Apple identity token (JWT) from the device's native Sign in with Apple SDK. Never logged.
/// * [authorizationCode] - Apple authorization code from the same native sign-in. Never logged.
/// * [nonce] - The RAW nonce the client generated before sending its SHA-256 hash to Apple. Never logged.
/// * [givenName] - Optional, only present on the first authorization. Used only as a display-name candidate when creating a brand-new account.
/// * [familyName] - Optional, only present on the first authorization. Used only as a display-name candidate when creating a brand-new account.
@BuiltValue()
abstract class AppleNativeLoginBody implements Built<AppleNativeLoginBody, AppleNativeLoginBodyBuilder> {
  /// Apple identity token (JWT) from the device's native Sign in with Apple SDK. Never logged.
  @BuiltValueField(wireName: r'identityToken')
  String get identityToken;

  /// Apple authorization code from the same native sign-in. Never logged.
  @BuiltValueField(wireName: r'authorizationCode')
  String get authorizationCode;

  /// The RAW nonce the client generated before sending its SHA-256 hash to Apple. Never logged.
  @BuiltValueField(wireName: r'nonce')
  String get nonce;

  /// Optional, only present on the first authorization. Used only as a display-name candidate when creating a brand-new account.
  @BuiltValueField(wireName: r'givenName')
  String? get givenName;

  /// Optional, only present on the first authorization. Used only as a display-name candidate when creating a brand-new account.
  @BuiltValueField(wireName: r'familyName')
  String? get familyName;

  AppleNativeLoginBody._();

  factory AppleNativeLoginBody([void updates(AppleNativeLoginBodyBuilder b)]) = _$AppleNativeLoginBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AppleNativeLoginBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AppleNativeLoginBody> get serializer => _$AppleNativeLoginBodySerializer();
}

class _$AppleNativeLoginBodySerializer implements PrimitiveSerializer<AppleNativeLoginBody> {
  @override
  final Iterable<Type> types = const [AppleNativeLoginBody, _$AppleNativeLoginBody];

  @override
  final String wireName = r'AppleNativeLoginBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AppleNativeLoginBody object, {
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
    if (object.givenName != null) {
      yield r'givenName';
      yield serializers.serialize(
        object.givenName,
        specifiedType: const FullType(String),
      );
    }
    if (object.familyName != null) {
      yield r'familyName';
      yield serializers.serialize(
        object.familyName,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    AppleNativeLoginBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AppleNativeLoginBodyBuilder result,
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
        case r'givenName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.givenName = valueDes;
          break;
        case r'familyName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.familyName = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AppleNativeLoginBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AppleNativeLoginBodyBuilder();
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

