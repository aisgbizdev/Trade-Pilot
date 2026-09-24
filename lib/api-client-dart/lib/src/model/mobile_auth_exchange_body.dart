//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'mobile_auth_exchange_body.g.dart';

/// MobileAuthExchangeBody
///
/// Properties:
/// * [code] - The opaque one-time code from the `code=` param of the id.tradepilot.app://auth/callback deep link.
/// * [codeVerifier] - The PKCE code_verifier that produced the code_challenge originally sent to the mobile /start endpoint.
@BuiltValue()
abstract class MobileAuthExchangeBody implements Built<MobileAuthExchangeBody, MobileAuthExchangeBodyBuilder> {
  /// The opaque one-time code from the `code=` param of the id.tradepilot.app://auth/callback deep link.
  @BuiltValueField(wireName: r'code')
  String get code;

  /// The PKCE code_verifier that produced the code_challenge originally sent to the mobile /start endpoint.
  @BuiltValueField(wireName: r'codeVerifier')
  String get codeVerifier;

  MobileAuthExchangeBody._();

  factory MobileAuthExchangeBody([void updates(MobileAuthExchangeBodyBuilder b)]) = _$MobileAuthExchangeBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MobileAuthExchangeBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MobileAuthExchangeBody> get serializer => _$MobileAuthExchangeBodySerializer();
}

class _$MobileAuthExchangeBodySerializer implements PrimitiveSerializer<MobileAuthExchangeBody> {
  @override
  final Iterable<Type> types = const [MobileAuthExchangeBody, _$MobileAuthExchangeBody];

  @override
  final String wireName = r'MobileAuthExchangeBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MobileAuthExchangeBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
    yield r'codeVerifier';
    yield serializers.serialize(
      object.codeVerifier,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MobileAuthExchangeBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MobileAuthExchangeBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        case r'codeVerifier':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.codeVerifier = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MobileAuthExchangeBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MobileAuthExchangeBodyBuilder();
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

